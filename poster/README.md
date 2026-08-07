# Poster

`silsila-poster.png` - 3240 x 4050, the master. Designed at 1080 x 1350 and
rendered at 3x, which is about 295dpi on an 11-inch print.

| File | Use |
|---|---|
| `silsila-poster.png` | print, and anything that needs the master |
| `silsila-poster-print.jpg` | same size, smaller file, for print shops that prefer JPEG |
| `silsila-poster-web.jpg` | 1080 x 1350, for Instagram and email |

Rebuild with `./render.sh` after editing `poster.html`.

## The QR drives the layout

The CueBox ticket URL is long, so it forces a 49-module (version 8) code. A QR
module has to land at 0.5mm or larger to scan from arm's length, which means
the code can never be smaller than 95px in this 1080px design if the poster is
printed 11 inches wide.

It is set at 168px. That holds up down to about an 8-inch print:

| Printed width | QR size | Module | |
|---|---|---|---|
| 6 in | 24 mm | 0.48 mm | borderline |
| 8 in | 32 mm | 0.65 mm | fine |
| 11 in | 43 mm | 0.89 mm | fine |
| 17 in | 67 mm | 1.37 mm | fine |
| 24 in | 95 mm | 1.94 mm | fine |

The code is dark-on-light on a bone tile rather than bone-on-red. Inverted
codes are handled less reliably by older phone cameras, and the light tile also
gives the quiet zone scanners need to find the code's edge.

Verified by decoding the rendered poster, not by eye.
