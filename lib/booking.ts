import { BOOKING } from "@/config/investor";

export function bookingWindow(now = Date.now()) {
  const start = now + BOOKING.minHoursAhead * 3600_000;
  const end = now + BOOKING.maxDaysAhead * 86400_000;
  return { start, end };
}

export function inWindow(iso: string, now = Date.now()): boolean {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return false;
  const { start, end } = bookingWindow(now);
  return t >= start && t <= end;
}

/** Offset in minutes of a timezone at a given instant, e.g. -300 for New York in winter. */
function tzOffsetMinutes(tz: string, at: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(at);
  const g = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(g("year"), g("month") - 1, g("day"), g("hour"), g("minute"), g("second"));
  return Math.round((asUtc - at.getTime()) / 60000);
}

/**
 * Preview-only sample availability: weekdays, 10 am to 4 pm Eastern, on the hour,
 * clipped to the booking window. Used until the GHL calendar exists.
 */
export function sampleSlots(now = Date.now()): Record<string, string[]> {
  const tz = BOOKING.timezoneDefault;
  const { start, end } = bookingWindow(now);
  const out: Record<string, string[]> = {};
  for (let d = 0; d <= BOOKING.maxDaysAhead + 1; d++) {
    const day = new Date(now + d * 86400_000);
    const ymd = new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(day); // YYYY-MM-DD
    const [y, m, dd] = ymd.split("-").map(Number);
    const weekday = new Date(Date.UTC(y, m - 1, dd)).getUTCDay();
    if (weekday === 0 || weekday === 6) continue;
    for (const hour of [10, 11, 13, 14, 15, 16]) {
      const guess = new Date(Date.UTC(y, m - 1, dd, hour, 0, 0));
      const off = tzOffsetMinutes(tz, guess);
      const t = guess.getTime() - off * 60000;
      if (t < start || t > end) continue;
      (out[ymd] ||= []).push(new Date(t).toISOString());
    }
  }
  return out;
}
