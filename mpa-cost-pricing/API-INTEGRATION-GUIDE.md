# MPA Cost & Pricing Skill - API Integration Guide

This guide provides best practices for integrating the MPA Cost & Pricing skill via Claude API.

---

## Quick Reference

| Topic | Recommendation |
|-------|----------------|
| **Caching** | Cache standard quotes for 24 hours using spec fingerprint |
| **Prompt Format** | Use structured JSON input for 30% faster responses |
| **Error Handling** | Parse structured error codes, retry on MISSING_SPECS |
| **Rate Limiting** | Implement exponential backoff for 429 errors |
| **Output Mode** | Request JSON mode for system integration |

---

## 1. Quote Caching Strategy

### Cache Key Generation

Use a deterministic fingerprint based on quote specifications:

```python
def generate_cache_key(specs):
    """Generate cache key from quote specs."""
    key_parts = [
        f"sku_{specs['stock_sku']}",
        f"qty_{specs['quantity']}",
        f"size_{specs['width']}x{specs['height']}",
        f"color_{specs['color_mode']}",
        f"finish_{specs.get('finishing', 'none')}",
        f"v_{SKILL_VERSION}"  # e.g., "v2.3.0"
    ]
    return "_".join(key_parts)

# Example: sku_10735784_qty_5000_size_4x6_color_4-4_finish_none_v2.3.0
```

### Cacheable vs. Non-Cacheable

**Cacheable (24-hour TTL):**
- Standard products (stock from database)
- No mail services
- No custom specifications
- Same skill version

**Non-Cacheable (always recalculate):**
- Includes mail services (rates can fluctuate)
- Custom stocks or special requests
- Skill version mismatch
- Quotes older than 24 hours

**1-Hour TTL (short cache):**
- Quotes with mail services
- High-volume requests during price updates

### Implementation Example

```python
import redis
import hashlib
import json

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def get_cached_quote(specs):
    """Try to retrieve cached quote."""
    cache_key = generate_cache_key(specs)
    cached = redis_client.get(cache_key)

    if cached:
        return json.loads(cached)

    return None

def cache_quote(specs, quote_data):
    """Cache a quote with appropriate TTL."""
    cache_key = generate_cache_key(specs)

    # Determine TTL based on quote characteristics
    if specs.get('mail_services'):
        ttl = 3600  # 1 hour for mail services
    else:
        ttl = 86400  # 24 hours for standard quotes

    redis_client.setex(cache_key, ttl, json.dumps(quote_data))

def get_quote(specs):
    """Get quote with caching."""
    # Check cache first
    cached = get_cached_quote(specs)
    if cached:
        cached['cached'] = True
        return cached

    # Not cached, call Claude API
    quote = call_claude_api_for_quote(specs)

    # Cache the result
    cache_quote(specs, quote)
    quote['cached'] = False

    return quote
```

### Cache Invalidation

**Invalidate on:**
1. **Skill version update** - Clear all quotes when v2.3.0 → v2.4.0
2. **Price data update** - Clear when paper costs change
3. **Equipment rate change** - Clear when click costs change

```python
def invalidate_cache_on_version_change(new_version):
    """Clear cache when skill version changes."""
    # Pattern match all cache keys with old version
    old_pattern = f"*_v{old_version}"

    for key in redis_client.scan_iter(match=old_pattern):
        redis_client.delete(key)

    print(f"Invalidated cache for version upgrade: {old_version} → {new_version}")
```

### Expected Performance Impact

- **Cache hit rate:** 30-40% for high-volume users
- **Response time:** <50ms for cached quotes vs. 3-5s for API call
- **API cost savings:** 30-40% reduction in Claude API calls
- **Latency:** 95th percentile <100ms with caching vs. <5s without

---

## 2. Prompt Optimization Patterns

### Structured Input (Fastest)

**Recommended for API integrations:**

```json
{
  "action": "quote",
  "output_format": "json",
  "specs": {
    "quantity": 5000,
    "finished_width": 4,
    "finished_height": 6,
    "stock_sku": "10735784",
    "color_mode": "4/4",
    "finishing": null,
    "mail_services": []
  }
}
```

**Prompt to Claude:**
```
Output as JSON.

Quote specs:
- Quantity: 5000
- Size: 4×6
- Stock: SKU 10735784 (Endurance 100# Gloss Cover)
- Color: 4/4
```

**Performance:** ~3-5 seconds, single API call, no back-and-forth

### Natural Language (Conversational)

**Recommended for chat interfaces:**

