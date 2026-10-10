from __future__ import annotations

import hashlib
import tempfile
import unittest
from pathlib import Path

from crop_docling_pdf_figure import (
    bbox_to_pixel_rect,
    bbox_to_top_left_rect,
    select_figure,
    sha256_file,
)


class CropDoclingPdfFigureTests(unittest.TestCase):
    def test_converts_bottom_left_bbox_and_keeps_it_inside_page(self) -> None:
        rect = bbox_to_top_left_rect(
            {"l": 10, "t": 80, "r": 30, "b": 50, "coord_origin": "BOTTOMLEFT"},
            page_width=100,
            page_height=100,
        )

        self.assertEqual(rect, (10, 20, 30, 50))

    def test_rejects_bbox_outside_page(self) -> None:
        with self.assertRaisesRegex(ValueError, "outside"):
            bbox_to_top_left_rect(
                {"l": -1, "t": 80, "r": 30, "b": 50, "coord_origin": "BOTTOMLEFT"},
                page_width=100,
                page_height=100,
            )

    def test_rejects_unrecognized_coordinate_origin(self) -> None:
        with self.assertRaisesRegex(ValueError, "BOTTOMLEFT"):
            bbox_to_top_left_rect(
                {"l": 10, "t": 80, "r": 30, "b": 50, "coord_origin": "TOPLEFT"},
                page_width=100,
                page_height=100,
            )

    def test_pixel_bbox_is_scaled_at_requested_dpi(self) -> None:
        rect = bbox_to_pixel_rect(
            {"l": 72, "t": 720, "r": 144, "b": 648, "coord_origin": "BOTTOMLEFT"},
            page_width=612,
            page_height=792,
            dpi=144,
        )

        self.assertEqual(rect, (144, 144, 288, 288))

    def test_rejects_nonpositive_pixel_bounds(self) -> None:
        with self.assertRaisesRegex(ValueError, "positive"):
            bbox_to_pixel_rect(
                {"l": 72, "t": 720, "r": 72.01, "b": 719.99, "coord_origin": "BOTTOMLEFT"},
                page_width=612,
                page_height=792,
                dpi=1,
            )

    def test_selects_only_docling_bbox_attached_to_requested_question(self) -> None:
        booklet, figure = select_figure(
            {
                "booklets": [
                    {
                        "booklet": "QT",
                        "sourceSha256": "pdf-hash",
                        "figures": [
                            {
                                "file": "figure-006.png",
                                "sha256": "figure-hash",
                                "provenance": [
                                    {
                                        "page": 3,
                                        "bbox": {
                                            "l": 1,
                                            "t": 9,
                                            "r": 8,
                                            "b": 2,
                                            "coord_origin": "BOTTOMLEFT",
                                        },
                                    }
                                ],
                                "samePageQuestionCandidates": [[{"questionId": 2737}]],
                            }
                        ],
                    }
                ]
            },
            "QT",
            "figure-006.png",
            2737,
        )

        self.assertEqual(booklet["sourceSha256"], "pdf-hash")
        self.assertEqual(figure["page"], 3)
        self.assertEqual(figure["bbox"]["l"], 1)

    def test_rejects_question_without_docling_page_association(self) -> None:
        manifest = {
            "booklets": [
                {
                    "booklet": "QT",
                    "figures": [
                        {
                            "file": "figure-006.png",
                            "provenance": [{"page": 3, "bbox": {"l": 1}}],
                            "samePageQuestionCandidates": [[{"questionId": 1}]],
                        }
                    ],
                }
            ]
        }

        with self.assertRaisesRegex(ValueError, "not a Docling same-page candidate"):
            select_figure(manifest, "QT", "figure-006.png", 2737)

    def test_hashes_exact_file_bytes(self) -> None:
        with tempfile.TemporaryDirectory(dir=Path(__file__).resolve().parents[3] / "tmp/pdfs/image-review") as directory:
            path = Path(directory) / "hash-fixture.bin"
            payload = b"candidate bytes\x00"
            path.write_bytes(payload)

            self.assertEqual(sha256_file(path), hashlib.sha256(payload).hexdigest())


if __name__ == "__main__":
    unittest.main()
