"""Only a configured Vercel preview may receive monitor writes during verification."""
import json
import os
import urllib.parse
import urllib.request
from pathlib import Path

base = os.environ.get("RHEVOLVER_MONITOR_PREVIEW_URL", "").rstrip("/")
secret = os.environ.get("RHEVOLVER_MONITOR_SECRET", "")
parsed = urllib.parse.urlparse(base)
expected = "rhevolver-news-git-rhevolver-monitor-24-7-rhevolver.vercel.app"
if parsed.scheme != "https" or parsed.hostname != expected or parsed.path or parsed.query or parsed.fragment or parsed.username or parsed.password:
    raise SystemExit("Configure the exact rhevolver-monitor-24-7 Vercel preview URL")
if not secret:
    raise SystemExit("RHEVOLVER_MONITOR_SECRET is required")

# Do not forward authorization if a deployment redirects to another origin.
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None

opener = urllib.request.build_opener(NoRedirect)
def access_headers():
    headers = {"Authorization": f"Bearer {secret}", "Content-Type": "application/json"}
    bypass = os.environ.get("VERCEL_AUTOMATION_BYPASS_SECRET")
    if bypass:
        headers["x-vercel-protection-bypass"] = bypass
    oidc = os.environ.get("VERCEL_TRUSTED_OIDC_TOKEN")
    if oidc:
        headers["x-vercel-trusted-oidc-idp-token"] = oidc
    return headers

def call(path, body=None):
    headers = access_headers()
    data = json.dumps(body or {}).encode()
    request = urllib.request.Request(base + path, data=data, headers=headers, method="POST")
    with opener.open(request, timeout=300) as response:
        result = json.load(response)
    if result.get("ok") is not True:
        raise RuntimeError(f"Monitor failed: {path}")
    print(f"{path}: ok")
    return result

status_request = urllib.request.Request(base + "/api/monitor/status", headers=access_headers())
with opener.open(status_request, timeout=30) as response:
    status = json.load(response)
if status.get("environment") != "preview":
    raise SystemExit("Target is not a preview environment")
call("/api/monitor/self-test")
items = json.loads(Path("work/acquisition-items.json").read_text(encoding="utf-8"))
for start in range(0, len(items["items"]), 100):
    batch = {"items": items["items"][start:start + 100]}
    call("/api/monitor/run", batch)
    duplicate = call("/api/monitor/run", batch)
    if duplicate.get("newItems") != 0:
        raise RuntimeError("Cross-request deduplication failed")
call("/api/monitor/sweep")
call("/api/monitor/watchdog")
if Path("work/dam-observation.json").exists():
    call("/api/monitor/dam", json.loads(Path("work/dam-observation.json").read_text(encoding="utf-8")))
