# Material Calculator – Build Prompt Sequence

A technology-agnostic prompt sequence for an agentic coding tool. You name no stack;
**Prompt 0 asks the agent to choose one.** Every later prompt stays focused on outcomes.

**How to use**
- Feed the prompts **in order**, one at a time.
- After Prompt 0, let the agent **lock in its chosen stack** before continuing.
- Keep the project brief (AGENTS.md) as the agent's **persistent context file**.
- Do **not** let it generate pages until the engine + constants tests pass (Prompt 2).
- Review the agent's **permissions** before granting destructive/file/terminal actions.

---

## Prompt 0 – Kickoff & architecture (agent chooses the stack)

```
I'm starting a new web product. Before writing any code, read this brief, ask any blocking
questions, then PROPOSE AN ARCHITECTURE and CHOOSE a modern, well-supported technology stack
yourself — optimized for an SEO-first site with many fast, mostly-static generated pages
(excellent Core Web Vitals) that is cheap to host, plus light client-side interactivity for
calculator tools. Briefly justify your stack choice, then scaffold the project skeleton and a
README.

PRODUCT: a home & garden MATERIAL ESTIMATOR website. Users enter the size/shape of a project
(and depth for bulk materials) and pick a material, and instantly get how much to buy in real
purchasable units (bags, cubic yards, tons, pallets, gallons, boxes, pieces), plus an optional
cost estimate from a price they enter.

AUDIENCE: US / English homeowners and DIYers.

BUSINESS MODEL: display advertising first, affiliate later (home-improvement retailers, since
users are about to buy the material). Priority: many indexable, fast, useful calculator and
reference pages, and high pages-per-session (link each calculator to related ones). The
calculators are the core value — a personalized estimate is computed from user input, so it
resists being answered inside a search engine's answer box.

KEY ADVANTAGE / CONSTRAINT: there is NO external data to source. Every result is area/volume
math plus publicly-known material constants (densities, coverage rates, bag yields). So the
MATH and the CONSTANTS must be correct, and we never rely on a third-party data feed.

NON-NEGOTIABLE CONSTRAINTS:
1. Calculation accuracy is critical (it's the whole product).
2. Each generated page must answer a DISTINCT question — no near-duplicate templates, and no
   mass-generated per-dimension pages.
3. Pages publish GRADUALLY over time, not all at once.
4. Start with a narrow MVP and expand later.

Deliverable for this step only: recommended architecture + stack (with a short rationale),
the project skeleton, and the README. Do not build features yet.
```

---

## Prompt 1 – MVP scope (the boundary)

```
Define and lock the MVP scope. v1 covers only the highest-intent OUTDOOR materials: mulch,
gravel/stone, topsoil, sand, sod, and concrete — each as a full calculator (shape options,
adjustable waste, purchase-unit output, optional cost) — plus "how to measure / how much do I
need" guides, the key conversion pages, a methodology page, and the legal pages. Indoor
materials (flooring, tile, paint, drywall, wallpaper, insulation) are out of scope until the
MVP ships. Keep this boundary in mind for the engine, the pages, and the content.
```

---

## Prompt 2 – Constants table + calculation engine + tests

```
First create a single source-of-truth constants file (in /docs) listing each MVP material's
density / coverage / bag-yield values WITH a source note for each (all values are public).
Include: 1 cubic yard = 27 cubic feet; mulch (2 cu ft bags, 13.5 bags/cu yd, default depth
2-3 in); gravel/stone and topsoil and sand densities in tons per cubic yard (per stone type
where relevant); concrete bag yields (80 lb ~0.6, 60 lb ~0.45, 40 lb ~0.3 cu ft); sod pallet
coverage.

Then implement the calculation engine using that file. General pattern: compute AREA
(rectangle L×W, circle πr², triangle, or sum of sub-areas for irregular shapes); for bulk
materials VOLUME = area × depth; apply the material constant; add an adjustable waste factor
with a sensible default; convert to the purchasable unit; optionally multiply by a
user-entered unit price for a cost estimate. Support feet/inches (and metric) input.

Write automated tests on representative cases: mulch volume -> cubic yards -> bag count;
concrete slab -> bag count for each bag size; irregular area as a sum of rectangles; unit
conversions. Make all tests pass before continuing. Do NOT generate pages until the math and
constants are provably correct.
```

---

## Prompt 3 – Core calculators

```
Build the core interactive calculators (one per MVP material) with clean, fast, mobile-first
interfaces. Each calculator must:
- offer shape options (rectangle, circle, triangle, irregular = add multiple sub-areas)
- take depth where the material is bulk
- let the user adjust the waste/overage factor (with a sensible default)
- output the result in the material's real purchase unit (bags, cubic yards, tons, pallets, etc.)
- offer an optional cost estimate from a user-entered unit price
- show the step-by-step calculation breakdown AND a short "how to measure your space" section
  (this builds trust and can't be reproduced in a search snippet)
Alongside each result, link to related calculators and a relevant guide so the page invites
further use instead of a single-answer bounce.
```

---

## Prompt 4 – Reference/conversion pages + guides + technical SEO

```
Generate the supporting pages, with clean URLs, each answering a DISTINCT real query:
- conversion/reference pages, e.g. "how many bags of mulch in a cubic yard", "how much does a
  yard of gravel weigh", "how much area does a gallon of paint cover"
- a "how much [material] do I need / how to measure" guide per MVP material
Add schema.org structured data, an XML sitemap, and clean internal linking between calculators
and guides. Ensure pages are statically generated or fully cached for excellent Core Web
Vitals. Do NOT mass-generate thin per-dimension pages.
```

---

## Prompt 5 – Methodology, legal & ad-readiness

```
Create the credibility/ad-ready content:
- a methodology/sources page that transparently lists every formula and the material constants
  used, with sources (this is important for trust/EEAT and for AdSense approval)
- the legal pages: About, Contact, Privacy Policy, Terms
Make sure navigation is clean, the site is mobile-first and fast, and every calculator links to
related calculators and guides to raise pages-per-session.
```

---

## Prompt 6 – Gradual publishing

```
Add a scheduled job that publishes newly generated pages GRADUALLY over time rather than all at
once, and that can be re-run as new materials/pages are added later. Make the cadence
configurable and render published pages to their fast/cached form.
```

---

### After the MVP ships
Expand in stages to INDOOR materials — flooring, tile, paint, drywall, wallpaper, insulation —
each as a calculator plus its conversion/reference pages and guides, dripping new pages over
time. Depth and internal linking grow topical authority; add affiliate "buy this material"
links once traffic is established.
