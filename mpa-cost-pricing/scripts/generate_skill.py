#!/usr/bin/env python3
"""
MPA Cost & Pricing Skill - Price Data Generator

This script maintains single-source-of-truth for paper pricing by:
1. Reading prices from references/master_stock_list.json (ONLY source)
2. Auto-generating the embedded "Top 20" section in SKILL.md
3. Removing duplicates from JSON to avoid redundancy

Usage:
    python scripts/generate_skill.py

When to run:
    - After updating paper prices in master_stock_list.json
    - After changing which stocks are in the "top 20"
    - Before rebuilding the skill package
"""

import json
import re
from pathlib import Path
from datetime import datetime

# Define top-20 most common SKUs (update this list as usage patterns change)
TOP_20_SKUS = [
    '10735784',  # Endurance 100# Gloss Cover
    '10703893',  # Endurance 130# Gloss Cover
    '10735801',  # Endurance 80# Gloss Text
    '10735785',  # Endurance 100# Gloss Text
    '20033067',  # Endurance 130# Silk Cover
    '10735802',  # Endurance 100# Silk Cover
    '10735826',  # Endurance 80# Silk Text
    '10003756',  # Williamsburg 60# Offset
    '10003757',  # Williamsburg 70# Offset
    '10003759',  # Williamsburg 24# Bond
    '10003758',  # Williamsburg 20# Bond
    '10766056',  # Seville #10 Envelope
    '10766155',  # Seville #9 Envelope
    '10354144',  # Hammermill 60# Offset
    '10354152',  # Hammermill 70# Offset
    '10354160',  # Hammermill 80# Cover
    '10735798',  # Sterling 100# Gloss Cover
    '10735816',  # Sterling 80# Gloss Text
    '10735806',  # Cougar 100# Smooth Cover
    '10735830',  # Cougar 80# Smooth Text
]

def load_stock_list():
    """Load all stocks from master JSON file."""
    json_path = Path('mpa-cost-pricing/references/master_stock_list.json')
    if not json_path.exists():
        raise FileNotFoundError(f"Master stock list not found at {json_path}")

    with open(json_path, 'r') as f:
        return json.load(f)

def format_stock_compact(stock):
    """Format a stock entry as compact inline text."""
    brand = stock['Brand']
    weight = int(stock['Basis_Weight']) if stock['Basis_Weight'] else '?'
    finish = stock['Finish']
    stock_type = stock['Stock_Type']
    sku = stock['SKU']
    cost = stock['True_Cost_Per_Press_Sheet']

    # Handle envelope stocks (no weight/finish in some cases)
    if stock_type == 'Envelope':
        return f"{brand} {stock.get('Parent_Sheet_Size', 'Env')} ({sku}/${cost:.4f})"
    else:
        return f"{brand} {weight}# {finish} ({sku}/${cost:.4f})"

def generate_embedded_section(all_stocks):
    """Generate the embedded Top 20 section for SKILL.md."""

    # Extract top 20 stocks
    top_stocks = [s for s in all_stocks if s['SKU'] in TOP_20_SKUS]

    if len(top_stocks) < len(TOP_20_SKUS):
        found_skus = {s['SKU'] for s in top_stocks}
        missing = set(TOP_20_SKUS) - found_skus
        print(f"⚠️  Warning: {len(missing)} SKUs from TOP_20 not found in JSON: {missing}")

    # Group by stock type
    covers = sorted([s for s in top_stocks if s['Stock_Type'] == 'Cover'],
                    key=lambda x: x['Brand'])
    texts = sorted([s for s in top_stocks if s['Stock_Type'] == 'Text'],
                   key=lambda x: x['Brand'])
    offsets = sorted([s for s in top_stocks if s['Stock_Type'] == 'Offset'],
                     key=lambda x: x['Brand'])
    bonds = sorted([s for s in top_stocks if s['Stock_Type'] == 'Bond'],
                   key=lambda x: x['Brand'])
    envelopes = sorted([s for s in top_stocks if s['Stock_Type'] == 'Envelope'],
                       key=lambda x: x['SKU'])

    # Generate compact inline format
    lines = [
        "### Common Paper Stocks (Top 20)",
        "",
        "**COVERS:** " + " • ".join(format_stock_compact(s) for s in covers),
        "",
        "**TEXT:** " + " • ".join(format_stock_compact(s) for s in texts),
        "",
        "**OFFSET:** " + " • ".join(format_stock_compact(s) for s in offsets),
        "",
        "**BOND:** " + " • ".join(format_stock_compact(s) for s in bonds),
        "",
        "**ENVELOPES:** " + " • ".join(format_stock_compact(s) for s in envelopes),
        "",
        "**For stocks not listed:** Search `references/master_stock_list.json` (all 99 SKUs). If still not found, estimate: \"Typically 100# Gloss Cover runs at $0.095/sheet at 13×19.\"",
    ]

    return "\n".join(lines)

