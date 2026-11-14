import { BOOKING } from "@/config/investor";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

const icsDate = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

/** Add-to-calendar file for the booked call. */
export async function GET() {
  const s = await getSession();
  if (!s?.booking) return new Response("No call booked", { status: 404 });
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "";
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//John Galt Institute//Funnels//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${s.contactId}-${icsDate(s.booking.start)}@jgi-funnels`,
    `DTSTAMP:${icsDate(new Date().toISOString())}`,
    `DTSTART:${icsDate(s.booking.start)}`,
    `DTEND:${icsDate(s.booking.end)}`,
    `SUMMARY:First call with ${BOOKING.hostName}`,
    `DESCRIPTION:Your first call with John Galt Institute. Before the call\\, go through your preparation page${origin ? `: ${origin}/confirmed` : "."}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return new Response(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="call-with-michael.ics"',
    },
  });
}
