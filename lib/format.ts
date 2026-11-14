export function formatCallTime(iso: string, tz: string): string {
  const d = new Date(iso);
  const date = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: tz }).format(d);
  const time = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: tz, timeZoneName: "short" }).format(d);
  return `${date} at ${time}`;
}

export function formatCallParts(iso: string, tz: string) {
  const d = new Date(iso);
  return {
    date: new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: tz }).format(d),
    time: new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: tz, timeZoneName: "short" }).format(d),
  };
}
