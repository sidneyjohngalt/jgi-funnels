import { NextResponse } from "next/server";
import { BOOKING, FIELDS } from "@/config/investor";
import { inWindow } from "@/lib/booking";
import { calendarId, ghl } from "@/lib/ghl";
import { clean } from "@/lib/request";
import { currentCall } from "@/lib/appointment";
import { confirmationLink, getSession, rebookLink, setSession } from "@/lib/session";

/**
 * Event 4: book the first call. The code creates the GHL appointment and writes the person's signed
 * confirmation page link. CRM's Call booked workflow (triggered by the appointment) adds call:booked,
 * moves the card to Call Booked and sends the emails.
 * Rebooking (from /rebook): when GHL still holds an active appointment for this person, it is moved to the
 * new time (CRM's Call rescheduled workflow); after a cancel, a new appointment is created.
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
    const rebooking = !!s.booking;
    const now = rebooking ? await currentCall(s) : ({ status: "none" } as const);
    let appointmentId: string | undefined;
    if (now.status === "booked" && now.appointmentId && !now.appointmentId.startsWith("dry_")) {
      await g.rescheduleAppointment(now.appointmentId, { contactId: s.contactId, startTime: start, endTime: end });
      appointmentId = now.appointmentId;
    } else {
      const r = await g.createAppointment({
        contactId: s.contactId,
        startTime: start,
        endTime: end,
        title: `First call with ${BOOKING.hostName}: ${s.firstName}`,
      });
      appointmentId = r.appointmentId;
    }
    const step = s.nda ? ("nda-signed" as const) : s.step === "nda-skipped" ? ("nda-skipped" as const) : ("booked" as const);
    const next = { ...s, step, booking: { start, end, timezone }, appointmentId };
    await g.updateContact(s.contactId, {
      customFields: [
        { key: FIELDS.confirmationPageLink, field_value: confirmationLink(next, req) },
        { key: FIELDS.rebookLink, field_value: rebookLink(next, req) },
      ],
    });
    await setSession(next);
    return NextResponse.json({ ok: true, next: step === "booked" && !rebooking ? "/nda" : "/confirmed" });
  } catch (e) {
    console.error("book failed", e);
    return NextResponse.json({ ok: false, message: "That time may have just been taken. Please pick another." }, { status: 409 });
  }
}