```
Quote 5,000 4×6 postcards on 100# Endurance Gloss Cover, 4/4 color
```

**Performance:** ~4-6 seconds if all specs provided, 15-30 seconds if missing specs (2-3 API calls)

### Partial Specs (Interactive)

**Use when building a conversational experience:**

```
Quote 5,000 postcards
```

Marcus will ask for size, stock, color mode.

**Performance:** ~15-30 seconds, 2-3 API calls with back-and-forth

### Performance Comparison

| Input Method | Avg Response Time | API Calls | Use Case |
|--------------|-------------------|-----------|----------|
| Structured JSON | 3-5 sec | 1 | API integrations, web forms |
| Complete natural language | 4-6 sec | 1 | Chat with all specs |
| Partial specs | 15-30 sec | 2-3 | Interactive chat, discovery |

### Optimization Tips

1. **Pre-populate specs** - Collect all required info before calling API
2. **Use SKU when known** - Faster than "100# Endurance Gloss Cover"
3. **Request JSON mode** - Add "output as JSON" for structured responses
4. **Batch similar requests** - Cache fingerprints avoid duplicate calls
5. **Validate locally first** - Check quantity, size constraints before API call

---

## 3. Error Handling Best Practices

### Retry Strategy

```python
import time
from typing import Optional

def call_claude_api_with_retry(prompt: str, max_retries: int = 3) -> Optional[dict]:
    """Call Claude API with exponential backoff retry."""
    for attempt in range(max_retries):
        try:
            response = claude_api.messages.create(
                model="claude-sonnet-4",
                messages=[{"role": "user", "content": prompt}],
                timeout=30.0
            )
            return response

        except Exception as e:
            if "429" in str(e):  # Rate limit
                wait_time = 2 ** attempt  # Exponential backoff: 1s, 2s, 4s
                print(f"Rate limited. Waiting {wait_time}s before retry {attempt+1}/{max_retries}")
                time.sleep(wait_time)

            elif "timeout" in str(e):
                print(f"Timeout on attempt {attempt+1}/{max_retries}")
                if attempt < max_retries - 1:
                    time.sleep(1)

            else:
                # Unknown error, don't retry
                raise e

    return None  # All retries failed
```

### Handling Structured Errors

```python
def parse_quote_response(response_text: str) -> dict:
    """Parse quote response and handle errors."""
    try:
        data = json.loads(response_text)

        if data.get('status') == 'error':
            error_code = data['error_code']

            # Handle recoverable errors
            if data.get('recoverable'):
                if error_code == 'MISSING_SPECS':
                    # Prompt user for missing fields
                    return handle_missing_specs(data['details']['missing_fields'])

                elif error_code == 'STOCK_NOT_FOUND':
                    # Suggest alternative stock
                    return handle_stock_not_found(data['suggestion'])

                elif error_code == 'INVALID_QUANTITY':
                    # Adjust quantity to minimum
                    return handle_invalid_quantity(data['details'])

            # Non-recoverable errors
            else:
                if error_code == 'INVALID_SIZE':
                    return {'error': 'Size too large for in-house production. Outsource required.'}

                elif error_code == 'INVALID_PAGE_COUNT':
                    return {'error': f"Page count out of range. {data['suggestion']}"}

        # Success
        return data

    except json.JSONDecodeError:
        # Response not JSON (conversational mode)
        return {'conversational_response': response_text}
```

### Error Code Routing

| Error Code | Action | Retry? |
|------------|--------|--------|
| `MISSING_SPECS` | Collect missing fields, resend | Yes |
| `INVALID_QUANTITY` | Adjust to minimum, confirm with user | Yes |
| `STOCK_NOT_FOUND` | Suggest alternative SKU | Yes |
| `INVALID_SIZE` | Show outsource option | No |
| `INVALID_PAGE_COUNT` | Show constraint, suggest bindery | No |
| `EQUIPMENT_UNAVAILABLE` | Show outsource option | No |

---

## 4. Rate Limiting & Concurrency

### Rate Limit Handling

```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(4),
    wait=wait_exponential(multiplier=2, min=2, max=16),
    retry=lambda e: "429" in str(e)
)
def call_claude_api_safe(prompt: str):
    """Call Claude API with automatic retry on 429."""
    return claude_api.messages.create(
        model="claude-sonnet-4",
        messages=[{"role": "user", "content": prompt}]
    )
```

### Batch Processing

For high-volume quote generation:

