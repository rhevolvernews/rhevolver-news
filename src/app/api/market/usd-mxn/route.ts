import { NextResponse } from "next/server";

export const revalidate = 1800;

type MarketPayload = {
  rate: number;
  previousRate: number | null;
  direction: "up" | "down" | "flat";
  change: number;
  updatedAt: string;
  source: string;
};

function businessDayOffset(base: Date, offsetDays: number) {
  const date = new Date(base);
  let remaining = Math.abs(offsetDays);
  const step = offsetDays >= 0 ? 1 : -1;

  while (remaining > 0) {
    date.setUTCDate(date.getUTCDate() + step);
    const day = date.getUTCDay();
    if (day !== 0 && day !== 6) remaining -= 1;
  }

  return date;
}

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function buildPayload(rate: number, previousRate: number | null, source: string): MarketPayload {
  const normalizedRate = Number(rate.toFixed(4));
  const normalizedPrev = previousRate !== null ? Number(previousRate.toFixed(4)) : null;
  const delta = normalizedPrev !== null ? Number((normalizedRate - normalizedPrev).toFixed(4)) : 0;
  const direction = delta > 0.0001 ? "up" : delta < -0.0001 ? "down" : "flat";

  return {
    rate: normalizedRate,
    previousRate: normalizedPrev,
    direction,
    change: delta,
    updatedAt: new Date().toISOString(),
    source,
  };
}

async function fetchFrankfurter(): Promise<MarketPayload | null> {
  const latestResponse = await fetch("https://api.frankfurter.app/latest?from=USD&to=MXN", {
    headers: { accept: "application/json" },
    next: { revalidate },
  });
  if (!latestResponse.ok) return null;
  const latestJson = await latestResponse.json();
  const latest = Number(latestJson?.rates?.MXN);
  if (!Number.isFinite(latest)) return null;

  const previousBusinessDate = isoDate(businessDayOffset(new Date(), -1));
  const previousResponse = await fetch(`https://api.frankfurter.app/${previousBusinessDate}?from=USD&to=MXN`, {
    headers: { accept: "application/json" },
    next: { revalidate },
  });
  let previous: number | null = null;
  if (previousResponse.ok) {
    const previousJson = await previousResponse.json();
    const previousValue = Number(previousJson?.rates?.MXN);
    previous = Number.isFinite(previousValue) ? previousValue : null;
  }

  return buildPayload(latest, previous, "frankfurter.app");
}

async function fetchOpenErApi(): Promise<MarketPayload | null> {
  const response = await fetch("https://open.er-api.com/v6/latest/USD", {
    headers: { accept: "application/json" },
    next: { revalidate },
  });
  if (!response.ok) return null;
  const json = await response.json();
  const latest = Number(json?.rates?.MXN);
  if (!Number.isFinite(latest)) return null;
  return buildPayload(latest, null, "open.er-api.com");
}

export async function GET() {
  try {
    const frankfurter = await fetchFrankfurter();
    if (frankfurter) return NextResponse.json(frankfurter, { status: 200 });

    const openErApi = await fetchOpenErApi();
    if (openErApi) return NextResponse.json(openErApi, { status: 200 });

    return NextResponse.json({ error: "market_unavailable" }, { status: 503 });
  } catch (error) {
    console.error("Error fetching USD/MXN market data", error);
    return NextResponse.json({ error: "market_unavailable" }, { status: 503 });
  }
}
