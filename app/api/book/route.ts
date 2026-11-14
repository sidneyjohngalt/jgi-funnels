import { NextResponse } from "next/server";
import { BOOKING, INVESTOR_PIPELINE, TAGS } from "@/config/investor";
import { inWindow } from "@/lib/booking";
import { addTags, calendarId, createAppointment, ghlIsLive, moveOpportunity } from "@/lib/ghl";
import { clean } from "@/lib/request";
import { getSession, setSession } from "@/lib/session";

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
  if (ghlIsLive() && !calendarId()) {
    return NextResponse.json({ ok: false, message: "Booking is not open yet. We will be in touch to arrange a time." }, { status: 503 });
  }
  const end = new Date(Date.parse(start) + BOOKING.durationMinutes * 60000).toISOString();

  try {
    await createAppointment({
      contactId: s.contactId,
      startTime: start,
      endTime: end,
      title: `First call with ${BOOKING.hostName}: ${s.firstName}`,
    });
    if (s.opportunityId) await moveOpportunity(s.opportunityId, INVESTOR_PIPELINE.stages.callBooked);
    await addTags(s.contactId, [TAGS.callBooked]);
    await setSession({ ...s, step: s.nda ? "nda-signed" : "booked", booking: { start, end, timezone } });
    return NextResponse.json({ ok: true, next: s.nda ? "/confirmed" : "/nda" });
  } catch (e) {
    console.error("book failed", e);
    return NextResponse.json({ ok: false, message: "That time may have just been taken. Please pick another." }, { status: 409 });
  }
}
