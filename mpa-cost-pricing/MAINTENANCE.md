# MPA Cost & Pricing Skill - Maintenance Guide

This guide documents how to update and maintain the MPA Cost & Pricing skill.

---

## Quick Reference

| Task | Command |
|------|---------|
| Update paper prices | Edit `references/master_stock_list.json` → Run `python scripts/generate_skill.py` |
| Add new paper stock | Add to `references/master_stock_list.json` → Run generator |
| Update equipment rates | Edit SKILL.md equipment section → Update version |
| Rebuild skill package | `cd mpa-cost-pricing && zip -r ../mpa-cost-pricing-vX.X.X.skill .` |

---

## Single Source of Truth: Price Data

**CRITICAL:** The file `references/master_stock_list.json` is the ONLY source for paper pricing data.

### Updating Paper Prices

When paper costs change (quarterly, vendor updates, etc.):

1. **Edit the JSON file:**
   ```bash
   # Open the master stock list
   nano mpa-cost-pricing/references/master_stock_list.json
   ```

2. **Update the `True_Cost_Per_Press_Sheet` values:**
   ```json
   {
     "Brand": "Endurance",
     "Basis_Weight": 100.0,
     "Weight_Unit": "lb",
     "Finish": "Gloss",
     "Stock_Type": "Cover",
     "Color": "",
     "SKU": "10735784",
     "Parent_Sheet_Size": "19X13",
     "True_Cost_Per_Press_Sheet": 0.0965  // ← Update this value
   }
   ```

3. **Run the generation script:**
   ```bash
   cd /path/to/test
   python mpa-cost-pricing/scripts/generate_skill.py
   ```

   This will:
   - Extract the top 20 most common stocks
   - Generate compact inline format for SKILL.md
   - Update the embedded section automatically
   - Create a backup of the full list

4. **Update version and changelog:**
   Edit `mpa-cost-pricing/SKILL.md` frontmatter:
   ```yaml
   version: 2.2.0  # Bump major/minor version for price updates
   price_data_effective: 2025-11-15  # Today's date
   changelog: |
     v2.2.0 (2025-11-15): Updated Q4 2025 paper pricing
     v2.1.0 (2025-11-01): Fixed equipment logic, optimized tokens
   ```

5. **Rebuild the skill package:**
   ```bash
   cd mpa-cost-pricing
   zip -r ../mpa-cost-pricing-v2.2.0.skill .
   cd ..
   ```

6. **Test with sample quotes:**
   ```bash
   # Load the skill in Claude and test:
   # "Quote 5,000 4×6 postcards on 100# Endurance Gloss Cover"
   # Verify the paper cost reflects new pricing
   ```

7. **Commit:**
   ```bash
   git add mpa-cost-pricing/
   git commit -m "Update paper pricing for Q4 2025 (v2.2.0)"
   git push
   ```

---

## Adding New Paper Stock

When MPA purchases new paper stock:

1. **Add to master stock list JSON:**
   ```json
   {
     "Brand": "NewBrand",
     "Basis_Weight": 100.0,
     "Weight_Unit": "lb",
     "Finish": "Matte",
     "Stock_Type": "Cover",
     "Color": "White",
     "SKU": "12345678",
     "Parent_Sheet_Size": "19X13",
     "True_Cost_Per_Press_Sheet": 0.0850
   }
   ```

2. **If it's a frequently-used stock (top 20):**
   - Edit `scripts/generate_skill.py`
   - Add SKU to the `TOP_20_SKUS` list
   - Run the generation script

3. **If it's occasional-use:**
   - Just add to JSON
   - It will be available via `references/master_stock_list.json` lookup

4. **Test:**
   Ask Marcus: "Quote 1,000 business cards on NewBrand 100# Matte Cover"
   - Verify SKU is found
   - Verify cost is correct

5. **Commit:**
   ```bash
   git add mpa-cost-pricing/references/master_stock_list.json
   git commit -m "Add NewBrand 100# Matte Cover stock (SKU 12345678)"
   ```

---

## Updating Equipment Rates

When equipment click costs change (service contracts, rate adjustments):