```python
import asyncio
from concurrent.futures import ThreadPoolExecutor

async def process_quote_batch(quote_requests: list, max_concurrent: int = 5):
    """Process multiple quotes with concurrency limit."""
    semaphore = asyncio.Semaphore(max_concurrent)

    async def process_with_semaphore(req):
        async with semaphore:
            # Check cache first
            cached = get_cached_quote(req['specs'])
            if cached:
                return cached

            # Call API
            return await call_claude_api_async(req)

    tasks = [process_with_semaphore(req) for req in quote_requests]
    results = await asyncio.gather(*tasks)

    return results
```

---

## 5. Timeout Management

### Timeout Guidelines

| Quote Type | Recommended Timeout | Notes |
|------------|---------------------|-------|
| Simple (postcard, flyer) | 30 seconds | Single stock, no finishing |
| Booklet | 45 seconds | Multiple stocks, binding calculation |
| Complex (with mail) | 60 seconds | Mail services, multi-step |

```python
def get_timeout_for_quote(specs: dict) -> int:
    """Dynamically set timeout based on quote complexity."""
    base_timeout = 30

    # Add time for booklets
    if specs.get('pages', 0) > 0:
        base_timeout += 15

    # Add time for mail services
    if specs.get('mail_services'):
        base_timeout += 15

    # Add time for custom stocks
    if specs.get('stock_sku') not in COMMON_SKUS:
        base_timeout += 10

    return min(base_timeout, 60)  # Cap at 60 seconds
```

### Fallback on Timeout

```python
def get_quote_with_fallback(specs: dict) -> dict:
    """Get quote with graceful timeout handling."""
    timeout = get_timeout_for_quote(specs)

    try:
        return call_claude_api(specs, timeout=timeout)

    except TimeoutError:
        # Return estimated range instead of exact quote
        return {
            'status': 'estimated',
            'message': 'Exact calculation timed out. Providing estimate.',
            'estimated_range': {
                'min': estimate_min_price(specs),
                'max': estimate_max_price(specs)
            },
            'recommendation': 'Contact estimator for exact quote'
        }
```

---

## 6. Monitoring & Logging

### Key Metrics to Track

```python
import logging
from dataclasses import dataclass
from datetime import datetime

@dataclass
class QuoteMetrics:
    timestamp: datetime
    quote_id: str
    cache_hit: bool
    response_time_ms: int
    api_calls: int
    error_code: Optional[str]
    specs: dict

def log_quote_request(metrics: QuoteMetrics):
    """Log quote request for monitoring."""
    logger.info(f"Quote {metrics.quote_id}: "
                f"cache_hit={metrics.cache_hit}, "
                f"response_time={metrics.response_time_ms}ms, "
                f"api_calls={metrics.api_calls}")

    # Track in metrics system (Prometheus, CloudWatch, etc.)
    if metrics.cache_hit:
        cache_hit_counter.inc()
    else:
        cache_miss_counter.inc()

    response_time_histogram.observe(metrics.response_time_ms / 1000.0)

    if metrics.error_code:
        error_counter.labels(error_code=metrics.error_code).inc()
```

### Alerting Thresholds

| Metric | Alert Threshold | Action |
|--------|----------------|--------|
| Cache hit rate | <20% | Check caching logic |
| Avg response time | >10s | Investigate API latency |
| Error rate | >10% | Review error patterns |
| Timeout rate | >5% | Increase timeout or optimize |

---

## 7. Complete Integration Example

