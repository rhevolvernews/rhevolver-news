"use client";

import { useEffect, useMemo, useState } from "react";

type WeatherState = {
  temperature: number | null;
  weatherCode: number | null;
  isDay: boolean;
  updatedAt?: string | null;
};

type DollarState = {
  rate: number | null;
  previousRate: number | null;
  direction: "up" | "down" | "flat" | null;
  change: number | null;
  updatedAt?: string | null;
};

const INITIAL_WEATHER: WeatherState = {
  temperature: null,
  weatherCode: null,
  isDay: true,
  updatedAt: null,
};

const INITIAL_DOLLAR: DollarState = {
  rate: null,
  previousRate: null,
  direction: null,
  change: null,
  updatedAt: null,
};

function weatherLabel(code: number | null) {
  if (code === null) return "Clima de Iguala";
  if (code === 0) return "Despejado";
  if ([1, 2].includes(code)) return "Parcialmente nublado";
  if (code === 3) return "Nublado";
  if ([45, 48].includes(code)) return "Neblina";
  if ([51, 53, 55, 56, 57].includes(code)) return "Llovizna";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Lluvia";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Nieve";
  if ([95, 96, 99].includes(code)) return "Tormenta";
  return "Condición variable";
}

function WeatherIcon({ code, isDay }: { code: number | null; isDay: boolean }) {
  const rainy = code !== null && [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(code);
  const cloudy = code !== null && [1, 2, 3, 45, 48].includes(code);

  if (rainy) {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true" className="h-full w-full">
        <defs>
          <linearGradient id="weatherCloudRain" x1="0" x2="1"><stop stopColor="#fff"/><stop offset="1" stopColor="#a7abd2"/></linearGradient>
          <linearGradient id="weatherDrops" x1="0" x2="1"><stop stopColor="#38bdf8"/><stop offset=".55" stopColor="#8b5cf6"/><stop offset="1" stopColor="#ec4899"/></linearGradient>
        </defs>
        <path d="M19 43h27a11 11 0 0 0 1-22 16 16 0 0 0-30-3 12 12 0 0 0 2 25Z" fill="url(#weatherCloudRain)"/>
        <path d="m21 49-3 7M34 49l-3 7M47 49l-3 7" stroke="url(#weatherDrops)" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    );
  }

  if (cloudy) {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true" className="h-full w-full">
        <defs>
          <radialGradient id="weatherSunCloud"><stop stopColor="#fffbd1"/><stop offset=".55" stopColor="#f6c944"/><stop offset="1" stopColor="#ec4899"/></radialGradient>
          <linearGradient id="weatherCloud" x1="0" x2="1"><stop stopColor="#fff"/><stop offset="1" stopColor="#a6a8ca"/></linearGradient>
        </defs>
        <circle cx="21" cy="22" r="12" fill="url(#weatherSunCloud)"/>
        <path d="M18 47h29a11 11 0 0 0 1-22 15 15 0 0 0-28-2 12 12 0 0 0-2 24Z" fill="url(#weatherCloud)"/>
      </svg>
    );
  }

  if (code === null) {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true" className="h-full w-full">
        <defs><linearGradient id="weatherPending" x1="0" x2="1"><stop stopColor="#38bdf8"/><stop offset=".5" stopColor="#a855f7"/><stop offset="1" stopColor="#ec4899"/></linearGradient></defs>
        <circle cx="32" cy="32" r="20" fill="none" stroke="url(#weatherPending)" strokeWidth="5" strokeDasharray="28 12" className="weather-pending-ring"/>
        <circle cx="32" cy="32" r="6" fill="#f6c944" opacity=".9"/>
      </svg>
    );
  }

  return isDay ? (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="h-full w-full">
      <defs><radialGradient id="weatherSun"><stop stopColor="#fffbd1"/><stop offset=".52" stopColor="#f6c944"/><stop offset="1" stopColor="#ec4899"/></radialGradient></defs>
      <g stroke="#f6c944" strokeWidth="3.5" strokeLinecap="round"><path d="M32 4v8M32 52v8M4 32h8M52 32h8M12 12l6 6M46 46l6 6M52 12l-6 6M18 46l-6 6"/></g>
      <circle cx="32" cy="32" r="14" fill="url(#weatherSun)"/>
    </svg>
  ) : (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="h-full w-full">
      <defs><linearGradient id="weatherMoon" x1="0" x2="1"><stop stopColor="#fff"/><stop offset="1" stopColor="#c4b5fd"/></linearGradient></defs>
      <path d="M45 47A22 22 0 0 1 27 9a22 22 0 1 0 18 38Z" fill="url(#weatherMoon)"/>
      <circle cx="47" cy="16" r="2" fill="#f6c944"/><circle cx="53" cy="27" r="1.5" fill="#ec4899"/>
    </svg>
  );
}

function MarketArrow({ direction }: { direction: DollarState["direction"] }) {
  if (direction === "up") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="market-strip-arrow market-strip-arrow--up">
        <path d="M12 5l6 7h-4v7H10v-7H6l6-7Z" fill="currentColor" />
      </svg>
    );
  }

  if (direction === "down") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="market-strip-arrow market-strip-arrow--down">
        <path d="M12 19l-6-7h4V5h4v7h4l-6 7Z" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="market-strip-arrow market-strip-arrow--flat">
      <path d="M6 12h12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function loadCached<T>(key: string, fallback: T, maxAgeMs: number): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as T & { savedAt?: number };
    if (!parsed.savedAt || Date.now() - parsed.savedAt > maxAgeMs) return fallback;
    return parsed;
  } catch {
    return fallback;
  }
}

