"use client";

import { useEffect, useMemo, useState } from "react";

type WeatherState = {
  temperature: number | null;
  weatherCode: number | null;
  isDay: boolean;
  updatedAt?: string | null;
};

const INITIAL_WEATHER: WeatherState = {
  temperature: null,
  weatherCode: null,
  isDay: true,
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

function SiriVectorWave() {
  const paths = [
    "M0 50 C16 50 23 43 34 43 C48 43 52 64 66 64 C82 64 91 18 108 18 C126 18 132 76 150 76 C168 76 174 31 190 31 C205 31 211 50 228 50",
    "M0 50 C18 50 26 58 40 58 C56 58 63 27 78 27 C94 27 101 68 118 68 C135 68 142 36 158 36 C175 36 183 56 198 56 C211 56 218 50 228 50",
    "M0 50 C20 50 27 38 43 38 C59 38 66 58 81 58 C98 58 104 41 120 41 C136 41 144 61 160 61 C177 61 185 43 201 43 C214 43 220 50 228 50",
    "M0 50 C16 50 24 53 38 53 C53 53 61 33 76 33 C91 33 99 57 114 57 C130 57 138 40 154 40 C170 40 180 53 194 53 C209 53 217 50 228 50",
  ];

  return (
    <svg className="siri-vector-wave" viewBox="0 0 228 100" role="img" aria-label="Onda informativa vectorial animada">
      <defs>
        <linearGradient id="siriGradientMain" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#35d8ff"/>
          <stop offset=".22" stopColor="#4f7cff"/>
          <stop offset=".46" stopColor="#8b5cf6"/>
          <stop offset=".72" stopColor="#ec4899"/>
          <stop offset="1" stopColor="#ffd15a"/>
        </linearGradient>
        <filter id="siriGlowSoft" x="-30%" y="-80%" width="160%" height="260%">
          <feGaussianBlur stdDeviation="5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="siriGlowStrong" x="-30%" y="-80%" width="160%" height="260%">
          <feGaussianBlur stdDeviation="9" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <g className="siri-wave-halo" filter="url(#siriGlowStrong)">
        {paths.map((path, index) => <path key={`halo-${index}`} d={path}/>) }
      </g>
      <g className="siri-wave-lines" filter="url(#siriGlowSoft)">
        {paths.map((path, index) => <path key={`line-${index}`} d={path} className={`siri-wave-line siri-wave-line-${index + 1}`}/>) }
      </g>
      <ellipse cx="114" cy="50" rx="105" ry="35" className="siri-wave-light"/>
    </svg>
  );
}

function loadCachedWeather(): WeatherState {
  if (typeof window === "undefined") return INITIAL_WEATHER;
  try {
    const raw = window.localStorage.getItem("rhevolver-weather-iguala-v2");
    if (!raw) return INITIAL_WEATHER;
    const parsed = JSON.parse(raw) as WeatherState & { savedAt?: number };
    if (!parsed.savedAt || Date.now() - parsed.savedAt > 2 * 60 * 60 * 1000) return INITIAL_WEATHER;
    return parsed;
  } catch {
    return INITIAL_WEATHER;
  }
}

export default function IgualaLiveStrip() {
  const [now, setNow] = useState(() => new Date());
  const [weather, setWeather] = useState<WeatherState>(INITIAL_WEATHER);

  useEffect(() => {
    setWeather(loadCachedWeather());
    const clock = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(clock);
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

  return (
    <div className="live-vision-panel mx-auto grid max-w-[1440px] grid-cols-[auto_minmax(0,1fr)] items-center gap-4 px-4 py-4 sm:gap-6 sm:px-6 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:px-8">
      <div className="siri-vector-stage" aria-label="Señal informativa en vivo">
        <SiriVectorWave />
      </div>

      <div className="min-w-0">
        <p className="live-vision-headline text-sm font-extrabold leading-snug text-white sm:text-lg">Información local, estatal, nacional e internacional.</p>
        <p className="live-vision-date mt-1 capitalize text-[0.7rem] font-bold tracking-wide sm:text-xs">{dateLabel}</p>
      </div>

      <div className="live-weather-pill col-span-2 flex min-w-0 items-center gap-3 lg:col-span-1">
        <span className="live-weather-icon" aria-hidden="true"><WeatherIcon code={weather.weatherCode} isDay={weather.isDay}/></span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <strong className="live-weather-temp whitespace-nowrap text-sm text-white sm:text-base">{weather.temperature !== null ? `${weather.temperature}°C` : "--°C"}</strong>
            <span className="live-weather-place text-[0.62rem] font-black uppercase tracking-[0.16em]">Iguala</span>
          </div>
          <p className="live-weather-condition truncate text-xs font-semibold sm:text-sm">{weatherLabel(weather.weatherCode)}</p>
        </div>
        <time className="live-weather-time whitespace-nowrap text-sm font-black tabular-nums text-white sm:text-base" dateTime={now.toISOString()}>{timeLabel} hrs</time>
      </div>
    </div>
  );
}
