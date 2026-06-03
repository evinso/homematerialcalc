# Material Constants & Measurement Guide

> This is the single source-of-truth for all calculator math. The agent must use ONLY these
> values; do not invent or assume constants. When expanding to new materials, add them here
> FIRST, with a source note, before building the calculator.

---

## Universal Conversions

| From               | To                 | Factor                  |
|--------------------|--------------------|-------------------------|
| 1 cubic yard       | cubic feet         | 27                      |
| 1 cubic foot       | cubic inches       | 1,728                   |
| 1 cubic yard       | cubic inches       | 46,656                  |
| 1 ton (US short)   | pounds             | 2,000                   |
| 1 square yard      | square feet        | 9                       |
| 1 foot             | inches             | 12                      |
| 1 meter            | feet               | 3.281                   |
| 1 sq meter         | sq feet            | 10.764                  |

## Core Formulas

**Area:**
- Rectangle: length × width
- Circle: π × radius²
- Triangle: 0.5 × base × height
- Irregular: sum of sub-area rectangles/circles/triangles

**Volume (for bulk materials):**
- Volume (cu ft) = area (sq ft) × depth (inches) ÷ 12
- Volume (cu yd) = volume (cu ft) ÷ 27

**Weight:**
- Weight (tons) = volume (cu yd) × density (tons/cu yd)

**Bags needed:**
- Bags = volume (cu ft) ÷ bag yield (cu ft per bag) — **always round UP**

**Cost:**
- Total cost = quantity (in purchase unit) × user-entered unit price

**Waste/overage:**
- Adjusted quantity = base quantity × (1 + waste factor)
- Apply waste BEFORE rounding up to whole bags/units

---

## MVP Materials – Constants

### 1. Mulch

| Property             | Value                        | Source                    |
|----------------------|------------------------------|---------------------------|
| Purchase units       | cubic yards (bulk), 2 cu ft bags | Industry standard        |
| Bags per cu yd       | 13.5                         | 27 ÷ 2 = 13.5            |
| Default depth        | 3 inches                     | Landscaping best practice |
| Depth range          | 1–6 inches                   |                           |
| Default waste        | 5%                           |                           |

**Coverage per cubic yard by depth:**

| Depth (in) | Coverage (sq ft) |
|-----------|------------------|
| 1         | 324              |
| 2         | 162              |
| 3         | 108              |
| 4         | 81               |
| 6         | 54               |

Formula: coverage = 324 ÷ depth (inches)

**How to measure (show on calculator page):**
Measure the length and width of each bed in feet. For curved beds, break them into
approximate rectangles or use the circle/irregular option. Measure depth in inches — 2–3
inches is standard for existing beds, 3–4 inches for new beds or heavy weed suppression.
Multiply length × width × depth, and the calculator handles the rest.

---

### 2. Gravel / Crushed Stone

