"""Regression checks for complete, bounded delivery without live requests."""
import io
import json
import os
from pathlib import Path
import runpy
import tempfile
import unittest
from unittest.mock import patch

SCRIPT = Path(__file__).with_name("trigger-monitor-preview.py")
HOST = "rhevolver-news-git-rhevolver-monitor-24-7-rhevolver.vercel.app"


class PreviewDeliveryTest(unittest.TestCase):
    def exercise(self, environment="preview", broken_dedup=False):
        requests = []
        items = [{"source": f"source-{i // 100}", "url": f"https://example.org/{i}", "official": True} for i in range(223)]
        seen = set()

        def open_request(request, timeout):
            requests.append(request)
            self.assertEqual(request.host, HOST)
            self.assertEqual(request.get_header("Authorization"), "Bearer test-secret")
            self.assertEqual(request.get_header("X-vercel-trusted-oidc-idp-token"), "test-identity")
            result = {"ok": True, "environment": environment}
            if request.full_url.endswith("/run"):
                batch = json.loads(request.data)["items"]
                self.assertLessEqual(len(batch), 100)
                urls = {item["url"] for item in batch}
                result["newItems"] = len(urls - seen) if not broken_dedup else 1
                seen.update(urls)
            return io.StringIO(json.dumps(result))

        with tempfile.TemporaryDirectory() as directory:
            previous = Path.cwd()
            try:
                os.chdir(directory)
                Path("work").mkdir()
                Path("work/acquisition-items.json").write_text(json.dumps({"items": items}), encoding="utf-8")
                with patch.dict(os.environ, {"RHEVOLVER_MONITOR_PREVIEW_URL": f"https://{HOST}", "RHEVOLVER_MONITOR_SECRET": "test-secret", "VERCEL_TRUSTED_OIDC_TOKEN": "test-identity"}), patch("urllib.request.OpenerDirector.open", side_effect=open_request):
                    if environment != "preview":
                        with self.assertRaises(SystemExit):
                            runpy.run_path(str(SCRIPT))
                        self.assertEqual(len(requests), 1)
                    elif broken_dedup:
                        with self.assertRaisesRegex(RuntimeError, "deduplication"):
                            runpy.run_path(str(SCRIPT))
                        self.assertFalse(any(r.full_url.endswith("/sweep") for r in requests))
                    else:
                        runpy.run_path(str(SCRIPT))
                        batches = [json.loads(r.data)["items"] for r in requests if r.full_url.endswith("/run")]
                        self.assertEqual([len(b) for b in batches], [100, 100, 100, 100, 23, 23])
                        self.assertEqual([item for batch in batches[::2] for item in batch], items)
                        self.assertEqual(batches[::2], batches[1::2])
            finally:
                os.chdir(previous)

    def test_all_sources_survive_limit_and_replay(self):
        self.exercise()

    def test_production_rejected_before_writes(self):
        self.exercise(environment="production")

    def test_duplicate_failure_stops_cycle(self):
        self.exercise(broken_dedup=True)


if __name__ == "__main__":
    unittest.main()