1. **Edit SKILL.md directly:**
   Find the equipment costs section and update:
   ```markdown
   **P-06** Xerox Nuvera B&W (Sheets) — $0.0030/click — ALL B&W sheet work
   ```

2. **Update version metadata:**
   ```yaml
   version: 2.3.0
   equipment_rates_effective: 2025-12-01
   changelog: |
     v2.3.0 (2025-12-01): Updated Nuvera click rate to $0.0030
   ```

3. **Test quotes:**
   - Quote B&W sheet jobs and verify new click costs
   - Check calculation accuracy

4. **Rebuild and commit:**
   ```bash
   cd mpa-cost-pricing && zip -r ../mpa-cost-pricing-v2.3.0.skill .
   git add mpa-cost-pricing/SKILL.md
   git commit -m "Update Nuvera equipment rate (v2.3.0)"
   ```

---

## Updating Mail Service Rates

When mail services pricing changes (S-01 to S-18):

1. **Edit SKILL.md mail services table:**
   ```markdown
   | S-01 | NCOA/CASS Data Processing | $0.008 | $10 min |  // ← Updated rate
   ```

2. **Update version and commit** (same process as equipment rates)

---

## Version Numbering Scheme

Use semantic versioning:

- **Major (X.0.0):** Price updates, equipment changes, major formula changes
  - Example: `2.0.0` - Q4 2025 price update

- **Minor (0.X.0):** New features, calculation logic improvements, new stocks
  - Example: `2.1.0` - Fixed equipment logic, optimized tokens

- **Patch (0.0.X):** Bug fixes, text improvements, documentation
  - Example: `2.1.1` - Fixed typo in markup formula

---

## File Structure

```
mpa-cost-pricing/
├── SKILL.md                          # Main skill file (Marcus persona + logic)
├── MAINTENANCE.md                    # This file
├── references/
│   ├── master_stock_list.json        # SINGLE SOURCE OF TRUTH for pricing
│   └── master_stock_list_full.json   # Auto-generated backup (all stocks)
└── scripts/
    └── generate_skill.py             # Auto-generates embedded section
```

---

## Testing Checklist

Before deploying a new skill version:

- [ ] Test standard postcard quote (verify paper pricing)
- [ ] Test B&W sheet job (verify Nuvera equipment selection)
- [ ] Test color sheet job (verify Iridesse equipment selection)
- [ ] Test envelope job <2K qty (verify Versant selection)
- [ ] Test envelope job ≥2K qty (verify Colormax selection)
- [ ] Test booklet quote (verify finishing costs)
- [ ] Test with mail services (verify NO markup applied)
- [ ] Verify $75 minimum enforced
- [ ] Check all prices to 2 decimal places

---

## Troubleshooting

### "SKU not found" errors

**Problem:** Marcus can't find a SKU when quoting.

**Solution:**
1. Check if SKU exists in `references/master_stock_list.json`
2. If missing, add it following "Adding New Paper Stock" instructions
3. If it's in top 20, run `python scripts/generate_skill.py`

### Prices seem outdated

**Problem:** Quotes show old paper costs.

**Solution:**
1. Check `price_data_effective` date in SKILL.md frontmatter
2. Update `references/master_stock_list.json`
3. Run generation script
4. Rebuild skill package

### Equipment selection errors

**Problem:** Marcus uses wrong equipment (e.g., Iridesse for B&W).

**Solution:**
1. Check SKILL.md equipment decision tree (should show B&W → Nuvera)
2. Verify critical checklist includes equipment validation
3. Test with explicit instructions: "This is a B&W job, which equipment?"

### Markup calculation errors

**Problem:** Mail services are being marked up.

**Solution:**
1. Check SKILL.md Step 2 markup formula
2. Should show: `(Paper + Clicks + Finishing) × Multiplier` THEN add mail
3. Verify critical checklist warns about this

---

## Support

For issues or questions:
1. Review this MAINTENANCE.md guide
2. Check the optimization analysis: `MPA-SKILL-OPTIMIZATION-ANALYSIS.md`
3. Test with Marcus directly in conversation mode
4. Review git history: `git log mpa-cost-pricing/`

---

**Last updated:** 2025-11-01
**Skill version:** 2.1.0
**Maintained by:** MPA Operations Team
