"use client";
import { useEffect, useState } from "react";
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0);
    };
    update(); window.addEventListener("scroll", update, { passive: true }); window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
  return <div className="fixed inset-x-0 top-0 z-[100] h-1 bg-transparent"><div className="h-full bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500" style={{ width: `${progress}%` }} /></div>;
}
