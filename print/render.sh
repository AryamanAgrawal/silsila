#!/usr/bin/env bash
# Render the programme to a print-ready PDF.
# Page box is 154 x 216 mm = A5 trim (148 x 210) + 3 mm bleed all round.
set -e
cd "$(dirname "$0")"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless --disable-gpu --no-sandbox \
  --run-all-compositor-stages-before-draw --virtual-time-budget=12000 \
  --no-pdf-header-footer \
  --print-to-pdf="silsila-resonance-programme.pdf" \
  "file://$PWD/booklet.html" 2>/dev/null
echo "wrote silsila-resonance-programme.pdf"
