# Poster

Print master is **`silsila-poster.pdf`**. Send that to the printer.

| File | Size | Use |
|---|---|---|
| `silsila-poster.pdf` | 11.25 x 14.07 in | **print** - all type is vector |
| `silsila-poster.png` | 4320 x 5400 | raster master, if a PDF cannot be used |
| `silsila-poster-print.jpg` | 4320 x 5400 | same, smaller file |
| `silsila-poster-web.jpg` | 1080 x 1350 | Instagram, email |

Rebuild everything with `./render.sh` after editing `poster.html`.

## Built for print

- **Plain white ground.** No background tint and no paper-grain overlay, so the
  press lays no ink over the whole sheet. Cheaper, and it cannot band.
- **No shadows.** Drop shadows force rasterisation, band on uncoated stock, and
  are a screen idiom. Photo frames use a hairline rule instead, which is how
  print has always separated an image from the page.
- **Vector type.** The PDF keeps Anton, Cormorant, Ephesis and Open Sauce as
  embedded fonts, so type is resolution-independent. Only the photographs are
  raster.
- **QR is pure black on pure white** for maximum contrast.

## Resolution ceiling

Render scale does not fix photographs - the source files do. At 11.25 inches:

| Element | Effective |
|---|---|
| All type | vector, unlimited |
| Company photos | 416 dpi |
| Jayanta and Samir | **243 dpi** |

243 dpi is fine on a digital press and will look good. It is below the 300 dpi
ideal, and it is the single limit on this poster. Printing much larger than
about 14 inches wide will start to soften those two photographs. Higher
resolution originals of Jayanta and Samir are the only way to lift it.

## The QR drives the layout

The CueBox URL forces a 49-module (version 8) code, and a module must be 0.5mm
or larger to scan from arm's length. At 168px in a 1080px design that is 0.89mm
on an 11 inch print - comfortable, and still fine down to about 8 inches.

Verified by decoding the QR out of the finished PDF at 300dpi, not by eye.
