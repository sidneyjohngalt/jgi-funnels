import { NextResponse } from "next/server";
import { INVESTOR_PIPELINE, TAGS } from "@/config/investor";
import { addNote, upsertContact, upsertOpportunity } from "@/lib/ghl";
import { clean, normalisePhone, validEmail, validPhone } from "@/lib/request";
import { getSession, setSession } from "@/lib/session";

/** Step 1 of the application: name, email, phone. Sent to GHL straight away so abandoned applications can be chased. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const firstName = clean(body.firstName, 80);
  const lastName = clean(body.lastName, 80);
  const email = clean(body.email, 200).toLowerCase();
  const phone = clean(body.phone, 40);

  const errors: Record<string, string> = {};
  if (!firstName) errors.firstName = "Please enter your first name.";
  if (!lastName) errors.lastName = "Please enter your last name.";
  if (!validEmail(email)) errors.email = "Please enter a valid email address.";
  if (!validPhone(phone)) errors.phone = "Please enter a phone number we can reach you on.";
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 400 });

  const attribution = (body.attribution && typeof body.attribution === "object" ? body.attribution : {}) as Record<string, unknown>;
  const attrLine = Object.entries(attribution)
    .filter(([, v]) => typeof v === "string" && v)
    .map(([k, v]) => `${k}=${clean(v, 120)}`)
    .join(", ");

  try {
    const existing = await getSession();
    const { contactId } = await upsertContact({
      firstName,
      lastName,
      email,
      phone: normalisePhone(phone),
      tags: [TAGS.applicationStarted],
    });
    const { opportunityId } = await upsertOpportunity({
      contactId,
      pipelineId: INVESTOR_PIPELINE.id,
      stageId: INVESTOR_PIPELINE.stages.applicationStarted,
      name: `${firstName} ${lastName} (investor application)`,
    });
    if (attrLine) await addNote(contactId, `Investor application started. Source: ${attrLine}`);

    await setSession({
      v: 1,
      contactId,
      opportunityId,
      firstName,
      email,
      // Never move someone backwards if they restart the form.
      step: existing && existing.contactId === contactId && existing.step !== "started" ? existing.step : "started",
      booking: existing?.contactId === contactId ? existing.booking : undefined,
      nda: existing?.contactId === contactId ? existing.nda : undefined,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("apply/start failed", e);
    return NextResponse.json(
      { ok: false, message: "Something went wrong saving your details. Please try again in a moment." },
      { status: 502 },
    );
  }
}
