#!/usr/bin/env bash
# House screen: 16:9 slide with the programme QR, for the projector before doors.
# Rendered at 2x so the code stays hard-edged if the deck scales it up.
set -e
cd "$(dirname "$0")"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

python3 - <<'PY'
import segno
# Error level Q, not M: a projected code is read at an angle, through glare,
# sometimes past someone's head. The URL is short enough that the extra
# correction costs only four modules.
segno.make("https://aryamanagrawal.github.io/silsila/", error="Q").save(
    "assets/qr-programme.svg", scale=10, border=4, dark="#171717", light=None)
PY

"$CHROME" --headless --disable-gpu --hide-scrollbars \
  --window-size=1920,1080 --force-device-scale-factor=2 \
  --virtual-time-budget=20000 \
  --screenshot="silsila-screen-qr.png" "file://$PWD/screen.html" 2>/dev/null

magick silsila-screen-qr.png -resize 1920x -quality 94 silsila-screen-qr-1080.jpg

# A QR that does not scan is just a picture, so prove it does before shipping.
for f in silsila-screen-qr.png silsila-screen-qr-1080.jpg; do
  printf '%-32s ' "$f"; zbarimg --quiet --raw "$f" || { echo "DECODE FAILED"; exit 1; }
done
echo "wrote screen png(2x) + 1080 jpg"
