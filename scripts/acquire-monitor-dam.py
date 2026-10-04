"""Read the official SIH station CSV in memory; fail closed on unfamiliar schemas."""
import csv
import datetime as dt
import io
import json
import pathlib
import re
import unicodedata
import urllib.request

URL = "https://sih.conagua.gob.mx/basedatos/Presas/VTRGR.csv"
def normalized(value):
    return "".join(c for c in unicodedata.normalize("NFKD", value.lower()) if not unicodedata.combining(c))

def parse_csv(text, now=None):
    now = now or dt.datetime.now(dt.timezone.utc)
    if "<html" in text.lower() or "<script" in text.lower():
        raise ValueError("CSV endpoint returned HTML")
    rows = list(csv.reader(io.StringIO(text)))
    header_index = next((i for i, row in enumerate(rows) if any(normalized(c).strip() == "fecha" for c in row)), None)
    if header_index is None:
        raise ValueError("Unrecognized SIH CSV schema")
    columns = {}
    for i, label in enumerate(rows[header_index]):
        label = normalized(label)
        if label.strip() == "fecha": columns["date"] = i
        elif "almacenamiento" in label and "hm3" in re.sub(r"\s", "", label): columns["volumeHm3"] = i
        elif "elevacion" in label and "msnm" in re.sub(r"\s|\.", "", label): columns["level"] = i
        elif ("extraccion" in label or "descarga" in label) and "m3/s" in re.sub(r"\s", "", label): columns["release"] = i
        elif ("llenado" in label or "porcentaje" in label) and "%" in label: columns["fillPercent"] = i
    if len(columns) < 2:
        raise ValueError("No supported measurements with explicit units")
    readings = []
    for row in rows[header_index + 1:]:
        try:
            raw_date = row[columns["date"]].strip()
            date = None
            for fmt in ("%d/%m/%Y", "%Y-%m-%d"):
                try: date = dt.datetime.strptime(raw_date, fmt).replace(tzinfo=dt.timezone.utc); break
                except ValueError: pass
            if not date or date > now or (now - date).total_seconds() > 72 * 3600: continue
            reading = {"sourceUrl": URL, "station": "VTRGR", "observedAt": date.date().isoformat()}
            for field, index in columns.items():
                if field == "date": continue
                raw = row[index].strip()
                if raw not in ("", "N/D", "ND", "S/D", "-"):
                    # Decimal dots only; never silently reinterpret ambiguous comma units.
                    if not re.fullmatch(r"\d+(?:\.\d+)?", raw): raise ValueError("Invalid measurement")
                    reading[field] = float(raw)
            if len(reading) > 3: readings.append(reading)
        except (ValueError, IndexError): continue
    if not readings: raise ValueError("No fresh valid observations")
    return max(readings, key=lambda r: r["observedAt"])

if __name__ == "__main__":
    output = pathlib.Path("work"); output.mkdir(exist_ok=True)
    try:
        request = urllib.request.Request(URL, headers={"User-Agent": "RhevolverMonitor/1.0"})
        with urllib.request.urlopen(request, timeout=30) as response:
            if response.url != URL: raise ValueError("Unexpected station CSV redirect")
            reading = parse_csv(response.read(4_000_000).decode("utf-8-sig"))
        (output / "dam-observation.json").write_text(json.dumps(reading), encoding="utf-8")
        report = {"ok": True, "sourceUrl": URL, "station": "VTRGR", "observedAt": reading["observedAt"]}
    except Exception as exc:
        report = {"ok": False, "sourceUrl": URL, "station": "VTRGR", "error": type(exc).__name__}
    (output / "dam-acquisition-report.json").write_text(json.dumps(report), encoding="utf-8")
    print(json.dumps(report))
