#!/usr/bin/env python3
"""
Two posters per sheet, for printing and guillotining apart.

Reads poster.html and re-uses its stylesheet and markup verbatim, so the
imposed sheet can never drift from the single poster. The poster is drawn at
its native 1080x1350 and scaled with a CSS transform, which keeps the type
vector all the way into the PDF - rasterising it here would throw away the
whole reason the poster is a PDF.

Run:  python3 impose.py
"""

import pathlib
import re

HERE = pathlib.Path(__file__).parent
DESIGN_W, DESIGN_H = 1080, 1350          # the poster's own pixel geometry
PX_PER_IN = 96
PX_PER_MM = 96 / 25.4

LAYOUTS = {
    # name: (page w, page h, poster w, gap, unit, px-per-unit)
    "tabloid": (17, 11, 8.0, 0.5, "in", PX_PER_IN),
    "a3": (420, 297, 199, 10, "mm", PX_PER_MM),
}


def build(name):
    page_w, page_h, poster_w, gap, unit, ppu = LAYOUTS[name]
    poster_h = poster_w * DESIGN_H / DESIGN_W
    margin_x = (page_w - 2 * poster_w - gap) / 2
    margin_y = (page_h - poster_h) / 2
    scale = (poster_w * ppu) / DESIGN_W

    src = (HERE / "poster.html").read_text()
    css = re.search(r"<style>(.*?)</style>", src, re.S).group(1)
    head_links = "\n".join(re.findall(r'<link[^>]+>', src))
    sheet = re.search(r'(<div class="sheet">.*?</div>\s*</body>)', src, re.S).group(1)
    sheet = sheet.rsplit("</body>", 1)[0].rstrip()
    opens, closes = sheet.count("<div"), sheet.count("</div>")
    if opens != closes:
        raise SystemExit(
            f"poster.html markup is unbalanced: {opens} <div> vs {closes} </div>. "
            "Browsers auto-correct this so the single poster still looks right, "
            "but duplicating it nests the second copy inside the first.")

    # cut marks sit in the margin, never over the artwork
    xs = [margin_x, margin_x + poster_w, margin_x + poster_w + gap, page_w - margin_x]
    ys = [margin_y, margin_y + poster_h]
    marks = []
    for x in xs:
        marks.append(f'<i style="left:{x}{unit};top:0;width:0;height:{margin_y*0.6:.3f}{unit}"></i>')
        marks.append(f'<i style="left:{x}{unit};top:{page_h - margin_y*0.6:.3f}{unit};width:0;height:{margin_y*0.6:.3f}{unit}"></i>')
    for y in ys:
        marks.append(f'<i style="top:{y}{unit};left:0;height:0;width:{margin_x*0.6:.3f}{unit}"></i>')
        marks.append(f'<i style="top:{y}{unit};left:{page_w - margin_x*0.6:.3f}{unit};height:0;width:{margin_x*0.6:.3f}{unit}"></i>')

    slots = "".join(
        f'<div class="imp-slot" style="left:{left}{unit};top:{margin_y:.4f}{unit}">'
        f'<div class="imp-frame">{sheet}</div></div>'
        for left in (f"{margin_x:.4f}", f"{margin_x + poster_w + gap:.4f}")
    )

    html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Silsila: Resonance - 2 up ({name})</title>
{head_links}
<style>
{css}

/* ── imposition ─────────────────────────────────────────────
   Overrides the poster's own page box. Everything below wins
   because it comes later in the same stylesheet.
   Wrapper classes are namespaced: the poster already owns
   .frame for the company photo mats, and an unprefixed rule
   here was resizing all ten of them. */
@page {{ size: {page_w}{unit} {page_h}{unit}; margin: 0; }}
html, body {{
  width: {page_w}{unit}; height: {page_h}{unit};
  margin: 0; padding: 0; background: #fff; overflow: hidden; position: relative;
}}
.imp-slot {{
  position: absolute;
  width: {poster_w}{unit}; height: {poster_h:.4f}{unit};
  overflow: hidden;
}}
.imp-frame {{
  width: {DESIGN_W}px; height: {DESIGN_H}px;
  transform: scale({scale:.6f}); transform-origin: top left;
}}
.imp-frame .sheet {{ height: {DESIGN_H}px; }}
/* cut marks */
i {{ position: absolute; border-left: 0.4pt solid #000; border-top: 0.4pt solid #000; }}
</style>
</head>
<body>{slots}{''.join(marks)}</body>
</html>
"""
    out = HERE / f"imposed-{name}.html"
    out.write_text(html)
    print(f"  {out.name}: {page_w}x{page_h}{unit} sheet, two posters {poster_w}x{poster_h:.2f}{unit}, "
          f"gap {gap}{unit}, margins {margin_x:.2f}/{margin_y:.2f}{unit}, scale {scale:.4f}")


if __name__ == "__main__":
    for name in LAYOUTS:
        build(name)
