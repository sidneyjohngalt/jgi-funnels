"use client";

import { useEffect, useState } from "react";
import s from "./countdown.module.css";

/** Next Tuesday at 7 pm Eastern, used only as a labelled sample until a real session date is set. */
function sampleDate() {
  const now = new Date();
  const d = new Date(now);
  d.setUTCHours(0, 0, 0, 0);
  const add = (2 - d.getUTCDay() + 7) % 7 || 7;
  d.setUTCDate(d.getUTCDate() + add);
  d.setUTCHours(24, 0, 0, 0); // 7 pm Eastern (EST) is midnight UTC the next day
  return d;
}

const pad = (n: number) => String(Math.max(0, n)).padStart(2, "0");

export default function Countdown({ iso, timeZone = "America/New_York" }: { iso: string | null; timeZone?: string }) {
  const [target] = useState(() => (iso ? new Date(iso) : sampleDate()));
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = now === null ? 0 : Math.max(0, target.getTime() - now);
  const parts = [
    ["Days", Math.floor(diff / 864e5)],
    ["Hours", Math.floor(diff / 36e5) % 24],
    ["Mins", Math.floor(diff / 6e4) % 60],
    ["Secs", Math.floor(diff / 1e3) % 60],
  ] as const;
  const when = target.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone,
    timeZoneName: "short",
  });
  return (
    <div className={s.wrap}>
      <p className={s.when}>
        {now === null ? String.fromCharCode(160) : when}
        {!iso ? <span className={s.sample}>Sample date</span> : null}
      </p>
      <div className={s.grid} role="timer" aria-label={`Starts ${when}`}>
        {parts.map(([label, v]) => (
          <div key={label} className={s.cell}>
            <span className={s.num}>{now === null ? "--" : pad(v)}</span>
            <span className={s.label}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
