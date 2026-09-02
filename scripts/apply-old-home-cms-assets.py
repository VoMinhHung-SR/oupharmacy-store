#!/usr/bin/env python3
"""Cover-fit creatives into locked slot sizes (3.7 / 3.25 / 3.4).

  python3 scripts/apply-old-home-cms-assets.py
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageOps

ASSETS = Path(
    "/home/shiray/.cursor/projects/mnt-d9817672-fa4f-44b5-96e9-07bd39acf312-PersonalProject/assets"
)
OUT = Path(__file__).resolve().parents[1] / "public" / "mocks" / "home-cms"

# dest, src, size, centering (x, y) — y slightly above center to keep headlines
MAP = [
    ("hero-main-1.png", "hero-cab-safe.png", (1920, 516), (0.5, 0.48)),
    ("hero-main-2.png", "hero-skin-safe.png", (1920, 516), (0.5, 0.48)),
    ("secondary-1.png", "sec-consult-safe.png", (1300, 400), (0.5, 0.45)),
    ("secondary-2.png", "sec-milk-safe.png", (1300, 400), (0.5, 0.45)),
    ("secondary-3.png", "sec-member-safe.png", (1300, 400), (0.5, 0.45)),
]


def cover_png(src: Path, dest: Path, size: tuple[int, int], centering: tuple[float, float]) -> None:
    im = Image.open(src).convert("RGBA")
    out = ImageOps.fit(im, size, method=Image.Resampling.LANCZOS, centering=centering)
    dest.parent.mkdir(parents=True, exist_ok=True)
    out.save(dest, "PNG", optimize=True)
    print(f"OK {src.name} {im.size} -> {dest.name} {out.size} AR={out.size[0]/out.size[1]:.3f}")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for dest_name, src_name, size, centering in MAP:
        src = ASSETS / src_name
        if not src.exists():
            raise SystemExit(f"missing {src}")
        cover_png(src, OUT / dest_name, size, centering)


if __name__ == "__main__":
    main()
