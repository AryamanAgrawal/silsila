# Programme booklet

`silsila-resonance-programme.pdf` — the printed programme handed out on the night.

## Give the printer these numbers

|               |                                                                                      |
| ------------- | ------------------------------------------------------------------------------------ |
| Format        | A5 saddle-stitched booklet                                                           |
| Trim size     | **148 × 210 mm**                                                                     |
| Bleed         | **3 mm all round** (already in the file)                                             |
| PDF page size | 154 × 216 mm — trim plus bleed                                                       |
| Pages         | **8**, single pages in reading order                                                 |
| Imposition    | **None. The printer imposes.** Do not send this as spreads.                          |
| Safety margin | 10 mm from trim, 14 mm on the bound edge                                             |
| Colour        | RGB. Ask the printer to convert, or see below.                                       |
| Crop marks    | Not included — the page box is trim + bleed, which is what most online printers want |

Page count is a multiple of four, as saddle stitch requires. Reader spreads
fall as `1` / `2-3` / `4-5` / `6-7` / `8`, so pages 4 and 5 face each other —
that is why the two masters sit there as a red centre spread.

## Paper

Uncoated or matte stock reads better than gloss with this much flat red, and
suits the paper-and-tape feel of the artwork. Something around 150 gsm inner
with a 250–300 gsm cover is typical for an 8pp A5 programme. Ask for the cover
to be printed on the same stock if you want it to feel like a pamphlet rather
than a booklet.

## Rebuilding it

```sh
cd print
./render.sh          # headless Chrome → silsila-resonance-programme.pdf
```

Editing `booklet.html` and re-running is the whole loop. Fonts load from a CDN,
so it needs a network connection when rendering.

## Structure

| Page | Field   | Content                                          |
| ---- | ------- | ------------------------------------------------ |
| 1    | plaster | Cover: wordmark, the two masters, date and venue |
| 2    | bone    | The word _silsila_ — the statement               |
| 3    | bone    | The evening — run of show                        |
| 4    | plaster | Jayanta Banerjee                                 |
| 5    | plaster | Samir Chatterjee                                 |
| 6    | bone    | The company — the other five performers          |
| 7    | bone    | Echoes to Sky, with a QR to the album            |
| 8    | plaster | Credits and thanks, with a QR to the site        |

Only the plaster red `#850D0D` and bone `#E9E4E0` are used. The brighter sindoor
red from the website is deliberately absent, so the booklet reads as the quieter
sibling of the site.

## Before you send it

- [ ] **Fill in the thanks list on page 8.** It is `[ Name ]` placeholders.
- [ ] **Fill in the programme design credit** on page 8.
- [ ] Confirm the production credits on page 8 are right. The ones on page 7 are
      the _album_ credits taken from the Echoes to Sky notes, which is a
      different list.
- [ ] Proof one physical copy before running the full quantity.

## Known limitation

Samir's photograph is the weakest asset at **534 × 668 px**, which is about
226 dpi at the size it prints on page 5. It will look acceptable on a digital
press but it is below the 300 dpi ideal. Every other image is 320–395 dpi. A
higher-resolution original of that frame is the single biggest quality win
available.

## If the printer insists on CMYK

Most digital printers accept RGB and convert. If yours wants CMYK:

```sh
brew install ghostscript
gs -dSAFER -dBATCH -dNOPAUSE -dNOCACHE \
   -sDEVICE=pdfwrite -sColorConversionStrategy=CMYK \
   -dProcessColorModel=/DeviceCMYK \
   -sOutputFile=programme-cmyk.pdf silsila-resonance-programme.pdf
```

Check the red afterwards. `#850D0D` converts to roughly C0 M95 Y90 K35, and
deep reds are exactly where an unmanaged conversion tends to go muddy — if the
printer has an ICC profile for their press, theirs will beat this.
