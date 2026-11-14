"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import s from "./slots.module.css";
import f from "./forms.module.css";
import { Button, Placeholder } from "./ui";

type SlotsResponse = { ok: boolean; mode: "live" | "sample"; slots: string[]; durationMinutes: number; message?: string };

export default function SlotPicker() {
  const router = useRouter();
  const [tz, setTz] = useState("America/New_York");
  const [data, setData] = useState<SlotsResponse | null>(null);
  const [loadError, setLoadError] = useState("");
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";
    setTz(zone);
    fetch(`/api/slots?tz=${encodeURIComponent(zone)}`)
      .then((r) => r.json())
      .then((d: SlotsResponse) => (d.ok ? setData(d) : setLoadError(d.message || "We could not load times.")))
      .catch(() => setLoadError("We could not load times. Please refresh the page."));
  }, []);

  const byDay = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const iso of data?.slots ?? []) {
      const key = new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(new Date(iso));
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(iso);
    }
    return map;
  }, [data, tz]);

  useEffect(() => {
    if (!day && byDay.size) setDay(byDay.keys().next().value ?? null);
  }, [byDay, day]);

  const dayLabel = (key: string) => {
    const [y, m, d] = key.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d, 12));
    return {
      weekday: new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "UTC" }).format(date),
      date: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(date),
      full: new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" }).format(date),
    };
  };
  const timeLabel = (iso: string) =>
    new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: tz }).format(new Date(iso));
  const zoneLabel = tz.replace(/_/g, " ").split("/").pop();

  async function book() {
    if (!slot) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start: slot, timezone: tz }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d.ok) {
        setError(d.message || "That time could not be booked. Please choose another.");
        return;
      }
      router.push(d.next || "/nda");
    } catch {
      setError("We could not reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (loadError) return <div className={f.formError} role="alert">{loadError}</div>;
  if (!data) return <p className={s.loading}>Loading available times...</p>;

  return (
    <div className={s.wrap}>
      {data.mode === "sample" ? (
        <Placeholder
          title="Sample times"
          note="These are sample times for the preview. Michael's real calendar connects here once it is set up."
        />
      ) : null}

      {byDay.size === 0 ? (
        <p>There are no open times in the next week. We will be in touch to arrange one.</p>
      ) : (
        <>
          <div>
            <h2 className={s.h}>1. Choose a day</h2>
            <div className={s.days} role="group" aria-label="Available days">
              {Array.from(byDay.keys()).map((k) => {
                const l = dayLabel(k);
                return (
                  <button
                    key={k}
                    type="button"
                    className={`${s.day} ${day === k ? s.on : ""}`}
                    aria-pressed={day === k}
                    aria-label={l.full}
                    onClick={() => {
                      setDay(k);
                      setSlot(null);
                    }}
                  >
                    <span className={s.wd}>{l.weekday}</span>
                    <span className={s.dt}>{l.date}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {day ? (
            <div>
              <h2 className={s.h}>2. Choose a time</h2>
              <p className={s.zone}>Times are shown in your time zone ({zoneLabel}).</p>
              <div className={s.times} role="group" aria-label={`Times on ${dayLabel(day).full}`}>
                {(byDay.get(day) ?? []).map((iso) => (
                  <button
                    key={iso}
                    type="button"
                    className={`${s.time} ${slot === iso ? s.on : ""}`}
                    aria-pressed={slot === iso}
                    onClick={() => setSlot(iso)}
                  >
                    {timeLabel(iso)}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {error ? <div className={f.formError} role="alert">{error}</div> : null}

          <div className={s.confirm}>
            {slot ? (
              <p className={s.summary}>
                <strong>{dayLabel(day!).full}</strong> at <strong>{timeLabel(slot)}</strong>, about{" "}
                {data.durationMinutes} minutes
              </p>
            ) : (
              <p className={s.summary}>Choose a day and a time to continue.</p>
            )}
            <Button type="button" variant="ink" onClick={book} disabled={!slot || busy}>
              {busy ? "Booking..." : "Confirm this time"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
