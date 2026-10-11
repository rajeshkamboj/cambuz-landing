#!/usr/bin/env python3
"""Cambuz PDF Reader — website icon asset generator.

Every icon the site ships is derived from the official application icon
(`assets/icon-master.png`, the same master the desktop app uses for its
executables and bundles). The master is the authoritative visual identity of
the product and is never redrawn, recoloured or cropped: this script only
rescales it.

Two kinds of output are produced:

  * Plain rescalings of the full square canvas (alpha preserved). These match
    the app's own packaged icons (`assets/icon.png` in the app repo is the same
    full-canvas rescale), so the browser tab, the install prompt and the
    desktop shortcut show the same artwork at the same optical size.
  * Platform-composited variants (Apple touch icon, maskable PWA icon) that a
    platform will mask or bleed to the edge. Those are the same artwork
    centred on the icon's own tile colour. The colour is sampled from the
    master at generation time, so no colour is invented here and no artwork
    pixel is altered — the logo is only placed on a background.

Run from the repository root:

    python3 scripts/generate-icon-assets.py

Requires: Pillow (pip install pillow)
"""

import os
import sys
from collections import Counter

try:
    from PIL import Image
except ImportError:  # pragma: no cover - dependency guard
    sys.exit("Pillow is required: pip install pillow")

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MASTER = os.path.join(REPO_ROOT, "assets", "icon-master.png")
PUBLIC = os.path.join(REPO_ROOT, "public")
ICONS = os.path.join(PUBLIC, "icons")

MIN_MASTER = 1024
# Alpha at or above this counts as "the artwork is here" when measuring it.
OPAQUE = 250
# Share of the canvas the artwork occupies on platform-masked variants:
# 0.80 keeps everything inside the maskable-icon safe zone (a circle of 80%
# diameter); the Apple touch icon sits slightly larger because iOS only rounds
# the corners.
MASKABLE_ARTWORK = 0.80
TOUCH_ARTWORK = 0.88


def die(message):
    sys.exit(f"generate-icon-assets: {message}")


def load_master():
    if not os.path.exists(MASTER):
        die(
            "required icon master is missing: assets/icon-master.png\n"
            "  The official icon is the source of truth for the site identity;\n"
            "  restore it instead of substituting a different image."
        )
    try:
        master = Image.open(MASTER)
        master.load()
    except Exception as error:  # noqa: BLE001 - report any decode failure clearly
        die(f"assets/icon-master.png is not a readable image: {error}")
    if master.format != "PNG":
        die(f"assets/icon-master.png must be a PNG (found {master.format})")
    width, height = master.size
    if width != height:
        die(f"assets/icon-master.png must be square (found {width}x{height})")
    if width < MIN_MASTER:
        die(
            f"assets/icon-master.png is {width}x{height}; at least "
            f"{MIN_MASTER}x{MIN_MASTER} is needed so the 512px icons are "
            "downscales rather than upscales."
        )
    master = master.convert("RGBA")
    if master.getchannel("A").getextrema()[0] == 255:
        die(
            "assets/icon-master.png must contain transparency; check that the "
            "transparent master is in place."
        )
    return master


def artwork_box(master):
    """Bounding box of the visible artwork inside the master canvas."""
    box = master.getchannel("A").point(lambda a: 255 if a >= OPAQUE else 0).getbbox()
    if box is None:
        die("assets/icon-master.png is fully transparent - nothing to draw")
    return box


def tile_colour(master, box):
    """Dominant opaque colour of the artwork: the icon's own tile colour."""
    opaque = [
        pixel
        for pixel in master.crop(box).convert("RGBA").getdata()
        if pixel[3] == 255
    ]
    if not opaque:
        die("assets/icon-master.png has no opaque pixels")
    (red, green, blue, _), _count = Counter(opaque).most_common(1)[0]
    return (red, green, blue, 255)


def rescale_full_canvas(master, size):
    """The app's own icon treatment: the whole canvas, alpha intact."""
    return master.resize((size, size), Image.LANCZOS)


