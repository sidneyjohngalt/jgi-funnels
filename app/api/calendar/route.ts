import { BOOKING } from "@/config/investor";
import { currentCall } from "@/lib/appointment";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

const icsDate = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/[.][0-9]{3}/, "");

/** Add-to-calendar file for the booked call. */
export async function GET() {
  const s = await getSession();
  if (!s?.booking) return new Response("No call booked", { status: 404 });
  const call = await currentCall(s);
  if (call.status === "cancelled") return new Response("No call booked", { status: 404 });
  const start = call.status === "booked" ? call.start : s.booking.start;
  const end = call.status === "booked" ? call.end : s.booking.end;
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "";
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//John Galt Institute//Funnels//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${s.contactId}-first-call@jgi-funnels`,
    `DTSTAMP:${icsDate(new Date().toISOString())}`,
    `DTSTART:${icsDate(start)}`,
    `DTEND:${icsDate(end)}`,
    `SUMMARY:First call with ${BOOKING.hostName}`,
    `DESCRIPTION:Your first call with John Galt Institute. Before the call go through your preparation page${origin ? `: ${origin}/confirmed` : "."}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return new Response(lines.join(String.fromCharCode(13, 10)), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="call-with-michael.ics"',
    },
  });
}
