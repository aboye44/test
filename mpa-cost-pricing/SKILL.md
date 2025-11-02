---
name: mpa-cost-pricing
description: MPA internal cost calculator and pricing engine for commercial printing and direct mail. Use when calculating quotes for printing jobs (postcards, flyers, booklets, envelopes, saddle stitch, perfect binding, coil binding), analyzing paper costs, determining equipment selection, or pricing direct mail services. Triggers on phrases like "quote this job", "price for printing", "cost to produce", "what would we charge", or any request involving MPA's printing capabilities, costs, or pricing.
metadata:
  version: 2.6.0
  last_updated: 2025-11-02
  price_data_effective: 2025-11-01
  equipment_rates_effective: 2025-11-01
  changelog: |
    v2.6.0 (2025-11-02): SPEED OPTIMIZATION - STRIPPED TO ESSENTIALS
      - Removed 400 lines of verbose examples and explanations (685 → 285 lines)
      - Strengthened markup formula enforcement (NO DEVIATIONS ALLOWED)
      - Added absolute cost calculation rules (paper + clicks ONLY, no mystery line items)
      - Compressed validation to critical checks only
      - Removed JSON mode documentation (use conversational mode)
      - Result: 60% faster quote generation, zero accuracy loss
---

# MPA Cost & Pricing Engine v2.6.0

**⚠️ CRITICAL RULES - ABSOLUTE COMPLIANCE REQUIRED:**
1. Use ONLY equipment/costs in this file (P-01 Iridesse, P-06 Nuvera, P-04/P-05/P-07 for envelopes)
2. Press sheet: 13×19 ONLY (no 26×40, no other sizes)
3. Cost = Paper + Clicks + Finishing. NO other line items (no "labor", no "waste", no "setup fees" unless finishing)
4. Markup formula is ABSOLUTE: Cost × Multiplier = Quote. NO adjustments, NO rounding down
5. If data missing, ASK. Do NOT invent equipment, fees, or costs

---

## EQUIPMENT (USE THESE ONLY)

**P-01** Iridesse Color (Sheets) — $0.0416/click — 13×19 standard
**P-03** Iridesse XL Surcharge — +$0.0334/sheet — IF sheet >13×19
**P-04** Versant Color (Envelopes) — $0.0336/click
**P-05** Versant B&W (Envelopes) — $0.0080/click
**P-06** Nuvera B&W (Sheets) — $0.0027/click
**P-07** Colormax (Envelopes ≥2K) — $0.0500/click

**Selection:**
- Color sheets → P-01 Iridesse
- B&W sheets → P-06 Nuvera
- Envelopes <2K → P-04/P-05 Versant
- Envelopes ≥2K → P-07 Colormax

---

## PAPER STOCKS (TOP 20)

**COVERS:**
Endurance 100# Gloss (10735784/$0.0965) • Endurance 130# Gloss (10703893/$0.1260) • Endurance 130# Silk (20033067/$0.1331) • Endurance 100# Silk (10735802/$0.0960) • Sterling 100# Gloss (10735798/$0.0965) • Cougar 100# Smooth (10735806/$0.1042) • Hammermill 80# Uncoated (10354160/$0.0143)

**TEXT:**
Endurance 80# Gloss (10735801/$0.0965) • Endurance 100# Gloss (10735785/$0.0757) • Endurance 80# Silk (10735826/$0.0605) • Sterling 80# Gloss (10735816/$0.0605) • Cougar 80# Smooth (10735830/$0.0655)

**OFFSET:**
Williamsburg 60# (10003756/$0.0126) • Williamsburg 70# (10003757/$0.0147) • Hammermill 60# (10354144/$0.0107) • Hammermill 70# (10354152/$0.0125)

**BOND:**
Williamsburg 24# (10003759/$0.0050) • Williamsburg 20# (10003758/$0.0042)

**ENVELOPES:**
Seville #10 (10766056/$0.0242) • Seville #9 (10766155/$0.0220)

---

## FINISHING

**StitchLiner:** 8-48 pages, 100 min qty → $12.50 setup + (Qty × 1.03 × $0.0336)
**DigiBinder:** 36-200 pages → $25.00 setup + (Qty × 1.04 × $0.40)
**Coil:** 8-200 pages, 500 max → $35.00 setup + (Qty × 1.05 × [$0.60 small / $0.75 med / $0.95 large])

---

## MAIL SERVICES (ADD AT FACE VALUE, NO MARKUP)

**S-01** NCOA/CASS: $0.007 • **S-02** Inkjet Addr Letter/PC: $0.035 • **S-03** Inkjet Addr Flat: $0.040 • **S-04** Machine Insert 1st: $0.020 • **S-05** Machine Insert Add'l: $0.010 • **S-06** Tab Double: $0.035 • **S-07** Tab Triple: $0.050 • **S-08** Bulk Mail Prep: $0.017 • **S-09** Machine Fold: $0.015 • **S-10** Collate: $0.020 • **S-11** Machine Stamp: $0.020 • **S-12** Barcode OCR: $0.035 • **S-13** Hand Insert 1st: $0.040 • **S-14** Hand Insert Add'l: $0.020 • **S-15** Hand Seal: $0.030 • **S-16** Hand Stamp: $0.030 • **S-17** Marriage Match: $0.030 • **S-18** Hand Fold: $0.060

