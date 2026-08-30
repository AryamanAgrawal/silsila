#!/usr/bin/env bash
# House screen: the 16:9 slide for the projector before doors, as flat files
# for a playback deck that cannot point a browser at the site.
#
# The page at /silsila/code IS the design. This renders that page rather than
# keeping a second copy of it here, so the slide and the page cannot drift.
set -e
cd "$(dirname "$0")"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PORT=8099

# The code itself, so the URL is written down in exactly one place.
python3 - <<'PY'
import segno
# Error level Q, not M: a projected code gets read at an angle, through glare,
# sometimes past someone's head. This URL is short enough that the extra
# correction costs only four modules.
segno.make("https://aryamanagrawal.github.io/silsila/", error="Q").save(
    "../site/public/screen/qr-programme.svg", scale=10, border=4,
    dark="#171717", light=None)
PY

(cd ../site && pnpm build >/dev/null 2>&1)

# dist is the site root, but its assets are addressed under /silsila/, so serve
# it through a directory where that path actually resolves.
TMP="$(mktemp -d)"
ln -s "$PWD/../site/dist" "$TMP/silsila"
(cd "$TMP" && python3 -m http.server $PORT >/dev/null 2>&1) &
SERVER=$!
trap 'kill $SERVER 2>/dev/null || true; rm -rf "$TMP"' EXIT
sleep 2

"$CHROME" --headless --disable-gpu --hide-scrollbars \
  --window-size=1920,1080 --force-device-scale-factor=2 \
  --virtual-time-budget=20000 \
  --screenshot="silsila-screen-qr.png" \
  "http://localhost:$PORT/silsila/code/" 2>/dev/null

magick silsila-screen-qr.png -resize 1920x -quality 94 silsila-screen-qr-1080.jpg

# A QR that does not scan is just a picture, so prove it before shipping.
for f in silsila-screen-qr.png silsila-screen-qr-1080.jpg; do
  printf '%-30s ' "$f"
  zbarimg --quiet --raw "$f" || { echo "DECODE FAILED"; exit 1; }
done
echo "wrote screen png(2x) + 1080 jpg from /silsila/code"
