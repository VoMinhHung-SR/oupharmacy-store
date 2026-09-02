#!/usr/bin/env python3
"""Render home-cms banners at the EXACT frame pixel size (no crop from wrong AR).

GenerateImage outputs 3:2 (1536×1024) even when asked for 16:9 — never remaster
that into 1280×295 with cover/blur. This script paints native canvases instead.

Sizes (sync with CSS):
  hero-main-*   1280×295   aspect-[1280/295]
  secondary-*   1280×640   aspect-[2/1]
  notice-*      800×400    aspect-[2/1]
  hero-theme-*  1920×640   wide wash for band
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "mocks" / "home-cms"
FONT = Path("/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf")
FONT_BOLD = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")
# Prefer Noto for Vietnamese if present
for cand in (
    Path("/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf"),
    Path("/usr/share/fonts/opentype/noto/NotoSans-Bold.ttf"),
):
    if cand.exists():
        FONT_BOLD = cand
        break


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    path = FONT_BOLD if bold and FONT_BOLD.exists() else FONT
    if not path.exists():
        path = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")
    return ImageFont.truetype(str(path), size)


def gradient(size: tuple[int, int], c1: tuple[int, int, int], c2: tuple[int, int, int]) -> Image.Image:
    w, h = size
    im = Image.new("RGB", size, c1)
    px = im.load()
    for x in range(w):
        t = x / max(w - 1, 1)
        r = int(c1[0] + (c2[0] - c1[0]) * t)
        g = int(c1[1] + (c2[1] - c1[1]) * t)
        b = int(c1[2] + (c2[2] - c1[2]) * t)
        for y in range(h):
            # slight vertical lift
            u = y / max(h - 1, 1)
            rr = min(255, int(r + (255 - r) * u * 0.08))
            gg = min(255, int(g + (255 - g) * u * 0.08))
            bb = min(255, int(b + (255 - b) * u * 0.08))
            px[x, y] = (rr, gg, bb)
    return im


def round_rect(draw: ImageDraw.ImageDraw, xy, fill, radius: int = 18):
    draw.rounded_rectangle(xy, radius=radius, fill=fill)


def paste_subject(canvas: Image.Image, subject: Image.Image | None, box: tuple[int, int, int, int]):
    """Fit subject into box with contain (never crop subject)."""
    if subject is None:
        return
    x0, y0, x1, y1 = box
    bw, bh = x1 - x0, y1 - y0
    sub = subject.convert("RGBA")
    sub.thumbnail((bw, bh), Image.Resampling.LANCZOS)
    px = x0 + (bw - sub.width) // 2
    py = y0 + (bh - sub.height) // 2
    canvas.paste(sub, (px, py), sub if sub.mode == "RGBA" else None)


def load_optional(path: Path) -> Image.Image | None:
    return Image.open(path).convert("RGBA") if path.exists() else None


def render_hero(
    out: Path,
    *,
    title: str,
    subtitle: str,
    cta: str,
    colors: tuple[tuple[int, int, int], tuple[int, int, int]],
    subject: Image.Image | None,
    accent: tuple[int, int, int],
):
    W, H = 1280, 295
    im = gradient((W, H), colors[0], colors[1])
    draw = ImageDraw.Draw(im)

    # Soft orbs (atmosphere, full-bleed — native to canvas)
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    od.ellipse((900, -40, 1280, 260), fill=(*accent, 40))
    od.ellipse((1050, 80, 1350, 360), fill=(255, 255, 255, 50))
    im = Image.alpha_composite(im.convert("RGBA"), overlay).convert("RGB")
    draw = ImageDraw.Draw(im)

    # Text block — padded inside frame (safe margins)
    draw.text((48, 56), title, font=font(36, bold=True), fill=(20, 60, 90))
    draw.text((48, 110), subtitle, font=font(18), fill=(50, 80, 100))
    round_rect(draw, (48, 200, 48 + 200, 200 + 44), fill=accent, radius=22)
    # CTA text centered-ish
    bbox = draw.textbbox((0, 0), cta, font=font(16, bold=True))
    tw = bbox[2] - bbox[0]
    draw.text((48 + (200 - tw) // 2, 210), cta, font=font(16, bold=True), fill=(255, 255, 255))

    # Native decorative shapes on the right (same canvas AR — no nested photo card)
    if subject is None:
        # simple bottle / card silhouettes
        round_rect(draw, (860, 50, 940, 230), fill=(255, 255, 255), radius=12)
        round_rect(draw, (880, 40, 920, 58), fill=accent, radius=6)
        round_rect(draw, (980, 70, 1060, 245), fill=(255, 255, 255), radius=12)
        round_rect(draw, (1000, 55, 1040, 72), fill=(56, 189, 248), radius=6)
        round_rect(draw, (1100, 90, 1160, 220), fill=(255, 255, 255), radius=10)
        round_rect(draw, (1115, 78, 1145, 95), fill=(74, 222, 128), radius=5)
        draw.ellipse((1180, 40, 1260, 120), fill=(255, 255, 255, 180) if False else (255, 255, 255))
    else:
        paste_subject(im, subject, (720, 20, 1240, 275))

    OUT.mkdir(parents=True, exist_ok=True)
    im.save(out, "PNG", optimize=True)
    print(f"OK {out.name} {im.size} AR={im.size[0]/im.size[1]:.3f}")


def render_wide(
    out: Path,
    size: tuple[int, int],
    *,
    title: str,
    subtitle: str,
    colors: tuple[tuple[int, int, int], tuple[int, int, int]],
    subject: Image.Image | None,
    dark_text: bool = False,
):
    W, H = size
    im = gradient((W, H), colors[0], colors[1])
    if subject:
        # Blurred full-bleed subject as atmosphere (scaled cover of same canvas AR via fit on copy)
        bg = subject.convert("RGB").resize((W, H), Image.Resampling.LANCZOS)
        bg = bg.filter(ImageFilter.GaussianBlur(18))
        im = Image.blend(im, bg, 0.35)
    draw = ImageDraw.Draw(im)
    fill = (255, 255, 255) if not dark_text else (20, 50, 70)
    draw.text((40, H // 2 - 36), title, font=font(28, bold=True), fill=fill)
    draw.text((40, H // 2 + 8), subtitle[:70], font=font(16), fill=fill if not dark_text else (60, 90, 110))
    if subject:
        paste_subject(im, subject, (int(W * 0.45), int(H * 0.08), int(W * 0.97), int(H * 0.92)))
    OUT.mkdir(parents=True, exist_ok=True)
    im.save(out, "PNG", optimize=True)
    print(f"OK {out.name} {im.size} AR={im.size[0]/im.size[1]:.3f}")


def render_theme(out: Path, colors: tuple[tuple[int, int, int], tuple[int, int, int]]):
    W, H = 1920, 640
    im = gradient((W, H), colors[0], colors[1])
    # soft vignette fade bottom for page blend
    fade = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    fd = ImageDraw.Draw(fade)
    for i in range(120):
        a = int(180 * (i / 120))
        fd.rectangle((0, H - 120 + i, W, H - 119 + i), fill=(255, 255, 255, a))
    im = Image.alpha_composite(im.convert("RGBA"), fade).convert("RGB")
    OUT.mkdir(parents=True, exist_ok=True)
    im.save(out, "PNG", optimize=True)
    print(f"OK {out.name} {im.size} AR={im.size[0]/im.size[1]:.3f}")


def main() -> None:
    # Do NOT paste GenerateImage outputs (they are 3:2) into these canvases —
    # that recreates nested wrong-AR cards. Paint native full-bleed layouts only.

    render_hero(
        OUT / "hero-main-1.png",
        title="Tủ thuốc thông minh",
        subtitle="Quản lý hạn dùng gia đình — cảnh báo trước 30 ngày",
        cta="Trải nghiệm ngay",
        colors=((220, 245, 240), (200, 230, 250)),
        subject=None,
        accent=(236, 72, 153),
    )
    render_hero(
        OUT / "hero-main-2.png",
        title="Da xinh đón mùa mới",
        subtitle="Combo Sạch & Dưỡng chuẩn y khoa",
        cta="Khám phá combo",
        colors=((255, 236, 244), (220, 245, 230)),
        subject=None,
        accent=(219, 39, 119),
    )
    render_hero(
        OUT / "hero-main-3.png",
        title="Tư vấn dược sĩ 24/7",
        subtitle="Liều dùng · triệu chứng · đơn thuốc an toàn",
        cta="Kết nối ngay",
        colors=((230, 240, 255), (210, 230, 255)),
        subject=None,
        accent=(37, 99, 235),
    )

    render_wide(
        OUT / "secondary-1.png",
        (1280, 640),
        title="Sữa dinh dưỡng & Vitamin",
        subtitle="Giảm đến 30% khi mua kèm đơn đầu",
        colors=((15, 80, 90), (30, 120, 110)),
        subject=None,
    )
    render_wide(
        OUT / "secondary-2.png",
        (1280, 640),
        title="Đặc quyền thành viên",
        subtitle="FREESHIP30K · miễn phí ship từ 300K",
        colors=((30, 50, 80), (60, 90, 120)),
        subject=None,
    )
    render_wide(
        OUT / "notice-top.png",
        (800, 400),
        title="Dược phẩm & Sức khỏe A-Z",
        subtitle="Cẩm nang dùng thuốc an toàn",
        colors=((10, 90, 100), (20, 120, 130)),
        subject=None,
    )
    render_wide(
        OUT / "notice-bottom.png",
        (800, 400),
        title="Lịch hẹn & Nhà thuốc",
        subtitle="Chi nhánh và lịch trực gần bạn",
        colors=((235, 245, 250), (220, 235, 245)),
        subject=None,
        dark_text=True,
    )

    render_theme(OUT / "hero-theme-1.png", ((180, 230, 220), (210, 235, 250)))
    render_theme(OUT / "hero-theme-2.png", ((255, 220, 235), (220, 245, 230)))
    render_theme(OUT / "hero-theme-3.png", ((200, 220, 255), (230, 235, 255)))


if __name__ == "__main__":
    main()
