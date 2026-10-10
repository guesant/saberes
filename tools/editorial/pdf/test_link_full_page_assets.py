import unittest

from link_full_page_assets import page_number


class PageNumberTests(unittest.TestCase):
    def test_extracts_physical_page_number_from_full_page_filename(self):
        self.assertEqual(page_number("official-pdfs/2025/page-images/QZ-page-03.png"), 3)
        self.assertEqual(page_number("official-pdfs/2026/page-images/qx-page-24.png"), 24)
        self.assertEqual(page_number("official-pdfs/2027-simulation/page-images/qt-page-14.png"), 14)

    def test_does_not_confuse_page_images_directory_with_filename(self):
        self.assertIsNone(page_number("official-pdfs/2026/page-images/qx-cover.png"))
        self.assertIsNone(page_number("official-pdfs/2026/page-images/qx-page-cover.png"))


if __name__ == "__main__":
    unittest.main()
