#!/usr/bin/env bash
# Print master is the PDF: all type stays vector, only the photographs are raster.
# 1080x1350 CSS px maps to 11.25 x 14.06 inches at 96dpi.
set -e
cd "$(dirname "$0")"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

"$CHROME" --headless --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=20000 \
  --print-to-pdf="silsila-poster.pdf" "file://$PWD/poster.html" 2>/dev/null

# raster fallbacks, 4x for crisp type where a PDF cannot be used
"$CHROME" --headless --disable-gpu --hide-scrollbars \
  --window-size=1080,1350 --force-device-scale-factor=4 \
  --virtual-time-budget=20000 \
  --screenshot="silsila-poster.png" "file://$PWD/poster.html" 2>/dev/null

# two-up sheets for printing and cutting apart
python3 impose.py >/dev/null
for L in tabloid a3; do
  "$CHROME" --headless --disable-gpu --no-pdf-header-footer \
    --virtual-time-budget=20000 \
    --print-to-pdf="silsila-poster-2up-$L.pdf" "file://$PWD/imposed-$L.html" 2>/dev/null
done

magick silsila-poster.png -quality 96 silsila-poster-print.jpg
magick silsila-poster.png -resize 1080x1350 -quality 90 silsila-poster-web.jpg
echo "wrote poster pdf + 2-up sheets + png(4x) + print jpg + web jpg"
