import { NextResponse } from "next/server";
import { FIELDS, INVESTOR_PIPELINE, TAGS, sourceFor } from "@/config/investor";
import { ghl, today } from "@/lib/ghl";
import { clean, normalisePhone, validEmail, validPhone } from "@/lib/request";
import { getSession, setSession } from "@/lib/session";

/**
 * Event 2, application step 1: name, email, phone and consent. Sent to GHL straight away so abandoned
 * applications can be chased (CRM's "Applied, not booked" workflow starts on application:started).
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const firstName = clean(body.firstName, 80);
  const lastName = clean(body.lastName, 80);
  const email = clean(body.email, 200).toLowerCase();
  const phone = clean(body.phone, 40);
  const smsConsent = body.smsConsent === true;

  const errors: Record<string, string> = {};
  if (!firstName) errors.firstName = "Please enter your first name.";
  if (!lastName) errors.lastName = "Please enter your last name.";
  if (!validEmail(email)) errors.email = "Please enter a valid email address.";
  if (!validPhone(phone)) errors.phone = "Please enter a phone number we can reach you on.";
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 400 });

  const rawAttr = (body.attribution && typeof body.attribution === "object" ? body.attribution : {}) as Record<string, unknown>;
  const attribution: Record<string, string> = {};
  for (const [k, v] of Object.entries(rawAttr)) if (typeof v === "string" && v) attribution[clean(k, 40)] = clean(v, 120);
  const source = sourceFor(attribution);
  const leadSourceDetail = Object.entries(attribution)
    .map(([k, v]) => `${k}=${v}`)
    .join(", ")
    .slice(0, 500);

  const g = ghl("apply-start");
  try {
    const existing = await getSession();
    const tags: string[] = [TAGS.interestInvestor, TAGS.applicationStarted, source.tag];
    if (smsConsent) tags.push(TAGS.smsConsent);
    const { contactId } = await g.upsertContact({
      firstName,
      lastName,
      email,
      phone: normalisePhone(phone),
      tags,
      customFields: [
        { key: FIELDS.interest, field_value: "Investing" },
        { key: FIELDS.investorSource, field_value: source.investorSource },
        { key: FIELDS.leadSourceDetail, field_value: leadSourceDetail },
        // Submitting step 1 is the email consent (the line under the button says so).
        { key: FIELDS.emailConsentSource, field_value: "Form" },
        { key: FIELDS.emailConsentDate, field_value: today() },
        ...(smsConsent ? [{ key: FIELDS.smsConsent, field_value: ["Yes"] }] : []),
      ],
    });
    const { opportunityId } = await g.upsertOpportunity({
      contactId,
      pipelineId: INVESTOR_PIPELINE.id,
      stageId: INVESTOR_PIPELINE.stages.applicationStarted,
      name: `${firstName} ${lastName} (stakeholder application)`,
    });

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
