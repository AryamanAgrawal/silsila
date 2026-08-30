# Booking site → mobile program

Turn the Silsila: Resonance site from a ticket-selling page into a program you
hand people by link, read on a phone, in a seat at the Playhouse.

## Baseline (measured at 390 × 844)

Page is **9,521px** — roughly eleven screens.

| Section | Height | Note |
|---|---|---|
| Hero | 609 | ends on a "Book tickets" CTA |
| Statement | 638 | |
| The evening | 1,638 | |
| **Artists** | **3,148** | a third of the page |
| Listen | 1,288 | |
| Venue | 1,062 | |
| Tickets | 454 | |
| Footer | 606 | |

Artists is the problem. The 2/2/3 polaroid wall is a desktop composition; on a
phone it collapses to seven stacked near-full-width cards (measured 358, 374,
273, 285, 246, 229, 240), so the intended billing hierarchy reads as
inconsistent sizing. Bios then sit in a separate `<details>` list *below* all
seven, so a face and its bio can be ~2,000px apart.

Target: **under 5,000px**, with every artist's photo and bio in one place.

## Decisions taken

| | |
|---|---|
| Artists layout | Swipe carousel — polaroid strip, bio panel below the active card |
| Aryaman's instrument | Harmonium (replacing Aditya Pillai, dholak) |
| Closing red panel | "Stay in touch" — follow links for the series and artists |
| Navigation | Sticky bar, appears after the hero |
| Host | Ruh Arts Foundation, credited in hero, own About block, footer lockup |

## Work

### 1. Fix the duplicated layout
`src/pages/index.astro` nests `<Base>` inside itself. The whole `<head>`
renders twice — 64 head children, two `<title>` tags, every font preload
doubled. Delete the outer wrapper.

### 2. Hero → program cover
Keep the lockup, tagline and tarab-string motif; that is the identity. Drop
the "Book tickets" button. Collapse the three-item `<dl>` into one quiet line
(date · doors/curtain · venue). Aim for roughly one phone screen, with the nav
visible at the bottom edge.

### 3. Sticky jump-nav
Slim bar, appears on scroll past the hero: Evening · Artists · Listen · Venue.
Scroll-spy the active section. `scroll-padding-top` already exists in
`global.css` (84px) and will need retuning to the real bar height.

### 4. Artists carousel
One component, responsive rather than two implementations:

- Horizontal `scroll-snap` strip of polaroids, keeping the tape, tilt and
  deterministic per-card jitter from `Polaroid.astro`.
- Bio panel below shows the active artist: name, honorific, instrument, bio,
  press quotes, links.
- On wide screens the strip fits all seven at once, so it reads as a wall
  again; clicking a card swaps the panel.
- **All seven bios rendered in the DOM**, inactive ones hidden — so the text
  stays findable by search and readable without JS.
- Keyboard: arrow keys move between cards, cards are real buttons, panel is a
  live region.
- No-JS fallback: strip plus all bios in sequence.

Every card now needs a bio, because an empty panel is the most visible thing on
the page. Five are currently `bio: null`.

### 5. Ruh Arts Foundation
The host, and currently absent from the site entirely. Three placements:

- **Hero** — small "Presented by Ruh Arts Foundation" lockup with the mark,
  under the title. Hosts get the credit at the top.
- **About block** — the 501(c)(3) mission copy, sat next to `Statement.astro`.
  The two belong together: silsila is continuation, Ruh's line is *ensuring
  these endangered traditions endure*. Same idea, one stated as poetry and one
  as purpose.
- **Footer** — logo in the colophon with the 501(c)(3) line.

`event.presentedBy` is currently the bare string "Tehreem Khan". It needs to
become a structure that holds both the host organisation and the curator, and
`Base.astro`'s schema `organizer` should become the Organization.

The mark is black line art, which suits the palette. Rather than needing a
transparent asset for every field, the black-on-white file can sit on bone with
`mix-blend-mode: multiply` and the white-on-black file on plaster/sindoor with
`screen`. An SVG would be better than either — it is line art and will scale
crisply into the hero.

### 6. Closing panel → "Stay in touch"
Reuse the full-bleed sindoor block — it is the only saturated red beat in the
scroll. Same weight, new job: follow links for the series and the artists.

### 7. Footer → colophon
Practical detail (address, trains, times) moves up into the existing Venue
section, where it belongs before the show. Footer keeps credits, presented-by,
and a contact framed as questions on the night rather than a booking enquiry.

### 8. Replace Aditya with Aryaman
- `artists[]`: slug, name, instrument → harmonium, photo.
- `runOfShow[3].body` hardcodes *"Aditya Pillai on dholak"* in prose.
- `public/assets/artists/aditya.jpg` → `aryaman.jpg`.

Note: this puts Shiva on keyboard and Aryaman on harmonium in the same finale.
Both keyboard-family, worth a glance at the copy.

### 9. Metadata
Drop the `offers` block from the MusicEvent schema in `Base.astro`. Keep the
event, venue and performer markup — still correct, and it is what makes the
link preview useful when the program gets forwarded.

### 10. Mobile trim
Statement, Listen and Venue are padded for desktop. Tightening block padding on
small screens buys another screen or two.

## Content needed

- [x] Tehreem's bio — in `event.ts`
- [ ] Short bios (2–3 sentences) for Sikandar, Pranav, Shiva, Aryaman
- [x] Photo for Aryaman
- [ ] Handles for "Stay in touch" — series account, and which artists to list
- [x] **Ruh logo files** saved into `site/public/assets/motif/` — SVG preferred,
      otherwise both PNGs (`ruh-black.png`, `ruh-white.png`)
- [x] How Ruh and Tehreem are billed relative to each other
- [ ] Whether the 501(c)(3) status should carry a donate link

## Tasks

- [x] Remove the nested `<Base>` in `index.astro`
- [x] Rework `Hero.astro` — drop CTA, condense facts
- [x] Build sticky `ProgramNav.astro` with scroll-spy
- [x] Build `ArtistCarousel.astro` — snap strip, bio panel, keyboard, no-JS
- [x] Retire the `<details>` bio list in `Artists.astro`
- [x] Add Ruh credit to hero, `RuhAbout.astro` block, footer lockup
- [x] Restructure `event.presentedBy` to hold host + curator; update schema organizer
- [x] Rewrite `Tickets.astro` as `StayInTouch.astro`
- [x] Rework `SiteFooter.astro` as colophon; move practical info into `Venue.astro`
- [x] Swap Aditya → Aryaman in `event.ts`, run-of-show copy, and assets
- [x] Strip `offers` from schema in `Base.astro`
- [x] Trim mobile padding across Statement, Listen, Venue
- [x] Re-measure at 390px — 9,521 → 8,327 (a Host section was added; artists 3,148 → 1,731)
- [x] `pnpm typecheck`


## Outcome

| | Before | After |
|---|---|---|
| Page height at 390px | 9,521 | 8,327 |
| Artists section | 3,148 | 1,731 |
| Hero | 609 | 398 |
| `<title>` tags | 2 | 1 |

Short of the 5,000 target. The Host section is new (686px) and the three
content-heavy sections — the evening at 1,574, listen at 1,224, venue at 1,057
— are carrying real material rather than padding. Getting under 5,000 now means
cutting content, which is a separate decision.

Verified: carousel selects on tap and on swipe, keyboard arrows and Home/End
move between cards, one panel visible at a time, dots track. Sticky nav reveals
past the hero and its scroll-spy marks all four sections. No horizontal
overflow at 390 or 1280. Seven cards fit without scrolling at 1280.
`astro check` clean, production build clean.
