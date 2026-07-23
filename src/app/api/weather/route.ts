import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type WeatherResult = {
  temperature: number | null;
  weatherCode: number | null;
  isDay: boolean;
  updatedAt: string | null;
  source?: string;
};

async function fromOpenMeteo(): Promise<WeatherResult | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6500);
  try {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=18.3448&longitude=-99.5397&current=temperature_2m,weather_code,is_day&timezone=America%2FMexico_City";
    const response = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
      headers: { "User-Agent": "Rhevolver.news/8.0" },
    });
    if (!response.ok) return null;
    const data = await response.json();
    if (typeof data?.current?.temperature_2m !== "number") return null;
    return {
      temperature: Math.round(data.current.temperature_2m),
      weatherCode: typeof data.current.weather_code === "number" ? data.current.weather_code : null,
      isDay: data.current.is_day !== 0,
      updatedAt: data.current.time ?? new Date().toISOString(),
      source: "open-meteo",
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function fromWttr(): Promise<WeatherResult | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6500);
  try {
    const response = await fetch("https://wttr.in/Iguala?format=j1", {
      cache: "no-store",
      signal: controller.signal,
      headers: { "User-Agent": "Rhevolver.news/8.0" },
    });
    if (!response.ok) return null;
    const data = await response.json();
    const current = data?.current_condition?.[0];
    const temp = Number(current?.temp_C);
    if (!Number.isFinite(temp)) return null;
    const description = String(current?.weatherDesc?.[0]?.value || "").toLowerCase();
    let weatherCode = 0;
    if (description.includes("thunder")) weatherCode = 95;
    else if (description.includes("rain") || description.includes("shower")) weatherCode = 61;
    else if (description.includes("drizzle")) weatherCode = 51;
    else if (description.includes("fog") || description.includes("mist")) weatherCode = 45;
    else if (description.includes("cloud") || description.includes("overcast")) weatherCode = description.includes("partly") ? 2 : 3;
    const hour = Number(new Intl.DateTimeFormat("en-US", { timeZone: "America/Mexico_City", hour: "2-digit", hour12: false }).format(new Date()));
    return {
      temperature: Math.round(temp),
      weatherCode,
      isDay: hour >= 6 && hour < 19,
      updatedAt: new Date().toISOString(),
      source: "wttr",
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET() {
  const result = await fromOpenMeteo() ?? await fromWttr();
  if (!result) {
    return NextResponse.json(
      { temperature: null, weatherCode: null, isDay: true, updatedAt: null, source: null },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
  return NextResponse.json(result, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