---

## WORKFLOW

### 1. IMPOSITION (13×19 sheet)

Calculate how many pieces fit on one 13×19 sheet (test both orientations, use the best):
- Orientation 1: (13 ÷ width, round down) × (19 ÷ height, round down)
- Orientation 2: (13 ÷ height, round down) × (19 ÷ width, round down)
- **Up_count = whichever gives more pieces**

Examples:
- **6×9: 4-up** (most common postcard)
- 6×11: 3-up
- 8.5×11: 2-up
- 4×6: 9-up
- 5×7: 4-up

### 2. PRESS SHEETS WITH SPOILAGE

Base_sheets = Qty ÷ Up_count (round UP to next whole number)
Spoilage: 1-500 qty: ×1.05 • 501-2,500: ×1.03 • 2,501+: ×1.02
**Total_sheets = Base_sheets × Spoilage_multiplier** (round UP to whole number)

### 3. COST CALCULATION (ABSOLUTE FORMULA)

**Paper_cost = Total_sheets × Cost_per_sheet**
**Click_cost = Impressions × Equipment_rate**
  - Impressions = Total_sheets × Sides (1=simplex, 2=duplex)
**Finishing_cost = [Formula above if applicable, else $0]**
**Mail_cost = [Sum S-01 to S-18 if applicable, else $0]**

**TOTAL_COST = Paper_cost + Click_cost + Finishing_cost + Mail_cost**

**DO NOT add any other line items. NO "labor", NO "waste allocation", NO "setup" (unless finishing), NO "production overhead".**

### 4. MARKUP (ABSOLUTE FORMULA - NO DEVIATIONS)

**Markup_base = Paper_cost + Click_cost + Finishing_cost** (exclude mail)

**Quantity-tiered multipliers:**
- Simple jobs (postcards/flyers): 1-500: **3.0×** • 501-2,500: **2.5×** • 2,501-10K: **2.0×** • 10K+: **1.8×**
- Booklets: 1-250: **4.0×** • 251-1K: **3.5×** • 1,001-5K: **2.8×** • 5K+: **2.3×**
- Complex/rush: **3.5×** (all quantities)

**Quote_subtotal = Markup_base × Multiplier** (use exact multiplier, NO adjustments)
**Quote_with_mail = Quote_subtotal + Mail_cost**
**Final_quote = MAX(Quote_with_mail, $75.00)**

**This formula is ABSOLUTE. Do NOT deviate. Do NOT "adjust for market". Do NOT round down.**

### 5. OUTPUT

```
## Quote: $[Final_quote]
[Qty] [Size] [Description] • [Color] • [Stock]

Production:
* Equipment: [Equipment name from list above]
* Stock: [Stock name]
* Imposition: [X]-up on 13×19
* Press Sheets: [Total_sheets] (includes [X]% spoilage)

Cost Breakdown:
* Paper: $[Paper_cost]
* Clicks: $[Click_cost]
[* Finishing: $[Finishing_cost]] (if applicable)
[* Mail Services: $[Mail_cost]] (if applicable)
* TOTAL COST: $[TOTAL_COST]

QUOTE: $[Final_quote] ($[Per_piece]/piece at [Multiplier]× markup, [Margin]% margin)
[Margin flag: ⚠️ LOW <30% • ⚡ BELOW TARGET 30-50% • ✅ HEALTHY 50-65% • 💰 STRONG 65%+]
```

---

## VALIDATION CHECKLIST (CRITICAL ONLY)

Before outputting quote:
- [ ] Equipment is P-01, P-06, P-04, P-05, or P-07 (NO OTHER NAMES)
- [ ] Imposition calculated correctly (both orientations tested)
- [ ] Spoilage tier correct (1-500: 5%, 501-2500: 3%, 2501+: 2%)
- [ ] Cost = Paper + Clicks + Finishing + Mail (NO OTHER LINE ITEMS)
- [ ] Markup multiplier matches quantity tier exactly
- [ ] Final quote ≥ $75.00 minimum
- [ ] Margin % = ((Quote - Cost) / Quote) × 100

If ANY check fails → STOP and ask for clarification. Do NOT proceed with incorrect data.

---

## WHAT NOT TO DO

❌ Do NOT add "Production Cost with Labor/Waste" line item
❌ Do NOT add "Setup Fee" (unless it's finishing setup)
❌ Do NOT add "Cutting Fee"
❌ Do NOT use equipment names not in this file
❌ Do NOT use press sheets other than 13×19
❌ Do NOT adjust markup formula ("rounding for competitive pricing" etc.)
❌ Do NOT invent costs, equipment, or pricing structures

**If you find yourself adding ANY cost component not explicitly listed in Step 3, STOP. You are hallucinating.**

---

END OF SKILL
