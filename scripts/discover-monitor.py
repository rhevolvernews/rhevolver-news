"""Acquire official pages in memory. Never persist HTML, screenshots or media."""
import json
import pathlib
from playwright.sync_api import sync_playwright

root = pathlib.Path(__file__).resolve().parents[1]
sources = json.loads((root / "monitor/sources-config.json").read_text(encoding="utf-8"))
selected = [s for s in sources if s["id"] in ("seg-indexed", "iepc-gro") or (s["scope"] == "federal" and "/archivo/prensa" in s["url"])]
results = []
with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context(user_agent="RhevolverMonitor/1.0")
    for source in selected:
        page = context.new_page()
        urls = ([f"https://www.seg.gob.mx/?cat={cat}" for cat in (2, 7, 16)]
                if source["id"] == "seg-indexed" else [source["url"]])
        links, errors = set(), []
        for url in urls:
            try:
                response = page.goto(url, wait_until="domcontentloaded", timeout=25000)
                if not response or not response.ok:
                    raise RuntimeError(f"HTTP {response.status if response else 'unknown'}")
                # Allow the site's own scripts to render; do not solve or bypass challenges.
                try:
                    page.wait_for_load_state("networkidle", timeout=7000)
                except Exception:
                    pass
                text = page.title() + " " + page.locator("body").inner_text(timeout=5000)[:2000]
                if any(word.lower() in text.lower() for word in ("Challenge Validation", "captcha", "Access Denied")):
                    raise RuntimeError("Source blocked")
                links.update(page.locator("a[href], [data-file]").evaluate_all(
                    "nodes => nodes.map(n => n.getAttribute('data-file') || n.href).filter(Boolean)"))
            except Exception as exc:
                # Error details can contain page bodies; persist only the exception class.
                errors.append(type(exc).__name__)
        results.append({"source": source["id"], "links": sorted(links), "errors": errors})
        page.close()
    browser.close()
(root / "work").mkdir(exist_ok=True)
(root / "work/acquisition-raw.json").write_text(json.dumps(results), encoding="utf-8")
