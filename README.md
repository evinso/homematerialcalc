# HomeMaterialCalc.com

Home & garden material estimator for US homeowners and DIYers.

## Stack

- **Astro** — static site generation, zero JS by default, excellent Core Web Vitals
- **React islands** — only the interactive calculator components load JS
- **Tailwind CSS** — mobile-first styling
- **TypeScript** — type-safe calculation engine
- **Vitest** — automated tests for the math engine

Hosting: Vercel / Netlify / Cloudflare Pages (static output, free tier)

## Project Structure

```
src/
  components/
    calculators/   # React island components (client-side interactive)
    ui/            # Shared Astro UI components
  layouts/         # BaseLayout.astro
  pages/
    index.astro
    calculator/    # /calculator/[material] pages
    guide/         # /guide/[slug] reference & how-to pages
  lib/
    engine/        # Calculation engine (pure TypeScript, no framework deps)
  content/
    guides/        # MDX guide content
    references/    # MDX reference page content
  styles/
    global.css
docs/
  constants.md     # Single source-of-truth for all material constants
prompts/
  build-prompts.md # Build prompt sequence (Prompt 0–6)
```

## MVP Materials

Outdoor only for v1: **mulch, gravel/stone, topsoil, sand, sod, concrete**

Indoor (v2): flooring, tile, paint, drywall, wallpaper, insulation

## Development

```bash
npm install
npm run dev       # localhost:4321
npm run build     # static output to ./dist
npm run test      # run calculation engine tests
```

## Key Rules

1. All material constants live in `docs/constants.md` — never hardcode in source.
2. Math tests must pass before any pages are generated.
3. No mass-generated thin pages — each page answers a distinct question.
4. Pages publish gradually via scheduled job (Prompt 6).
