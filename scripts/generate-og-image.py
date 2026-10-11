#!/usr/bin/env python3
"""Cambuz PDF Reader — Open Graph / Twitter card generator.

Renders the social preview images from the official icon
(`assets/icon-master.png`) and the brand's own Inter cut
(`assets/fonts/`, SIL OFL 1.1 — see assets/fonts/OFL.txt). The icon is placed
with `Image.LANCZOS`; it is never recoloured or cropped.

Outputs (public/social/):
    og-image.png    1200x630   Open Graph / Twitter summary_large_image
    og-square.png   1200x1200  square variant for platforms that crop square

Run from the repository root:

    python3 scripts/generate-og-image.py

Requires: Pillow (pip install pillow)
"""

import math
import os
import sys

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:  # pragma: no cover - dependency guard
    sys.exit("Pillow is required: pip install pillow")

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MASTER = os.path.join(REPO_ROOT, "assets", "icon-master.png")
FONTS = os.path.join(REPO_ROOT, "assets", "fonts")
OUT = os.path.join(REPO_ROOT, "public", "social")

# Brand palette — same values the site uses (tailwind.config.js / index.css).
BG = (0x0B, 0x10, 0x20)
PRIMARY = (0x36, 0x7C, 0xF6)
ACCENT = (0x69, 0xA5, 0xFF)
TEXT = (0xEE, 0xF2, 0xF9)
TEXT_SECONDARY = (0x8A, 0x9B, 0xB8)

TITLE = "Cambuz PDF Reader"
TAGLINE = "Your PDFs. Nothing in the way."
FOOTER = "Free desktop PDF reader  ·  Windows 10/11 x64  ·  No subscription"

FONT_FILES = {
    "regular": "Inter-Regular.ttf",
    "medium": "Inter-Medium.ttf",
    "semibold": "Inter-SemiBold.ttf",
    "bold": "Inter-Bold.ttf",
}


def font(weight, size):
    path = os.path.join(FONTS, FONT_FILES[weight])
    if not os.path.exists(path):
        sys.exit(f"generate-og-image: missing font {path}")
    return ImageFont.truetype(path, size)


def load_icon():
    if not os.path.exists(MASTER):
        sys.exit(
            "generate-og-image: required icon master is missing: "
            "assets/icon-master.png\n"
            "  The official icon is the source of truth for the brand; "
            "restore it instead of substituting a different image."
        )
    icon = Image.open(MASTER).convert("RGBA")
    if icon.size[0] != icon.size[1]:
        sys.exit("generate-og-image: assets/icon-master.png must be square")
    return icon


def radial_glow(size, colour, strength=0.16):
    """Soft top-centred glow, mirroring the site's .bg-radial-glow."""
    width, height = size
    small = 240
    mask = Image.new("L", (small, small))
    pixels = mask.load()
    centre = (small / 2, -0.05 * small)
    max_distance = small * 0.95
    for y in range(small):
        for x in range(small):
            dx = (x - centre[0]) / max_distance
            dy = (y - centre[1]) / (max_distance * 0.62)
            distance = math.sqrt(dx * dx + dy * dy)
            value = 0.0 if distance >= 1 else (1.0 - distance) ** 2
            pixels[x, y] = int(value * strength * 255)
    mask = mask.resize((width, height), Image.LANCZOS)

    layer = Image.new("RGB", (width, height), colour)
    out = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    out.paste(layer, (0, 0), mask)
    return out


def grid(size, step=48, strength=0.05):
    """Faint 48px grid, mirroring the site's .bg-grid."""
    width, height = size
    layer = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    alpha = int(strength * 255)
    for x in range(0, width, step):
        draw.line([(x, 0), (x, height)], fill=(*PRIMARY, alpha), width=1)
    for y in range(0, height, step):
        draw.line([(0, y), (width, y)], fill=(*PRIMARY, alpha), width=1)
    return layer


def draw_text(draw, xy, text, fnt, fill):
    draw.text(xy, text, font=fnt, fill=fill)
    return draw.textbbox(xy, text, font=fnt)


def build_wide(icon):
    width, height = 1200, 630
    canvas = Image.new("RGBA", (width, height), (*BG, 255))
    canvas.alpha_composite(grid((width, height)))
    canvas.alpha_composite(radial_glow((width, height), PRIMARY, 0.18))

    mark = icon.resize((196, 196), Image.LANCZOS)
    canvas.alpha_composite(mark, (80, 104))

    draw = ImageDraw.Draw(canvas)
    draw_text(draw, (80, 360), TITLE, font("bold", 68), TEXT)
    draw_text(draw, (80, 462), TAGLINE, font("regular", 34), TEXT_SECONDARY)
    draw_text(draw, (80, 540), FOOTER, font("medium", 25), ACCENT)
    return canvas.convert("RGB")


def build_square(icon):
    width = height = 1200
    canvas = Image.new("RGBA", (width, height), (*BG, 255))
    canvas.alpha_composite(grid((width, height)))
    canvas.alpha_composite(radial_glow((width, height), PRIMARY, 0.20))

    mark = icon.resize((330, 330), Image.LANCZOS)
    canvas.alpha_composite(mark, ((width - 330) // 2, 300))

    draw = ImageDraw.Draw(canvas)
    box = draw.textbbox((0, 0), TITLE, font=font("bold", 78))
    draw_text(draw, ((width - box[2]) // 2, 720), TITLE, font("bold", 78), TEXT)
    box = draw.textbbox((0, 0), TAGLINE, font=font("regular", 38))
    draw_text(
        draw,
        ((width - box[2]) // 2, 840),
        TAGLINE,
        font("regular", 38),
        TEXT_SECONDARY,
    )
    box = draw.textbbox((0, 0), FOOTER, font=font("medium", 26))
    draw_text(draw, ((width - box[2]) // 2, 940), FOOTER, font("medium", 26), ACCENT)
    return canvas.convert("RGB")


def main():
    icon = load_icon()
    os.makedirs(OUT, exist_ok=True)

    wide = os.path.join(OUT, "og-image.png")
    build_wide(icon).save(wide, optimize=True)
    print(f"  {os.path.relpath(wide, REPO_ROOT):<40} 1200x630")

    square = os.path.join(OUT, "og-square.png")
    build_square(icon).save(square, optimize=True)
    print(f"  {os.path.relpath(square, REPO_ROOT):<40} 1200x1200")
    print("\nDone.")


if __name__ == "__main__":
    main()
