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
# --directory rather than a `cd` in a subshell: with the subshell, $! is the
# wrapper's pid and the trap below leaves the server orphaned on the port,
# still answering — from a working directory that no longer exists, so every
# request 404s and the next run screenshots an error page.
python3 -m http.server "$PORT" --directory "$TMP" >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null || true; rm -rf "$TMP"' EXIT

# Wait for the server to actually answer. A fixed sleep raced it and Chrome
# screenshotted a 404 page, which then failed the decode check further down —
# the check did its job, but the cause was here.
for _ in $(seq 1 40); do
  if curl -fs -o /dev/null "http://localhost:$PORT/silsila/code/"; then break; fi
  sleep 0.25
done
curl -fsS -o /dev/null "http://localhost:$PORT/silsila/code/" \
  || { echo "server never came up on $PORT"; exit 1; }

shoot() { # route -> basename
  "$CHROME" --headless --disable-gpu --hide-scrollbars \
    --window-size=1920,1080 --force-device-scale-factor=2 \
    --virtual-time-budget=20000 \
    --screenshot="$2.png" "http://localhost:$PORT/silsila/$1" 2>/dev/null
}

shoot "code/"       silsila-screen-qr
shoot "code/plain/" silsila-screen-qr-plain
shoot "logo/"       silsila-screen-logo

# The QR slides sit on a textured maroon, where JPEG is fine and much smaller.
for f in silsila-screen-qr silsila-screen-qr-plain; do
  magick "$f.png" -resize 1920x -quality 94 "$f-1080.jpg"
done

# The curtain slide stays PNG at both sizes. It is white line art on pure
# black, which is the worst case for JPEG: the ringing shows up as grey haze
# around every stroke, and on a black drape that haze is the one thing the
# projector should not be emitting.
magick silsila-screen-logo.png -resize 1920x silsila-screen-logo-1080.png

# A QR that does not scan is just a picture, so prove it before shipping —
# and prove it degraded, because nobody scans a projection head-on from 1m.
for f in silsila-screen-qr silsila-screen-qr-plain; do
  for v in "$f.png" "$f-1080.jpg"; do
    printf '%-36s ' "$v"
    zbarimg --quiet --raw "$v" || { echo "DECODE FAILED"; exit 1; }
  done
  magick "$f.png" -resize 400x -blur 0x0.6 -brightness-contrast -18x0 /tmp/_deg.png
  printf '%-36s ' "$f (400px, blurred, dim)"
  zbarimg --quiet --raw /tmp/_deg.png || { echo "DECODE FAILED"; exit 1; }
done
rm -f /tmp/_deg.png
echo "wrote three slides from /silsila/code, /code/plain and /logo"
