"""Prepare a ZIP with the static files served by REG.RU."""

import argparse
from html import escape
from pathlib import Path
import re
import time
from urllib.parse import urlsplit
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo


PROJECT = Path(__file__).resolve().parents[1]
SOCIAL_IMAGE = "assets/og-mzso.jpg"
STATIC_FILES = (
    "styles.css",
    "script.js",
    "favicon.svg",
    "assets/hero-conveyor.webp",
    "assets/hero-conveyor-mobile.webp",
    "assets/catalog-rollers.webp",
    "assets/catalog-supports.webp",
    "assets/catalog-drums.webp",
    "assets/catalog-conveyors.webp",
    "assets/catalog-screens.webp",
    "assets/catalog-feeders.webp",
    "assets/catalog-metal.webp",
    "assets/production-detail.webp",
    "assets/fonts/manrope-cyrillic.woff2",
    "assets/fonts/manrope-latin.woff2",
    "assets/fonts/OFL.txt",
)
DOMAIN_LABEL = re.compile(r"[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?")


def https_origin(value):
    try:
        url = urlsplit(value)
        if (
            url.scheme != "https"
            or not url.hostname
            or url.netloc.endswith(":")
            or url.username is not None
            or url.port is not None
            or url.path not in ("", "/")
            or "?" in value
            or "#" in value
        ):
            raise ValueError
        domain = url.hostname.encode("idna").decode("ascii")
        labels = domain.split(".")
        if (
            len(domain) > 253
            or len(labels) < 2
            or labels[-1].isdigit()
            or not all(DOMAIN_LABEL.fullmatch(label) for label in labels)
        ):
            raise ValueError
    except (ValueError, UnicodeError):
        raise argparse.ArgumentTypeError(
            "укажите HTTPS-адрес домена без пути, порта и параметров"
        ) from None
    return f"https://{domain}/"


def add_metadata(html, homepage):
    if homepage is None:
        tags = ['<meta name="robots" content="noindex, follow">']
    else:
        url = escape(homepage, quote=True)
        tags = [
            f'<link rel="canonical" href="{url}">',
            f'<meta property="og:url" content="{url}">',
            '<meta property="og:site_name" content="МЗСО">',
            f'<meta property="og:image" content="{url}{SOCIAL_IMAGE}">',
            '<meta property="og:image:type" content="image/jpeg">',
            '<meta property="og:image:width" content="1200">',
            '<meta property="og:image:height" content="630">',
            '<meta property="og:image:alt" content="Иллюстрация промышленного конвейера">',
        ]
    if html.count("</head>") != 1:
        raise ValueError("В index.html ожидается один закрывающий тег </head>")
    return html.replace("</head>", "  " + "\n  ".join(tags) + "\n</head>", 1)


def package(homepage, output):
    files = {"index.html": add_metadata((PROJECT / "index.html").read_text("utf-8"), homepage)}
    files.update((name, (PROJECT / name).read_bytes()) for name in STATIC_FILES)
    robots = (PROJECT / "robots.txt").read_text("utf-8").rstrip() + "\n"
    if homepage is not None:
        robots += f"\nSitemap: {homepage}sitemap.xml\n"
        files["sitemap.xml"] = (
            '<?xml version="1.0" encoding="UTF-8"?>\n'
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
            f"  <url><loc>{escape(homepage)}</loc></url>\n"
            "</urlset>\n"
        )
        files[SOCIAL_IMAGE] = (PROJECT / SOCIAL_IMAGE).read_bytes()
    files["robots.txt"] = robots

    timestamp = time.localtime()[:6]
    with ZipFile(output, "x") as archive:
        for name, content in files.items():
            entry = ZipInfo(name, timestamp)
            entry.create_system = 3
            entry.external_attr = 0o100644 << 16
            archive.writestr(entry, content, compress_type=ZIP_DEFLATED, compresslevel=9)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--site-url", type=https_origin, help="основной HTTPS-адрес сайта")
    mode.add_argument("--preview", action="store_true", help="архив для проверки без индексации")
    parser.add_argument("--output", type=Path, required=True, help="путь к новому ZIP-файлу")
    args = parser.parse_args()
    try:
        package(args.site_url, args.output)
    except (OSError, ValueError) as error:
        parser.exit(1, f"Не удалось создать архив: {error}\n")
    print(args.output)


if __name__ == "__main__":
    main()
