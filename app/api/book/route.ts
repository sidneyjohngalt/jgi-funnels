import { NextResponse } from "next/server";
import { BOOKING, FIELDS } from "@/config/investor";
import { inWindow } from "@/lib/booking";
import { calendarId, ghl } from "@/lib/ghl";
import { clean } from "@/lib/request";
import { confirmationLink, getSession, setSession } from "@/lib/session";

/**
 * Event 4: book the first call. The code creates the GHL appointment and writes the person's signed
 * confirmation page link. CRM's Call booked workflow (triggered by the appointment) adds call:booked,
 * moves the card to Call Booked and sends the emails.
 */
export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ ok: false, message: "Please start the application again." }, { status: 401 });
  if (s.step === "started" || s.step === "applied" || s.step === "not-qualified") {
    return NextResponse.json({ ok: false, message: "Please finish the application first." }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const start = clean(body.start, 40);
  const timezone = clean(body.timezone, 60) || BOOKING.timezoneDefault;
  if (!inWindow(start)) {
    return NextResponse.json(
      { ok: false, message: `Please choose a time at least ${BOOKING.minHoursAhead} hours and no more than ${BOOKING.maxDaysAhead} days away.` },
      { status: 400 },
    );
  }
  const g = ghl("book");
  if (g.live && !calendarId()) {
    return NextResponse.json({ ok: false, message: "Booking is not open yet. We will be in touch to arrange a time." }, { status: 503 });
  }
  const end = new Date(Date.parse(start) + BOOKING.durationMinutes * 60000).toISOString();

  try {
    await g.createAppointment({
      contactId: s.contactId,
      startTime: start,
      endTime: end,
      title: `First call with ${BOOKING.hostName}: ${s.firstName}`,
    });
    const next = { ...s, step: s.nda ? ("nda-signed" as const) : ("booked" as const), booking: { start, end, timezone } };
    await g.updateContact(s.contactId, {
      customFields: [{ key: FIELDS.confirmationPageLink, field_value: confirmationLink(next, req) }],
    });
    await setSession(next);
    return NextResponse.json({ ok: true, next: s.nda ? "/confirmed" : "/nda" });
  } catch (e) {
    console.error("book failed", e);
    return NextResponse.json({ ok: false, message: "That time may have just been taken. Please pick another." }, { status: 409 });
  }
}
