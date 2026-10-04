export const damSourceUrl = "https://sih.conagua.gob.mx/basedatos/Presas/VTRGR.csv";
export type DamReading = { observedAt: string; sourceUrl: string; station: "VTRGR"; fillPercent: number | null; volumeHm3: number | null; level: number | null; release: number | null; verified: true };

// The acquisition adapter must supply the original official observation, never the fetch time.
export function validateDamReading(body: Record<string, unknown>, now = Date.now()): DamReading {
  if (body.sourceUrl !== damSourceUrl || body.station !== "VTRGR") throw new Error("Official VTRGR CSV provenance required");
  if (typeof body.observedAt !== "string" || !/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(body.observedAt)) throw new Error("ISO observation date required");
  const observed = Date.parse(body.observedAt);
  if (!Number.isFinite(observed) || observed > now || now - observed > 72 * 60 * 60 * 1000) throw new Error("Observation stale or invalid");
  const values = { fillPercent: body.fillPercent ?? null, volumeHm3: body.volumeHm3 ?? null, level: body.level ?? null, release: body.release ?? null };
  if (Object.values(values).every(x => x === null)) throw new Error("At least one measurement required");
  for (const [field, value] of Object.entries(values)) {
    if (value !== null && (typeof value !== "number" || !Number.isFinite(value) || value < 0)) throw new Error(`Invalid ${field}`);
  }
  if (typeof values.fillPercent === "number" && values.fillPercent > 200) throw new Error("Invalid fillPercent");
  return { observedAt: body.observedAt, sourceUrl: damSourceUrl, station: "VTRGR", ...values, verified: true } as DamReading;
}

export function damMeasurementsChanged(previous: DamReading | null, current: DamReading) {
  return !previous || ["fillPercent", "volumeHm3", "level", "release"].some(field => previous[field as keyof DamReading] !== current[field as keyof DamReading]);
}
