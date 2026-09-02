#!/usr/bin/env python3
"""DEPRECATED — do not use for hero ultra-wide frames.

GenerateImage returns 3:2 (e.g. 1536×1024). Remastering that into 1280×295
always crops or blur-pads. Use instead:

  python3 scripts/render-home-cms-banners.py
"""

raise SystemExit(
    "Deprecated. Run: python3 scripts/render-home-cms-banners.py\n"
    "(GenerateImage is 3:2 — never cover-crop into 1280×295.)"
)
