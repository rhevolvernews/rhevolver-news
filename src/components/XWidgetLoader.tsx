"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type TwitterWidgets = {
  widgets?: {
    load?: (element?: HTMLElement) => void;
  };
};

declare global {
  interface Window {
    twttr?: TwitterWidgets;
  }
}

const SCRIPT_ID = "twitter-wjs";
const SCRIPT_SRC = "https://platform.twitter.com/widgets.js";

export default function XWidgetLoader() {
  const pathname = usePathname();

  useEffect(() => {
    const renderEmbeds = () => {
      window.twttr?.widgets?.load?.(document.body);
    };

    if (window.twttr?.widgets?.load) {
      window.requestAnimationFrame(renderEmbeds);
      return;
    }

    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = SCRIPT_SRC;
      script.async = true;
      script.charset = "utf-8";
      document.body.appendChild(script);
    }

    script.addEventListener("load", renderEmbeds, { once: true });

    return () => {
      script?.removeEventListener("load", renderEmbeds);
    };
  }, [pathname]);

  return null;
}
