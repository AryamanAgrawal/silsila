# silsila: Resonance

Event site for **Silsila: Resonance**, an evening of South Asian classical music
at Abrons Arts Center, New York, on Sunday 30 August 2026.

Live at <https://aryamanagrawal.github.io/silsila/>

| | |
|---|---|
| `site/` | The Astro site |
| `design-sheet.html` | Design system and layout proposal, with live GSAP demos. Open it in a browser. |
| `assets/` | Artwork extracted from the poster: portraits, textures, tape, the Abrons lockup |
| `SILSILA.pdf` | The source poster deck, from which every colour, typeface and texture is derived |

## Editing content

Everything the page says lives in `site/src/data/event.ts`: the date, times,
venue, ticket link, artists and bios, the run of show, and the album. Change it
there and the hero, marquee, schema.org markup and the `.ics` file all follow.

## Commands

```sh
cd site
pnpm install
pnpm dev        # http://localhost:4321/silsila
pnpm build
pnpm preview
pnpm typecheck  # astro check
```

TypeScript is pinned to 6.x: `astro check` relies on a programmatic API that
TypeScript 7's native compiler does not expose yet.

## Deploy

Pushing to `main` builds `site/` and publishes it to GitHub Pages via
`.github/workflows/deploy.yml`.