export default function IgualaLiveStrip() {
  const [now, setNow] = useState(() => new Date());
  const [weather, setWeather] = useState<WeatherState>(INITIAL_WEATHER);
  const [dollar, setDollar] = useState<DollarState>(INITIAL_DOLLAR);

  useEffect(() => {
    const hydrateWeather = window.setTimeout(() => {
      setWeather(loadCached("rhevolver-weather-iguala-v2", INITIAL_WEATHER, 2 * 60 * 60 * 1000));
      setDollar(loadCached("rhevolver-usd-mxn-v1", INITIAL_DOLLAR, 2 * 60 * 60 * 1000));
    }, 0);

    const clock = window.setInterval(() => setNow(new Date()), 1000);

    return () => {
      window.clearTimeout(hydrateWeather);
      window.clearInterval(clock);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const updateWeather = async () => {
      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          const response = await fetch(`/api/weather?attempt=${attempt}&t=${Date.now()}`, { cache: "no-store" });
          if (!response.ok) throw new Error("Weather unavailable");
          const data = await response.json();
          if (cancelled || typeof data?.temperature !== "number") throw new Error("Incomplete weather");
          const next: WeatherState = {
            temperature: Math.round(data.temperature),
            weatherCode: typeof data.weatherCode === "number" ? data.weatherCode : null,
            isDay: data.isDay !== false,
            updatedAt: data.updatedAt ?? null,
          };
          setWeather(next);
          window.localStorage.setItem("rhevolver-weather-iguala-v2", JSON.stringify({ ...next, savedAt: Date.now() }));
          return;
        } catch {
          if (attempt < 2) await new Promise((resolve) => window.setTimeout(resolve, 1100 * (attempt + 1)));
        }
      }
    };

    updateWeather();
    const refresh = window.setInterval(updateWeather, 10 * 60 * 1000);
    return () => { cancelled = true; window.clearInterval(refresh); };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const updateDollar = async () => {
      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          const response = await fetch(`/api/market/usd-mxn?attempt=${attempt}&t=${Date.now()}`, { cache: "no-store" });
          if (!response.ok) throw new Error("Dollar unavailable");
          const data = await response.json();
          if (cancelled || typeof data?.rate !== "number") throw new Error("Incomplete market data");
          const next: DollarState = {
            rate: data.rate,
            previousRate: typeof data.previousRate === "number" ? data.previousRate : null,
            direction: data.direction === "up" || data.direction === "down" || data.direction === "flat" ? data.direction : null,
            change: typeof data.change === "number" ? data.change : null,
            updatedAt: data.updatedAt ?? null,
          };
          setDollar(next);
          window.localStorage.setItem("rhevolver-usd-mxn-v1", JSON.stringify({ ...next, savedAt: Date.now() }));
          return;
        } catch {
          if (attempt < 2) await new Promise((resolve) => window.setTimeout(resolve, 1100 * (attempt + 1)));
        }
      }
    };

    updateDollar();
    const refresh = window.setInterval(updateDollar, 20 * 60 * 1000);
    return () => { cancelled = true; window.clearInterval(refresh); };
  }, []);

  const dateLabel = useMemo(() => new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Mexico_City",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now), [now]);

  const timeLabel = useMemo(() => new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Mexico_City",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now), [now]);

  const marketToneClass = dollar.direction === "up"
    ? "market-strip-change--up"
    : dollar.direction === "down"
      ? "market-strip-change--down"
      : "market-strip-change--flat";

  const marketLabel = dollar.direction === "up"
    ? "Subió"
    : dollar.direction === "down"
      ? "Bajó"
      : "Sin cambio";

  return (
    <div className="live-vision-panel mx-auto grid max-w-[1440px] gap-4 px-4 py-4 sm:px-6 lg:px-8">
      <div className="market-strip-card market-strip-card--compact group min-w-0">
        <div className="market-strip-card__top flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="market-strip-kicker">Mercado hoy</p>
            <p className="market-strip-date capitalize">{dateLabel}</p>
          </div>
          <time className="market-strip-time" dateTime={now.toISOString()}>{timeLabel} hrs</time>
        </div>

        <div className="market-strip-card__bottom mt-3 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="market-strip-pairline"><span className="market-strip-pair">USD / MXN</span><span className="market-strip-reference">Tipo de cambio informativo</span></p>
            <div className="mt-2 flex flex-wrap items-center gap-2.5">
              <strong className="market-strip-rate">{dollar.rate !== null ? dollar.rate.toFixed(4) : "--.--"}</strong>
              <span className={`market-strip-change ${marketToneClass}`}>
                <MarketArrow direction={dollar.direction} />
                <span>{marketLabel}</span>
                {dollar.change !== null ? <strong>{dollar.change > 0 ? "+" : ""}{dollar.change.toFixed(4)}</strong> : null}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="live-weather-pill live-weather-pill--compact flex min-w-0 items-center gap-3">
        <span className="live-weather-icon" aria-hidden="true"><WeatherIcon code={weather.weatherCode} isDay={weather.isDay}/></span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <strong className="live-weather-temp whitespace-nowrap text-sm text-white sm:text-base">{weather.temperature !== null ? `${weather.temperature}°C` : "--°C"}</strong>
            <span className="live-weather-place text-[0.62rem] font-black uppercase tracking-[0.16em]">Iguala</span>
          </div>
          <p className="live-weather-condition truncate text-xs font-semibold sm:text-sm">{weatherLabel(weather.weatherCode)}</p>
        </div>
      </div>
    </div>
  );
}
