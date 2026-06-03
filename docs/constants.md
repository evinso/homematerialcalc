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

## Indoor Materials — v2

---

### 7. Paint

| Property                  | Value                          | Source                              |
|---------------------------|--------------------------------|-------------------------------------|
| Coverage (standard)       | 350 sq ft / gallon / coat      | Sherwin-Williams, Benjamin Moore avg|
| Coverage (premium)        | 400 sq ft / gallon / coat      | Manufacturer specs                  |
| Coverage (primer)         | 250 sq ft / gallon             | Manufacturer avg (more absorption)  |
| Coverage (textured walls) | 250–300 sq ft / gallon / coat  | Industry estimate                   |
| Default coats             | 2                              | Industry standard for full coverage |
| Default waste             | 10%                            | Drips, touch-ups, uneven surfaces   |
| Standard door area        | 21 sq ft (3 ft × 7 ft)        | US standard interior door           |
| Standard window area      | 15 sq ft (3 ft × 5 ft)        | US standard window                  |
| Purchase unit             | gallons, quarts (0.25 gal)     |                                     |

**Formula:** Gallons = (Wall area − openings) × coats × (1 + waste) ÷ coverage, rounded up
**Wall area:** perimeter × ceiling height, then subtract openings

---

### 8. Flooring (Laminate / Vinyl Plank / Hardwood)

| Property              | Value                            | Source                          |
|-----------------------|----------------------------------|---------------------------------|
| Purchase unit         | boxes (coverage varies by brand) | Flooring industry standard      |
| Waste — straight lay  | 10%                              | NWFA installation guidelines    |
| Waste — diagonal lay  | 15%                              | NWFA installation guidelines    |
| Waste — complex rooms | 15%                              | Multiple cuts, L-shapes         |

Note: Box coverage varies by product. Common ranges:
- Vinyl plank (LVP): 20–23 sq ft/box (e.g., LifeProof, COREtec)
- Laminate: 20–25 sq ft/box (e.g., Pergo, Shaw)
- Engineered hardwood: 15–25 sq ft/box

User must enter their product's box coverage from the label.

**Formula:** Boxes = ceil(Area × (1 + waste) ÷ box coverage)

---

### 9. Tile

| Tile Size    | Sq ft per tile | Common use                    |
|--------------|---------------|-------------------------------|
| 4" × 4"      | 0.111 sq ft   | backsplash, small accent      |
| 6" × 6"      | 0.250 sq ft   | bathroom wall                 |
| 12" × 12"    | 1.000 sq ft   | floor, shower                 |
| 18" × 18"    | 2.250 sq ft   | floor, large rooms            |
| 24" × 24"    | 4.000 sq ft   | large format floor            |
| 3" × 6"      | 0.125 sq ft   | subway tile (backsplash, wall)|
| 4" × 16"     | 0.444 sq ft   | modern subway                 |

| Property              | Value                            | Source                        |
|-----------------------|----------------------------------|-------------------------------|
| Waste — straight lay  | 10%                              | TCNA Handbook                 |
| Waste — diagonal lay  | 15%                              | TCNA Handbook                 |
| Thinset (50 lb bag)   | ~40 sq ft coverage               | Manufacturer avg, 3/8" trowel |
| Grout (sanded, 10 lb) | ~50 sq ft (1/8" joint, 12×12)   | Laticrete / Custom Building   |

**Formula:** Tiles = ceil(Area × (1 + waste) ÷ sq ft per tile)

---

### 10. Drywall

| Sheet size  | Sq ft per sheet | Common use              |
|-------------|----------------|--------------------------|
| 4 × 8 ft   | 32 sq ft        | Standard (most common)  |
| 4 × 12 ft  | 48 sq ft        | Fewer seams, pro use    |
| 4 × 16 ft  | 64 sq ft        | Large rooms, commercial |

| Property                  | Value                           | Source                        |
|---------------------------|---------------------------------|-------------------------------|
| Waste                     | 10–15%                          | Drywall contractor standard   |
| Joint compound (5-gal)    | ~500 sq ft (3 coats)            | USG, National Gypsum specs    |
| Joint compound (1-gal)    | ~100 sq ft                      |                               |
| Drywall tape (75 ft roll) | ~1 roll per 3 sheets (4×8)     | Industry estimate             |
| Drywall screws (1 lb)     | ~35 per 4×8 sheet               | 12" on-center spacing         |

**Formula:** Sheets = ceil(Wall area × (1 + waste) ÷ sheet sq ft)

---

## Future Materials (not yet started)
- Wallpaper (roll coverage, pattern repeat waste)
- Insulation (R-value, batt/roll coverage)
