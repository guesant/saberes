#!/usr/bin/env python3
"""Render a Docling-provenanced PDF figure bbox at high resolution."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path
import re
import subprocess
from typing import Any


REPO_ROOT = Path(__file__).resolve().parents[3]
ALLOWED_OUTPUT_ROOTS = (
    REPO_ROOT / "tools/editorial/assets",
    REPO_ROOT / "tmp/pdfs/image-review",
)


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def png_dimensions(path: Path) -> tuple[int, int]:
    with path.open("rb") as stream:
        header = stream.read(24)
    if len(header) < 24 or header[:8] != b"\x89PNG\r\n\x1a\n" or header[12:16] != b"IHDR":
        raise ValueError("Rendered output is not a valid PNG")
    return (int.from_bytes(header[16:20], "big"), int.from_bytes(header[20:24], "big"))


def bbox_to_top_left_rect(
    bbox: dict[str, Any], page_width: float, page_height: float
) -> tuple[float, float, float, float]:
    """Convert an explicit Docling bbox to PDF top-left coordinates, validating bounds."""
    if bbox.get("coord_origin") != "BOTTOMLEFT":
        raise ValueError("Only explicit BOTTOMLEFT Docling bboxes are supported")

    try:
        left, top, right, bottom = (float(bbox[key]) for key in ("l", "t", "r", "b"))
    except (KeyError, TypeError, ValueError) as error:
        raise ValueError("Docling bbox must contain numeric l/t/r/b coordinates") from error

    values = (left, top, right, bottom, page_width, page_height)
    if not all(math.isfinite(value) for value in values):
        raise ValueError("Page dimensions and bbox coordinates must be finite")
    if page_width <= 0 or page_height <= 0:
        raise ValueError("Page dimensions must be positive")
    if left < 0 or bottom < 0 or right > page_width or top > page_height:
        raise ValueError("Docling bbox falls outside the source PDF page")
    if left >= right or bottom >= top:
        raise ValueError("Docling bbox must have positive width and height")

    return (left, page_height - top, right, page_height - bottom)


def bbox_to_pixel_rect(
    bbox: dict[str, Any], page_width: float, page_height: float, dpi: int
) -> tuple[int, int, int, int]:
    if dpi <= 0:
        raise ValueError("DPI must be positive")
    left, top, right, bottom = bbox_to_top_left_rect(bbox, page_width, page_height)
    scale = dpi / 72
    page_pixel_width = math.ceil(page_width * scale)
    page_pixel_height = math.ceil(page_height * scale)
    pixel_rect = tuple(round(value * scale) for value in (left, top, right, bottom))
    x0, y0, x1, y1 = pixel_rect
    if x0 < 0 or y0 < 0 or x1 > page_pixel_width or y1 > page_pixel_height:
        raise ValueError("Rounded pixel bbox falls outside the rendered PDF page")
    if x0 >= x1 or y0 >= y1:
        raise ValueError("Rounded pixel bbox must have positive width and height")
    return pixel_rect


def read_pdf_page_size(pdf_path: Path, page_number: int) -> tuple[float, float]:
    result = subprocess.run(
        ["pdfinfo", "-f", str(page_number), "-l", str(page_number), str(pdf_path)],
        check=True,
        capture_output=True,
        text=True,
    )
    match = re.search(
        rf"^Page\s+{page_number}\s+size:\s+([\d.]+) x ([\d.]+) pts",
        result.stdout,
        flags=re.MULTILINE,
    )
    if not match:
        raise ValueError(f"pdfinfo did not report page {page_number}'s dimensions")
    return float(match.group(1)), float(match.group(2))


def select_figure(
    manifest: dict[str, Any], booklet_name: str, figure_name: str, question_id: int
) -> tuple[dict[str, Any], dict[str, Any]]:
    booklets = [booklet for booklet in manifest.get("booklets", []) if booklet.get("booklet") == booklet_name]
    if len(booklets) != 1:
        raise ValueError(f"Expected one Docling booklet named {booklet_name!r}")
    booklet = booklets[0]

    figures = [figure for figure in booklet.get("figures", []) if figure.get("file") == figure_name]
    if len(figures) != 1:
        raise ValueError(f"Expected one figure named {figure_name!r} in booklet {booklet_name!r}")
    figure = figures[0]

    candidates: set[int] = set()
    for group in figure.get("samePageQuestionCandidates", []):
        for candidate in group:
            if isinstance(candidate, dict) and candidate.get("questionId") is not None:
                candidates.add(int(candidate["questionId"]))
    if question_id not in candidates:
        raise ValueError(f"Question {question_id} is not a Docling same-page candidate for this figure")

    provenance = figure.get("provenance", [])
    if len(provenance) != 1 or not isinstance(provenance[0].get("bbox"), dict):
        raise ValueError("Figure must have exactly one explicit Docling page bbox")
    return booklet, {**figure, "page": int(provenance[0]["page"]), "bbox": provenance[0]["bbox"]}


def ensure_allowed_output(path: Path) -> Path:
    resolved = path.resolve()
    if not any(resolved.is_relative_to(root.resolve()) for root in ALLOWED_OUTPUT_ROOTS):
        raise ValueError(f"Output must be inside tools/editorial/assets or tmp/pdfs/image-review: {path}")
    return resolved


def render_crop(args: argparse.Namespace) -> dict[str, Any]:
    pdf_path = args.pdf.resolve()
    manifest_path = args.manifest.resolve()
    source_asset_path = args.source_asset.resolve()
    output_path = ensure_allowed_output(args.output)
    metadata_path = ensure_allowed_output(args.metadata)

    if output_path.suffix.lower() != ".png":
        raise ValueError("Candidate output path must end in .png")
    if output_path == metadata_path:
        raise ValueError("Candidate image and metadata must use different paths")
    if output_path.exists() or metadata_path.exists():
        raise FileExistsError("Refusing to overwrite an existing crop or metadata file")
    if not pdf_path.is_file() or not manifest_path.is_file() or not source_asset_path.is_file():
        raise FileNotFoundError("PDF, Docling manifest, and source asset must exist")
    if not args.alt_text.strip():
        raise ValueError("Accessibility alt text is required")

    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    booklet, figure = select_figure(manifest, args.booklet, args.figure, args.question_id)
    pdf_hash = sha256_file(pdf_path)
    if pdf_hash != booklet.get("sourceSha256"):
        raise ValueError("Source PDF hash does not match the Docling manifest")

    page_number = figure["page"]
    page_width, page_height = read_pdf_page_size(pdf_path, page_number)
    x, y, right, bottom = bbox_to_pixel_rect(figure["bbox"], page_width, page_height, args.dpi)
    width, height = right - x, bottom - y

    output_path.parent.mkdir(parents=True, exist_ok=True)
    metadata_path.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [
            "pdftoppm",
            "-f", str(page_number),
            "-l", str(page_number),
            "-r", str(args.dpi),
            "-png",
            "-singlefile",
            "-x", str(x),
            "-y", str(y),
            "-W", str(width),
            "-H", str(height),
            str(pdf_path),
            str(output_path.with_suffix("")),
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    rendered_path = output_path.with_suffix(".png")
    if rendered_path != output_path:
        rendered_path.replace(output_path)

    dimensions = png_dimensions(output_path)

    metadata = {
        "format": "docling-pdf-crop-candidate/v1",
        "sourcePdf": str(pdf_path.relative_to(REPO_ROOT)),
        "sourcePdfSha256": pdf_hash,
        "page": page_number,
        "bbox": figure["bbox"],
        "bboxCoordinates": "PDF points, Docling BOTTOMLEFT origin",
        "doclingBooklet": args.booklet,
        "doclingFigure": figure["file"],
        "doclingFigureSha256": figure.get("sha256"),
        "sourceAsset": str(source_asset_path.relative_to(REPO_ROOT)),
        "sourceAssetSha256": sha256_file(source_asset_path),
        "questionId": args.question_id,
        "candidatePng": str(output_path.relative_to(REPO_ROOT)),
        "candidatePngSha256": sha256_file(output_path),
        "dimensionsPixels": list(dimensions),
        "renderDpi": args.dpi,
        "accessibilityAltText": args.alt_text.strip(),
        "visualReview": "pending",
    }
    metadata_path.write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return metadata


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--pdf", type=Path, required=True)
    parser.add_argument("--manifest", type=Path, required=True)
    parser.add_argument("--booklet", required=True)
    parser.add_argument("--figure", required=True)
    parser.add_argument("--question-id", type=int, required=True)
    parser.add_argument("--source-asset", type=Path, required=True)
    parser.add_argument("--alt-text", required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--metadata", type=Path, required=True)
    parser.add_argument("--dpi", type=int, default=450)
    return parser


def main() -> None:
    args = build_parser().parse_args()
    if args.dpi <= 0:
        raise SystemExit("--dpi must be a positive integer")
    metadata = render_crop(args)
    print(json.dumps(metadata, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
