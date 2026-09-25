# Mi plan de comidas — preview V1

## Product boundary

Implements the final decision in The_Chef_chat_plan_nutricional_2026-09-25.pdf, pages 6–9: estimate and inform; the user explicitly sets an energy goal; organize food. No automatic deficit, ideal macros, weight prediction, therapeutic diets, or adjustment from weight history. Commercial/legal/professional validation is still outstanding. The implementation does not establish a legal safe harbour.

Routes `/plan-semanal` (existing menu position) and `/plan-comidas`. Plans span 1–4 weeks. No-goal path asks for no anthropometric data. Main/production are excluded.

## Calculation

- Mifflin et al. 1990, original coefficients: REE = 9.99 × kg + 6.25 × cm − 4.92 × years + 5 (male) or −161 (female). Source: https://pubmed.ncbi.nlm.nih.gov/2305711/?format=pubmed . Original sample 498 healthy adults, ages 19–78. The calculator excludes other ages and asks the user to attest absence of the listed special situations (including underweight, pregnancy/lactation, illness, eating disorders, elite sport). This is a scope restriction, not medical screening.
- Activity intervals from FAO/WHO/UNU, Human Energy Requirements (2004), table 5.1: https://www.fao.org/4/y5686e/y5686e07.htm . Displays an interval rather than inventing an exact factor: 1.40–1.69 / 1.70–1.99 / 2.00–2.40. Exercise is already included, never added twice.
- Applying BMR-based PAL to estimated REE is an approximation, explicitly stated in the result/method. It is not independently validated as an individualized clinical model. Validation of this combination is a pre-commercialization dependency.
- Broad input sanity checks (20–500 kg, 50–250 cm) detect unit errors; they are NOT clinical safety thresholds or a claim that every value within them is covered by the original study. Eligibility remains limited as stated above.
- Goal and estimation are separate objects with separate timestamps; a calculation never accepts a goal. Macros are optional user inputs. 4/4/9 kcal per gram with 5% arithmetic tolerance detects inconsistent entered goals, not dietary suitability.
- User assigns percentages to planned meals. Missing/unplanned meals never constitute daily-target compliance. No default recommended distribution. The engine ranks compatible ordinary portions by proximity and variety, not by unrestricted multiplication to reach any entered number. Deviations remain visible.

## Nutrition and sources

Reuses attributed CoFID 2021 (Public Health England; Open Government Licence v3.0) and USDA SR Legacy 2018 ingredient rows already in `nutrition-ingredients.json`, keeping their source identifiers and assumptions. Sources/licences: https://www.gov.uk/government/publications/composition-of-foods-integrated-dataset-cofid and https://fdc.nal.usda.gov/ . No new scraping or licensed datasets are introduced. Existing audit: `docs/LIBRARY_NUTRITION.md` and `LIBRARY_NUTRITION_AUDIT.json`.

For the plan, nutrition is recomputed from the actual quantities returned by the same culinary scaling helper used in recipe ingredients. Per-ingredient amount × edible fraction × nutrient/100, summed, divided by diners. Unit weights, densities and frying absorption assumptions are reused. Optional ingredients are excluded. Missing ingredient mapping or nutrients yields null, propagated to meal/day totals, never zero. Unknown AI totals are deliberately not used. Fiber is calculated only with complete underlying coverage. This is a new planner view, not a change to the approved recipe PDF.

Six simple breakfast/snack preparations reuse the existing ingredients. These are culinary additions, not clinically balanced meal prescriptions. Lack of compatible choices remains an explicit gap.

Allergies: existing restriction guard plus planner-specific allergen terms, conservative exclusion of several composite ingredients and unmapped foods. Checks known ingredients, not trace contamination, manufacturer formulations, or synonyms in every language. It does not certify allergen-free meals. Complete structured allergen composition/editorial review is a prerequisite for stronger claims. No restriction is intentionally relaxed when no recipe is available.

## Privacy and persistence

Existing beta settings are plaintext browser storage; the planner does not place health profiles there. Session data live only in module memory, surviving in-app navigation but not a page reload. Raw calculator inputs are cleared after calculation. No account/cloud health persistence was activated.

User-requested export: encrypted JSON envelope, AES-GCM-256, independent random 16-byte salt and 12-byte IV, PBKDF2-HMAC-SHA256 600,000 iterations, password >=12 characters, confirmation before export. Password/key are never saved. Import authenticates ciphertext, limits file size to 10 MB, validates plan and recipe compatibility, then replaces session data. This protects the exported file, not a compromised/unlocked browser or a weak password. There is no password recovery. The user owns deletion of exported files. Session deletion does not silently erase the existing shopping list.

Weight entries have validated ISO dates, one record per day, edit/delete, chronological graph and min/max/change. No link from this data to calorie adjustment. Export includes weight and estimation only if present.

AI: initial planning is entirely local. Explicit consent and an explicit per-meal action are needed for network generation. Sends meal, diners, culinary preferences/restrictions (potentially sensitive, disclosed), time limit and language; not goal, age, sex, raw measurements, maintenance or weights. Existing gateway records only operation metrics. AI recipes remain in the session snapshot and are not registered/synced into the culinary catalog. No images are generated. Network tests are mocked; no real paid request is needed for QA.

Shopping: manual explicit export to the existing local shopping list, containing ingredients/amounts only. Uses a separate `meal-plan:` namespace; batch replacement is idempotent and preserves unrelated items. g/kg and ml/l normalize; compatible stock is deducted once across the entire plan. Unknown stock quantities are not deducted. Count units round upward after aggregation. No guessed commercial package sizes.

## Verification

`tests/meal-plan.spec.ts` covers formulas, domain limits, 1–4 weeks, restrictions and gaps, missing nutrition, quantity conversion, partial-day targets, explicit confirmation, navigation, replacement, idempotent shopping, independent weight edits, encrypted export/import/wrong password/deletion, and AI payload/rejection. Both Playwright device profiles are included in `test:preview`.

Remaining acceptance: physical-device usability, professional review of nutritional methodology and allergy coverage, legal/privacy/commercial review, and protected account persistence if desired. No claim of those acceptances is made by build or CI success.
