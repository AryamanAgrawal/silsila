#!/usr/bin/env python3
"""
Bake each taped polaroid into a single flat PNG.

Chrome's PDF export rasterises any subtree carrying a `transform: rotate()`
and clips the raster without antialiasing, which leaves a visible staircase
down the edge of every photograph. Box shadows are worse: they are stored as
a lossy mask and ring at the card edge, showing as a grey band.

So the rotation, the shadow and the tape are composited here instead, by the
Chrome compositor rather than the PDF exporter, at 5x device scale. The
booklet then places one flat, unrotated image per card and neither artifact
can occur.

Run:  python3 bake-cards.py
"""

import math
import pathlib
import subprocess
import tempfile

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
HERE = pathlib.Path(__file__).parent
OUT = HERE / "assets" / "cards"
SCALE = 5           # geometry multiplier: the page is drawn 5x life size
MARGIN_MM = 9       # room for the tape overhang and the rotated corners
PX_PER_MM = 96 / 25.4

FONTS = """
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500&family=Ephesis&display=swap" rel="stylesheet">
"""

# id, photo, card width mm, tilt deg, tape file, tape side, tape offset mm,
# tape rotation deg, tape width mm, name, instrument, pad mm, chin mm,
# name pt, instrument pt
CARDS = [
    ("cover-jayanta", "jayanta", 46, -1.6, "tape-kraft.png",      "left",  5, -6, 22, "Jayanta Banerjee", "Sitar",    2.0, 7.0, 6.6, 9.5),
    ("cover-samir",   "samir",   46,  1.9, "tape-kraft-2.png",    "right", 4,  7, 22, "Samir Chatterjee", "Tabla",    2.0, 7.0, 6.6, 9.5),
    ("p4-jayanta",    "jayanta", 58, -1.4, "tape-kraft.png",      "left",  6, -6, 26, "Jayanta Banerjee", "Sitar",    2.6, 9.0, 9.0, 12.0),
    ("p5-samir",      "samir",   52,  1.8, "tape-kraft-2.png",    "right", 5,  7, 26, "Samir Chatterjee", "Tabla",    2.6, 9.0, 9.0, 12.0),
    ("c-tehreem",     "tehreem", 32, -1.6, "tape-kraft-wide.png", "left",  3, -5, 16, "Tehreem Khan",     "Sitar",    1.8, 6.5, 6.3, 9.0),
    ("c-sikandar",    "sikandar", 32,  1.9, "tape-kraft.png",      "right", 2,  6, 16, "Sikandar Rahman",  "Violin",   1.8, 6.5, 6.3, 9.0),
    ("c-pranav",      "pranav", 32, -2.2, "tape-kraft-2.png",    "left",  4, -3, 16, "Pranav Shikarpur", "Bansuri",  1.8, 6.5, 6.3, 9.0),
    ("c-shiva",       "shiva", 32,  1.4, "tape-kraft-wide.png", "right", 3,  5, 16, "Shiva Kannan",     "Keyboard", 1.8, 6.5, 6.3, 9.0),
    ("c-aditya",      "aditya", 32, -1.1, "tape-kraft.png",      "left",  2, -6, 16, "Aditya Pillai",    "Dholak",   1.8, 6.5, 6.3, 9.0),
]

TEMPLATE = """<!doctype html>
<html><head><meta charset="utf-8">{fonts}
<style>
  html, body {{ margin:0; padding:0; background:transparent; }}
  body {{ width:{cw}mm; height:{ch}mm; }}
  .stage {{
    position:absolute; inset:0;
    display:flex; align-items:center; justify-content:center;
  }}
  .card {{ position:relative; width:{w}mm; transform:rotate({tilt}deg); }}
  .polaroid {{
    background:#FBFAF8;
    padding:{pad}mm {pad}mm {chin}mm;
    box-shadow:0 {sy}mm {sb}mm rgba(0,0,0,.30);
  }}
  .polaroid img {{ display:block; width:100%; height:auto; }}
  .cap {{ text-align:center; margin-top:{capgap}mm; }}
  .n {{
    font-family:'Cormorant Garamond',serif; font-weight:500;
    text-transform:uppercase; letter-spacing:.06em;
    font-size:{npt}pt; color:#850D0D; white-space:nowrap; line-height:1.1;
  }}
  .i {{ font-family:'Ephesis',cursive; font-size:{ipt}pt; color:#171717; line-height:1.1; }}
  .tape {{
    position:absolute; top:{tapetop}mm; {side}:{off}mm;
    width:{tw}mm; transform:rotate({trot}deg); z-index:3;
    filter:drop-shadow(0 .5mm 1mm rgba(0,0,0,.28));
  }}
</style></head>
<body><div class="stage"><div class="card">
  <img class="tape" src="../{tape}" alt="">
  <div class="polaroid">
    <img src="../bw/{photo}.jpg" alt="">
    <div class="cap"><div class="n">{name}</div><div class="i">{inst}</div></div>
  </div>
</div></div></body></html>
"""