| Stone Type           | Density (tons/cu yd) | Density (lbs/cu yd) | Source           |
|----------------------|---------------------|---------------------|-------------------|
| Pea gravel           | 1.40                | 2,800               | Aggregate industry|
| Crushed stone (3/4") | 1.40                | 2,800               | Aggregate industry|
| Crushed limestone    | 1.50                | 3,000               | Aggregate industry|
| River rock (1–3")    | 1.35                | 2,700               | Aggregate industry|
| Decomposed granite   | 1.35                | 2,700               | Aggregate industry|

| Property             | Value              |
|----------------------|--------------------|
| Purchase units       | cubic yards, tons  |
| Default depth        | 2 inches           |
| Depth range          | 1–6 inches         |
| Default waste        | 10%                |

**How to measure:**
Measure the area in feet (length × width for rectangles; for paths, measure length × width
of the path). Decide on depth — 2 inches for decorative cover, 3–4 inches for driveways and
walkways. The calculator converts volume to tons using the stone type you select.

---

### 3. Topsoil

| Property             | Value                       | Source                   |
|----------------------|-----------------------------|---------------------------|
| Density              | 1.10 tons/cu yd (2,200 lbs) | Soil supplier standard    |
| Purchase units       | cubic yards (bulk), 40 lb bags, 1 cu ft bags |           |
| 40 lb bag yield      | ~0.75 cu ft                 | Manufacturer avg          |
| 1 cu ft bag yield    | 1.0 cu ft                   |                           |
| Bags (40 lb) per yd  | 36                          | 27 ÷ 0.75                |
| Default depth        | 4 inches                    | Garden bed standard       |
| Depth range          | 1–12 inches                 |                           |
| Default waste        | 5%                          |                           |

**How to measure:**
Measure the area of the bed or lawn section. For raised beds, measure internal dimensions.
Depth depends on use: 2 inches to top-dress a lawn, 4–6 inches for new garden beds, 8–12
inches for raised beds filled from scratch.

---

### 4. Sand

| Sand Type            | Density (tons/cu yd) | Density (lbs/cu yd) | Source            |
|----------------------|---------------------|---------------------|-------------------|
| All-purpose/fill     | 1.35                | 2,700               | Supplier standard |
| Paver/leveling sand  | 1.35                | 2,700               | Supplier standard |
| Play sand            | 1.30                | 2,600               | Supplier standard |
| Mason sand           | 1.30                | 2,600               | Supplier standard |

| Property             | Value                       |
|----------------------|-----------------------------|
| Purchase units       | cubic yards, tons, 50 lb bags |
| 50 lb bag yield      | ~0.50 cu ft                 |
| Bags (50 lb) per yd  | 54                          |
| Default depth        | 1 inch (paver base)         |
| Depth range          | 1–6 inches                  |
| Default waste        | 10%                         |

**How to measure:**
For paver base: measure the patio/walkway area; standard sand bed is 1 inch deep. For
sandboxes or fill: measure length × width × desired depth. The calculator converts to tons
or bags based on sand type.

---

### 5. Sod

| Property             | Value                         | Source                  |
|----------------------|-------------------------------|--------------------------|
| Purchase units       | sq ft, pieces, pallets        | Sod industry standard    |
| Piece size (common)  | 16" × 24" = 2.67 sq ft       | US standard piece        |
| Pieces per pallet    | ~170                          | Varies; 170 is common    |
| Pallet coverage      | ~450 sq ft                    | 170 × 2.67 ≈ 450        |
| Default waste        | 5% (simple shapes), 10% (curves/irregular) |              |

Note: sod is area-based only — no depth needed.

**How to measure:**
Measure the lawn area in feet. For irregular lawns, break into rectangles and add them.
Subtract areas you won't sod (existing trees, beds, hardscape). Add 5% for straight edges
or 10% for curved/irregular edges to account for trimming waste.

---

### 6. Concrete (bagged pre-mix)

| Bag Size   | Yield (cu ft) | Bags per cu yd | Source           |
|-----------|---------------|----------------|-------------------|
| 40 lb     | 0.30          | 90             | Quikrete specs    |
| 50 lb     | 0.375         | 72             | Quikrete specs    |
| 60 lb     | 0.45          | 60             | Quikrete specs    |
| 80 lb     | 0.60          | 45             | Quikrete specs    |

| Property             | Value                        |
|----------------------|------------------------------|
| Purchase units       | bags (by size), cubic yards   |
| Default thickness    | 4 inches (slab)              |
| Thickness range      | 2–12 inches                  |
| Default waste        | 10%                          |

**Special shapes:**
- Slab: rectangle area × thickness
- Post hole (cylinder): π × radius² × depth — offer a "post hole" option with common
  diameters (4", 6", 8", 10", 12") and depths (24", 36", 42", 48")
- Footing: rectangle area × depth

**How to measure:**
For slabs: measure length and width in feet; standard thickness is 4 inches. For post holes:
measure the hole diameter (or pick from common sizes) and depth. The calculator converts
volume to the number of bags based on the bag size you choose. Always buy a few extra bags
(the 10% overage accounts for spillage and uneven ground).

---

## Source Notes

All density and yield values are derived from:
- Major bag-mix manufacturers (Quikrete, Sakrete) for concrete yields
- Aggregate/landscape supplier industry standards for gravel, sand, topsoil densities
- US sod-farm standards for piece sizes and pallet coverage
- University extension service recommendations for mulch/soil depths
- Volume conversions are exact mathematical identities (1 cu yd = 27 cu ft)

These values are approximate averages; actual weights vary with moisture, compaction, and
product. The methodology page on the site should note this and recommend users confirm with
their local supplier for large orders.

---

## Future Materials (add here before building a calculator)

When expanding to indoor materials, add each one to this file with its constants and source
BEFORE implementing the calculator. Planned:
- Paint (coverage per gallon per coat, subtract openings)
- Flooring/laminate/vinyl (box coverage, waste by pattern)
- Tile (tile sizes, grout, thinset coverage)
- Drywall (sheet sizes, joint compound, tape, screws)
- Wallpaper (roll coverage, pattern repeat waste)
- Insulation (R-value, batt/roll coverage)
