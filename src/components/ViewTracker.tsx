"use client";

import { useEffect } from "react";

export default function ViewTracker({ articleId }: { articleId: number }) {
  useEffect(() => {
    const key = `rhevolver-view-${articleId}`;
    if (sessionStorage.getItem(key)) return;

    sessionStorage.setItem(key, "1");
    fetch(`/api/views/${articleId}`, { method: "POST", keepalive: true }).catch(
      () => undefined
    );
  }, [articleId]);

  return null;
}
