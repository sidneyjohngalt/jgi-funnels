"use client";

/** Sends one tracking event per item per page visit. Silent on failure. */
const sent = new Set<string>();

export function track(kind: "section" | "doc" | "video", label: string) {
  const key = `${kind}:${label}`;
  if (sent.has(key)) return;
  sent.add(key);
  const body = JSON.stringify({ kind, label });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/track", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true });
    }
  } catch {
    /* ignore */
  }
}