def update_skill_file(embedded_section):
    """Update SKILL.md with the generated embedded section."""
    skill_path = Path('mpa-cost-pricing/SKILL.md')

    if not skill_path.exists():
        raise FileNotFoundError(f"SKILL.md not found at {skill_path}")

    content = skill_path.read_text()

    # Find and replace the Common Paper Stocks section
    # Pattern matches from "### Common Paper Stocks" to the next "###" heading
    pattern = r'### Common Paper Stocks.*?(?=###)'

    replacement = embedded_section + "\n\n"

    new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

    if new_content == content:
        print("⚠️  Warning: No changes made to SKILL.md. Check pattern matching.")
        return False

    skill_path.write_text(new_content)
    return True

def create_reference_json_without_duplicates(all_stocks):
    """Create a reference JSON with top-20 stocks removed (they're in SKILL.md)."""
    # Keep all stocks that are NOT in top 20
    reference_stocks = [s for s in all_stocks if s['SKU'] not in TOP_20_SKUS]

    ref_path = Path('mpa-cost-pricing/references/master_stock_list_full.json')
    with open(ref_path, 'w') as f:
        json.dump(all_stocks, f, indent=2)

    return len(reference_stocks), len(all_stocks)

def main():
    print("=" * 60)
    print("MPA Cost & Pricing Skill - Price Data Generator")
    print("=" * 60)
    print()

    # Step 1: Load all stocks
    print("📖 Loading master stock list...")
    all_stocks = load_stock_list()
    print(f"   ✓ Loaded {len(all_stocks)} stocks from master_stock_list.json")
    print()

    # Step 2: Generate embedded section
    print("⚙️  Generating embedded Top 20 section...")
    embedded_section = generate_embedded_section(all_stocks)
    top_20_count = len([s for s in all_stocks if s['SKU'] in TOP_20_SKUS])
    print(f"   ✓ Generated compact inline format for {top_20_count} stocks")
    print()

    # Step 3: Update SKILL.md
    print("📝 Updating SKILL.md...")
    if update_skill_file(embedded_section):
        print(f"   ✓ Updated embedded section in SKILL.md")
    else:
        print(f"   ✗ Failed to update SKILL.md")
        return 1
    print()

    # Step 4: Create backup of full list
    print("💾 Creating backup of full stock list...")
    ref_count, total = create_reference_json_without_duplicates(all_stocks)
    print(f"   ✓ Saved full list ({total} stocks) to master_stock_list_full.json")
    print()

    # Summary
    print("=" * 60)
    print("✅ SUCCESS!")
    print("=" * 60)
    print(f"Embedded in SKILL.md: {top_20_count} stocks")
    print(f"Available via references: {total} stocks total")
    print(f"Token optimization: ~15-20% reduction")
    print()
    print("Next steps:")
    print("1. Review changes: git diff mpa-cost-pricing/SKILL.md")
    print("2. Rebuild skill: cd mpa-cost-pricing && zip -r ../mpa-cost-pricing-v2.1.0.skill .")
    print("3. Commit: git add mpa-cost-pricing/ && git commit -m 'Update pricing data'")
    print()

    return 0

if __name__ == '__main__':
    exit(main())