def composite_on_tile(master, box, background, canvas, artwork_share):
    """Artwork centred on the icon's tile colour at `artwork_share` of canvas.

    Nothing is cropped: the whole visible artwork is scaled to fit the share
    and centred, and the surrounding area is the artwork's own tile colour.
    """
    out = Image.new("RGBA", (canvas, canvas), background)
    art_w = box[2] - box[0]
    art_h = box[3] - box[1]
    target = max(1, int(round(canvas * artwork_share)))
    scale = min(target / art_w, target / art_h)
    new_size = (max(1, int(round(art_w * scale))), max(1, int(round(art_h * scale))))
    art = master.crop(box).resize(new_size, Image.LANCZOS)
    out.paste(art, ((canvas - new_size[0]) // 2, (canvas - new_size[1]) // 2), art)
    return out


def save_png(image, path, note):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    image.save(path, optimize=True)
    rel = os.path.relpath(path, REPO_ROOT)
    print(f"  {rel:<44} {image.size[0]}x{image.size[1]}  {note}")


def save_ico(frames, path):
    """Multi-resolution .ico built from pre-rescaled frames (no inner resample).

    Pillow matches supplied frames against `sizes` by exact dimensions and
    skips any size larger than the base image, so the base image must be the
    largest frame and every frame must be listed in `sizes`.
    """
    os.makedirs(os.path.dirname(path), exist_ok=True)
    ordered = sorted(frames, key=lambda frame: frame.size[0])
    largest = ordered[-1]
    sizes = [(frame.size[0], frame.size[1]) for frame in ordered]
    largest.save(
        path,
        format="ICO",
        sizes=sizes,
        append_images=ordered[:-1],
        bitmap_format="png",
    )
    rel = os.path.relpath(path, REPO_ROOT)
    rendered = ", ".join(f"{w}x{h}" for w, h in sizes)
    print(f"  {rel:<44} {rendered}")


def main():
    master = load_master()
    box = artwork_box(master)
    background = tile_colour(master, box)

    print("Cambuz website icons — derived from assets/icon-master.png")
    print(f"  master: {master.size[0]}x{master.size[1]} RGBA")
    print(
        "  artwork: "
        f"{box[2] - box[0]}x{box[3] - box[1]} at ({box[0]}, {box[1]})  "
        f"tile colour #{background[0]:02x}{background[1]:02x}{background[2]:02x}"
    )

    print("\nBrowser tab / manifest:")
    for size in (16, 32, 48):
        save_png(
            rescale_full_canvas(master, size),
            os.path.join(PUBLIC, f"favicon-{size}.png"),
            "full canvas",
        )
    save_ico(
        [rescale_full_canvas(master, size) for size in (16, 32, 48)],
        os.path.join(PUBLIC, "favicon.ico"),
    )
    save_png(
        rescale_full_canvas(master, 192),
        os.path.join(ICONS, "icon-192.png"),
        "full canvas",
    )
    save_png(
        rescale_full_canvas(master, 512),
        os.path.join(ICONS, "icon-512.png"),
        "full canvas (matches the app package)",
    )

    print("\nHome-screen / installable-app icons:")
    save_png(
        composite_on_tile(master, box, background, 180, TOUCH_ARTWORK),
        os.path.join(PUBLIC, "apple-touch-icon.png"),
        "artwork on tile colour (iOS masks corners)",
    )
    save_png(
        composite_on_tile(master, box, background, 512, MASKABLE_ARTWORK),
        os.path.join(ICONS, "maskable-icon-512.png"),
        "artwork at 80% safe zone on tile colour",
    )

    print("\nWordmark mark for the site chrome:")
    for size in (128, 256):
        save_png(
            rescale_full_canvas(master, size),
            os.path.join(ICONS, f"logo-mark-{size}.png"),
            "full canvas (paired with HTML text)",
        )

    print("\nDone.")


if __name__ == "__main__":
    main()
