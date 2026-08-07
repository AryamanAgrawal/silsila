#!/usr/bin/env bash
# 1080x1350 design, rendered at 3x -> 3240x4050 (~295dpi on an 11in print)
set -e
cd "$(dirname "$0")"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless --disable-gpu --hide-scrollbars \
  --window-size=1080,1350 --force-device-scale-factor=3 \
  --virtual-time-budget=15000 \
  --screenshot="silsila-poster.png" "file://$PWD/poster.html" 2>/dev/null
echo "wrote silsila-poster.png"
