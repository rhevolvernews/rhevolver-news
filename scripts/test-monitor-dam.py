import datetime as dt
import importlib.util
import pathlib
import unittest
spec = importlib.util.spec_from_file_location("dam", pathlib.Path(__file__).with_name("acquire-monitor-dam.py"))
dam = importlib.util.module_from_spec(spec)
spec.loader.exec_module(dam)

class DamCsvTests(unittest.TestCase):
    def test_real_sih_schema_and_station_identity(self):
        now = dt.datetime(2026, 10, 4, 12, tzinfo=dt.timezone.utc)
        text = "Comisión Nacional del Agua\nClave: VTRGR\nEstacion,Fecha,Precipitacion(mm),Nivel(m),VolumenAlm(Mm3),ObraToma(m3/s),Vertedor(m3/s),Derrame(m3/s),Evaporacion(mm)\nVTRGR,2026-10-02,0,833.78,7.292,0.234,0,0,4.32\nVTRGR,2026-10-03,15.6,833.77,7.272,0.234,0,0,4.69\nOTHER,2026-10-04,0,999,999,999,999,999,0\n"
        reading = dam.parse_csv(text, now)
        self.assertEqual(reading["observedAt"], "2026-10-03")
        self.assertEqual(reading["volumeHm3"], 7.272)
        self.assertEqual(reading["level"], 833.77)
        self.assertEqual(reading["outletM3s"], 0.234)
        self.assertEqual(reading["spillwayM3s"], 0)
        self.assertEqual(reading["overflowM3s"], 0)
        self.assertNotIn("release", reading)
        self.assertNotIn("fillPercent", reading)

    def test_latest_official_observation_with_explicit_units(self):
        now = dt.datetime(2026, 10, 4, 12, tzinfo=dt.timezone.utc)
        reading = dam.parse_csv("Estacion VTRGR\nFecha,Elevación (msnm),Almacenamiento (hm³),Extracción (m3/s)\n03/10/2026,712.2,20.3,0\n04/10/2026,713.1,21.4,0.5\n", now)
        self.assertEqual(reading["observedAt"], "2026-10-04")
        self.assertEqual(reading["volumeHm3"], 21.4)
        self.assertEqual(reading["release"], 0.5)
        self.assertNotIn("fillPercent", reading)

    def test_rejects_challenge_unknown_units_missing_and_stale_data(self):
        now = dt.datetime(2026, 10, 4, 12, tzinfo=dt.timezone.utc)
        for text in ("<html>Challenge</html>", "Fecha,Almacenamiento\n04/10/2026,22", "Fecha,Almacenamiento (hm3)\n01/01/2020,20", "Fecha,Almacenamiento (hm3)\n04/10/2026,N/D", "Fecha,Almacenamiento (hm3)\n04/10/2026,-12"):
            with self.assertRaises(ValueError): dam.parse_csv(text, now)

if __name__ == "__main__": unittest.main()
