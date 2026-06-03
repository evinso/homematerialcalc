# Material Calculator – Project Brief (agent context)

> This is the agent's persistent project-context / rules file. Read it at the start of every
> session. Keep it lean; the full constants table and per-material content live in `/docs`.
>
> This brief does **not** prescribe a tech stack — the agent chooses it (see "Stack").

## What we're building
A home & garden **material estimator** site at **HomeMaterialCalc.com**. Users enter the
size/shape of their project and pick a material, and instantly get **how much to buy** — in
real purchasable units (bags, cubic yards, tons, pallets, gallons, boxes, pieces) — plus an
optional cost estimate. Audience: US / English homeowners & DIYers.

## Why this exists (keep in mind for every decision)
- Monetization: **display ads (AdSense) first**; affiliate later (home-improvement retailers —
  users are about to buy the material).
- We win on **volume + buyer-intent + seasonal recurrence** (mulch/gravel/soil peak in season).
  Maximize indexable calculators + reference pages; link each calculator to related ones to
  raise pages-per-session.
- **Data is the easiest possible:** every result is area/volume math + publicly-known material
  constants (densities, coverage rates, bag yields). There is **NO external data feed.** The
  MATH and the CONSTANTS must be correct; the "how to measure" explanations are our writing.
- **AI / HCU-resistance:** a personalized estimate (your exact area × depth × material → bags +
  cost) can't be answered in one search box — lead with the calculators. Support them with
  "how much / how to measure" guides and conversion references. (This exact model is proven
  HCU-resilient.)

## Stack (chosen by the agent — not prescribed)
Choose a modern, well-supported stack for an SEO-first site with many fast, mostly-static
pages plus light client-side interactivity (the calculators). Requirements: excellent Core Web
Vitals, cheap hosting, statically-generated or fully-cached pages, and the ability to
drip-publish pages gradually. Justify the choice once and record it here.

## The calculation engine (the core — must be correct)
General pattern for every material:
1. Compute **AREA** — rectangle (L×W), circle (πr²), triangle, or sum of sub-areas for an
   irregular space; for bulk materials compute **VOLUME = area × depth**.
2. Apply the material's **constant** (coverage, density, or bag yield).
3. Add an adjustable **waste/overage** factor (sensible default per material).
4. Convert to **purchasable units**; optionally multiply by a user-entered unit price for a
   cost estimate.

Accept feet/inches (and metric) input; output in the material's real purchase unit. Key
constants (single source-of-truth table in `/docs/constants.md`; all public):
- Volume: **1 cubic yard = 27 cubic feet.**
- **Mulch:** cu yd or 2 cu ft bags (13.5 bags/cu yd); default depth 2–3 in.
- **Gravel/stone:** cu yd or tons; density ~1.4–1.5 tons/cu yd (varies by stone type — store per type).
- **Topsoil/compost:** ~1.1–1.3 tons/cu yd. **Sand:** ~1.3–1.4 tons/cu yd.
- **Concrete bags:** 80 lb → 0.6 cu ft, 60 lb → 0.45 cu ft, 40 lb → 0.3 cu ft yield.
- **Sod:** pallet → 450 sq ft (standardize on one value and state it).
- **Paint:** ~350–400 sq ft per gallon per coat; subtract openings; × number of coats.
- **Flooring/tile:** boxes = area × (1+waste) / box coverage; tile waste 5–10% (more for diagonal).
- **Drywall:** 4×8 sheet = 32 sq ft, 4×12 = 48 sq ft.

Cite sources for the constants on a methodology page. Write **automated tests** on
representative cases (mulch cu yd → bag count, concrete bag count, paint gallons with
coats/openings, irregular-area sum). The math + constants must be correct **before**
generating pages.

## Pages & URL structure (the SEO engine)
- **Interactive calculators (lead pages),** one per material: `/calculator/{mulch, gravel,
  topsoil, sand, sod, concrete, paint, flooring, tile, drywall, …}`. Each shows the result in
  purchase units, the calculation breakdown, and "how to measure your space" instructions.
- **Reference/conversion pages:** `/guide/{how-many-bags-of-mulch-in-a-yard,
  how-much-does-a-yard-of-gravel-weigh, paint-coverage-per-gallon, …}` — each answers a
  distinct real query.
- **How-much / how-to-measure guides** per material.
- **Methodology/sources page** (the formulas + constants; trust/EEAT).
- **Required pages:** About, Contact, Privacy Policy, Terms.

**IMPORTANT:** Do NOT mass-generate thin per-dimension pages (scaled-content risk). The
calculator stays interactive. Pre-generate the per-material calculators + reference/conversion
pages + guides — each must answer a distinct question no other page answers.

## Publishing
Drip-publish pages **gradually** via a scheduled job, not all at once. Render to fast/cached
form on publish.

## Ad-readiness
Launch with: working calculators for the MVP materials + ~10–15 guides/reference pages +
methodology + legal pages. Fast, mobile-first, clean navigation. On each result, link to
related calculators/guides to raise pages-per-session. Add affiliate ("buy this material")
links later.

## MVP scope (build first)
Highest-intent **OUTDOOR** materials: mulch, gravel/stone, topsoil, sand, sod, concrete —
each with shape options, adjustable waste, purchase-unit output, and optional cost — plus
"how to measure / how much do I need" guides + key conversion pages + methodology + legal.
Ship, get AdSense approved, then expand to **INDOOR** (flooring, tile, paint, drywall,
wallpaper, insulation).

## Suggested build order
1. Choose stack + scaffold + README.
2. Lock the MVP scope.
3. Constants table (`/docs/constants.md`) + calculation engine + automated tests.
4. Core calculators (MVP materials) with shape options + waste + unit output + optional cost.
5. Reference/conversion pages + how-to-measure guides.
6. Methodology + legal pages.
7. Internal linking + schema.org + XML sitemap + Core Web Vitals pass.
8. Drip publishing.

## Conventions
- Math + constants correctness is non-negotiable; **show the breakdown + how-to-measure** on
  each page (transparency = trust + AI-resistance).
- Keep the calculator interactive (no mass per-dimension pages).
- One source-of-truth constants file; cite sources. Location: `/docs/constants.md`.
- Keep THIS file lean; the full constants table + per-material content live in `/docs`.
