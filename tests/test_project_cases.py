"""Run with python tests/test_project_cases.py (Playwright and Chrome required)."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
import unittest

from playwright.sync_api import expect, sync_playwright


class ProjectCases(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        root = Path(__file__).resolve().parents[1] / "docs"
        handler = partial(SimpleHTTPRequestHandler, directory=str(root))
        cls.server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
        Thread(target=cls.server.serve_forever, daemon=True).start()
        cls.url = f"http://127.0.0.1:{cls.server.server_port}/#area-projetos"
        cls.driver = sync_playwright().start()
        cls.browser = cls.driver.chromium.launch(channel="chrome")

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.driver.stop()
        cls.server.shutdown()
        cls.server.server_close()

    def page(self, **options):
        page = self.browser.new_page(**options)
        self.addCleanup(page.close)
        page.goto(self.url, wait_until="domcontentloaded")
        return page

    def test_gallery_and_return_to_filtered_card(self):
        page = self.page(viewport={"width": 1440, "height": 900})
        page.locator('[data-filter="academic"]').click()
        trigger = page.locator('[data-open="dungeon"]')
        trigger.scroll_into_view_if_needed()
        position = page.evaluate("scrollY")
        trigger.click()
        dialog = page.get_by_role("dialog", name="Scrum Dungeon")
        expect(dialog).to_be_visible()
        close = page.locator(".case-close")
        expect(close).to_be_focused()
        page.keyboard.press("Shift+Tab")
        expect(page.locator('[data-project-step="1"]')).to_be_focused()
        page.keyboard.press("Tab")
        expect(close).to_be_focused()
        page.locator(".case-stage img").first.click()
        expect(page.locator(".case-gallery")).to_have_class("case-gallery is-expanded")
        page.keyboard.press("ArrowRight")
        expect(page.locator(".case-caption")).to_contain_text("Questionário")
        page.keyboard.press("Escape")
        expect(dialog).to_be_visible()
        page.locator('[data-slide="1"]').click()
        page.locator(".case-markers button").last.click()
        expect(page.locator(".case-player a")).to_have_attribute("href", "https://www.youtube.com/watch?v=iSikcW3CIZE")
        page.locator('[data-project-step="1"]').click()
        expect(page.get_by_role("dialog", name="RECALL")).to_be_visible()
        expect(page.locator(".case-stage iframe")).to_have_count(0)
        page.locator('[data-project-step="-1"]').click()
        close.click()
        expect(dialog).not_to_be_visible()
        expect(trigger).to_be_focused()
        self.assertEqual(position, page.evaluate("scrollY"))
        expect(page.locator('[data-filter="academic"]')).to_have_attribute("aria-pressed", "true")

    def test_mobile_swipe_zoom_and_reduced_motion(self):
        page = self.page(viewport={"width": 390, "height": 844}, has_touch=True, reduced_motion="reduce")
        page.locator('[data-open="recall"]').click()
        self.assertEqual(page.locator(".case-flight").count(), 0)
        stage = page.locator(".case-stage").bounding_box()
        session = page.context.new_cdp_session(page)
        y = stage["y"] + stage["height"] / 2
        for event, points in [
            ("touchStart", [{"x": stage["x"] + 190, "y": y}]),
            ("touchMove", [{"x": stage["x"] + 70, "y": y}]),
            ("touchEnd", []),
        ]:
            session.send("Input.dispatchTouchEvent", {"type": event, "touchPoints": points})
        expect(page.locator(".case-caption")).to_contain_text("Captura rápida")
        page.locator(".case-stage img").first.click()
        bounds = page.locator(".case-gallery").bounding_box()
        self.assertEqual((bounds["width"], bounds["height"]), (390, 844))
        page.keyboard.press("Escape")
        page.keyboard.press("Escape")
        expect(page.locator("#projectDialog")).not_to_be_visible()

    def test_immediate_exit_and_repeat(self):
        page = self.page()
        trigger = page.locator('[data-open="eco"]')
        for _ in range(2):
            trigger.click()
            page.keyboard.press("Escape")
            expect(page.locator("#projectDialog")).not_to_be_visible()
            expect(trigger).to_be_focused()
            self.assertFalse(page.locator("html").evaluate("el => el.classList.contains('case-open')"))


if __name__ == "__main__":
    unittest.main()