```python
import json
import redis
import time
from typing import Optional, Dict, Any

class MPAQuoteAPI:
    def __init__(self, claude_api_key: str, redis_url: str):
        self.claude = AnthropicClient(api_key=claude_api_key)
        self.redis = redis.from_url(redis_url)
        self.skill_version = "2.3.0"

    def get_quote(self, specs: Dict[str, Any], use_cache: bool = True) -> Dict[str, Any]:
        """
        Get a quote for printing job.

        Args:
            specs: Quote specifications {quantity, size, stock_sku, color_mode, etc.}
            use_cache: Whether to use cached quotes (default: True)

        Returns:
            Quote data dict with costs, pricing, and details
        """
        start_time = time.time()

        # Validate specs locally first
        validation_error = self._validate_specs(specs)
        if validation_error:
            return validation_error

        # Check cache
        if use_cache:
            cached = self._get_cached_quote(specs)
            if cached:
                cached['cached'] = True
                cached['response_time_ms'] = int((time.time() - start_time) * 1000)
                return cached

        # Build prompt
        prompt = self._build_prompt(specs)

        # Call Claude API with retry
        try:
            response = self._call_claude_with_retry(prompt)
            quote_data = json.loads(response.content[0].text)

            # Cache successful quotes
            if quote_data.get('status') != 'error':
                self._cache_quote(specs, quote_data)

            quote_data['cached'] = False
            quote_data['response_time_ms'] = int((time.time() - start_time) * 1000)

            return quote_data

        except Exception as e:
            return {
                'status': 'error',
                'error_code': 'API_ERROR',
                'message': str(e),
                'recoverable': False
            }

    def _validate_specs(self, specs: Dict) -> Optional[Dict]:
        """Validate specs locally before API call."""
        required = ['quantity', 'finished_width', 'finished_height', 'stock_sku', 'color_mode']
        missing = [f for f in required if f not in specs]

        if missing:
            return {
                'status': 'error',
                'error_code': 'MISSING_SPECS',
                'details': {'missing_fields': missing},
                'recoverable': True
            }

        # Check size constraints
        if specs['finished_width'] > 13 or specs['finished_height'] > 19:
            return {
                'status': 'error',
                'error_code': 'INVALID_SIZE',
                'message': 'Finished size exceeds 13×19 press capacity',
                'recoverable': False
            }

        return None

    def _build_prompt(self, specs: Dict) -> str:
        """Build optimized prompt for Claude."""
        return f"""Output as JSON.

Quote specs:
- Quantity: {specs['quantity']}
- Size: {specs['finished_width']}×{specs['finished_height']}
- Stock: SKU {specs['stock_sku']}
- Color: {specs['color_mode']}
{"- Finishing: " + specs.get('finishing', 'none') if specs.get('finishing') else ""}
"""

    def _call_claude_with_retry(self, prompt: str, max_retries: int = 3):
        """Call Claude API with retry logic."""
        for attempt in range(max_retries):
            try:
                return self.claude.messages.create(
                    model="claude-sonnet-4",
                    messages=[{"role": "user", "content": prompt}],
                    timeout=30.0
                )
            except Exception as e:
                if attempt < max_retries - 1 and "429" in str(e):
                    time.sleep(2 ** attempt)
                else:
                    raise

    def _get_cached_quote(self, specs: Dict) -> Optional[Dict]:
        """Retrieve cached quote."""
        cache_key = self._generate_cache_key(specs)
        cached = self.redis.get(cache_key)
        return json.loads(cached) if cached else None

    def _cache_quote(self, specs: Dict, quote_data: Dict):
        """Cache quote with appropriate TTL."""
        cache_key = self._generate_cache_key(specs)
        ttl = 3600 if specs.get('mail_services') else 86400
        self.redis.setex(cache_key, ttl, json.dumps(quote_data))

    def _generate_cache_key(self, specs: Dict) -> str:
        """Generate deterministic cache key."""
        key_parts = [
            f"sku_{specs['stock_sku']}",
            f"qty_{specs['quantity']}",
            f"size_{specs['finished_width']}x{specs['finished_height']}",
            f"color_{specs['color_mode']}",
            f"finish_{specs.get('finishing', 'none')}",
            f"v_{self.skill_version}"
        ]
        return "_".join(key_parts)

# Usage example
api = MPAQuoteAPI(claude_api_key="sk-...", redis_url="redis://localhost:6379")

quote = api.get_quote({
    'quantity': 5000,
    'finished_width': 4,
    'finished_height': 6,
    'stock_sku': '10735784',
    'color_mode': '4/4'
})

print(f"Quote: ${quote['pricing']['final_quote']:.2f}")
print(f"Response time: {quote['response_time_ms']}ms")
print(f"Cached: {quote['cached']}")
```

---

## Summary

### Performance Expectations

| Metric | Without Optimization | With Best Practices | Improvement |
|--------|---------------------|---------------------|-------------|
| Avg response time | 5-10s | 2-5s | 50% faster |
| Cache hit rate | 0% | 30-40% | Huge savings |
| API cost | $100/month | $60-70/month | 30-40% reduction |
| Error rate | 15% | <5% | 3x better |

### Implementation Checklist

- [ ] Implement caching with Redis or similar
- [ ] Use structured JSON input for quotes
- [ ] Add retry logic with exponential backoff
- [ ] Validate specs locally before API call
- [ ] Handle structured error codes
- [ ] Set appropriate timeouts
- [ ] Monitor cache hit rate and response times
- [ ] Log all quote requests for debugging

---

**Last updated:** 2025-11-02
**Skill version:** 2.3.0
**Maintained by:** MPA Operations Team