def bake(card):
    (cid, photo, w, tilt, tape, side, off, trot, tw,
     name, inst, pad, chin, npt, ipt) = card

    photo_w = w - 2 * pad
    photo_h = photo_w * 5 / 4
    card_h = photo_h + pad + chin

    # canvas must hold the rotated card plus the tape overhang
    rad = math.radians(abs(tilt))
    rot_w = w * math.cos(rad) + card_h * math.sin(rad)
    rot_h = w * math.sin(rad) + card_h * math.cos(rad)
    cw = rot_w + 2 * MARGIN_MM
    ch = rot_h + 2 * MARGIN_MM

    # Draw everything SCALE times life size at device scale 1.
    # --force-device-scale-factor shrinks the layout viewport instead of
    # supersampling, which collapsed every card to a sliver.
    k = SCALE
    html = TEMPLATE.format(
        fonts=FONTS, cw=round(cw * k, 3), ch=round(ch * k, 3), w=w * k, tilt=tilt,
        pad=pad * k, chin=chin * k, capgap=round(pad * 0.9 * k, 2),
        sy=(0.9 if w < 40 else 1.4) * k, sb=(2.5 if w < 40 else 4.0) * k,
        npt=npt * k, ipt=ipt * k, tapetop=-(pad + 1.6) * k, side=side, off=off * k,
        trot=trot, tw=tw * k, tape=tape, photo=photo, name=name, inst=inst,
    )

    tmp = OUT / f"_{cid}.html"
    tmp.write_text(html)

    px_w = round(cw * SCALE * PX_PER_MM)
    px_h = round(ch * SCALE * PX_PER_MM)
    subprocess.run([
        CHROME, "--headless", "--disable-gpu", "--hide-scrollbars",
        "--default-background-color=00000000",
        f"--window-size={px_w},{px_h}",
        f"--screenshot={OUT / (cid + '.png')}",
        "--virtual-time-budget=6000",
        f"file://{tmp}",
    ], check=True, capture_output=True)
    tmp.unlink()
    return cid, cw, ch


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    css = [
        "/* Generated by bake-cards.py.",
        "   Each PNG is trimmed to its own content, so a card is simply an",
        "   image with a width. No slots, no overflow, no negative margins:",
        "   Chrome's PDF exporter mishandles all three inside a flex row. */",
        ".baked { display:block; flex:none; max-width:none; }",
    ]
    print(f"{'card':<14} {'canvas mm':>14}  png")
    for card in CARDS:
        cid, cw, ch = bake(card)
        png = OUT / f"{cid}.png"
        size = subprocess.run(
            ["magick", "identify", "-format", "%wx%h", str(png)],
            capture_output=True, text=True).stdout
        # trim the transparent surround so the file is exactly the artwork
        subprocess.run(["magick", str(png), "-trim", "+repage", str(png)], check=True)
        tw, th = subprocess.run(
            ["magick", "identify", "-format", "%w %h", str(png)],
            capture_output=True, text=True).stdout.split()
        w_mm = int(tw) / (SCALE * PX_PER_MM)
        print(f"{cid:<14} {cw:6.1f}x{ch:<6.1f}  {size} -> {tw}x{th}  {w_mm:.1f}mm")
        css.append(f".bake-{cid} {{ width:{w_mm:.2f}mm; }}")
    (OUT / "cards.css").write_text("\n".join(css) + "\n")
    print("\nwrote assets/cards/cards.css")
