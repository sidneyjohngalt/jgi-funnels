import { NextResponse } from "next/server";
import {
  CUSTOM_FIELDS,
  DECISION_TIMING,
  INVESTOR_PIPELINE,
  INVESTOR_TYPES,
  PARTICIPATION_INTEREST,
  TAGS,
  isQualified,
  type ApplicationAnswers,
} from "@/config/investor";
import { addNote, addTags, moveOpportunity, updateContact } from "@/lib/ghl";
import { clean } from "@/lib/request";
import { getSession, setSession } from "@/lib/session";

const labelOf = (list: { value: string; label: string }[], v?: string) => list.find((c) => c.value === v)?.label ?? v ?? "";

/** Steps 2 and later. Each step updates the contact; `final: true` runs qualification. */
export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ ok: false, message: "Please start the application again." }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const a: Partial<ApplicationAnswers> = {
    investorType: clean(body.investorType, 40),
    organization: clean(body.organization, 160),
    state: clean(body.state, 80),
    participationInterest: clean(body.participationInterest, 40),
    decisionTiming: clean(body.decisionTiming, 40),
    heardFrom: clean(body.heardFrom, 200),
    questions: clean(body.questions, 2000),
  };
  const final = body.final === true;

  try {
    await updateContact(s.contactId, {
      companyName: a.organization || undefined,
      state: a.state || undefined,
      customFields: [
        { key: CUSTOM_FIELDS.investorType, field_value: labelOf(INVESTOR_TYPES, a.investorType) },
        { key: CUSTOM_FIELDS.participationInterest, field_value: labelOf(PARTICIPATION_INTEREST, a.participationInterest) },
        { key: CUSTOM_FIELDS.decisionTiming, field_value: labelOf(DECISION_TIMING, a.decisionTiming) },
      ].filter((f) => f.field_value),
    });

    if (!final) return NextResponse.json({ ok: true });

    const lines = [
      "Investor application completed.",
      `Describes themselves as: ${labelOf(INVESTOR_TYPES, a.investorType) || "not given"}`,
      `Organization: ${a.organization || "not given"}`,
      `State or country: ${a.state || "not given"}`,
      `Interested in: ${labelOf(PARTICIPATION_INTEREST, a.participationInterest) || "not given"}`,
      `Timing: ${labelOf(DECISION_TIMING, a.decisionTiming) || "not given"}`,
      `Heard about us from: ${a.heardFrom || "not given"}`,
      `Questions for the call: ${a.questions || "none"}`,
    ];
    await addNote(s.contactId, lines.join("\n"));

    const qualified = isQualified({ firstName: s.firstName, lastName: "", email: s.email, phone: "", ...a });
    if (qualified) {
      await addTags(s.contactId, [TAGS.applicationComplete, TAGS.qualified]);
      if (s.opportunityId) await moveOpportunity(s.opportunityId, INVESTOR_PIPELINE.stages.qualifiedNotBooked);
    } else {
      await addTags(s.contactId, [TAGS.applicationComplete, TAGS.notQualified]);
    }

    const alreadyFurther = ["booked", "nda-signed", "nda-skipped"].includes(s.step);
    await setSession({ ...s, step: alreadyFurther ? s.step : qualified ? "qualified" : "not-qualified" });
    return NextResponse.json({ ok: true, next: qualified ? (alreadyFurther ? "/confirmed" : "/book") : "/apply/thank-you" });
  } catch (e) {
    console.error("apply/update failed", e);
    return NextResponse.json({ ok: false, message: "Something went wrong saving your answers. Please try again." }, { status: 502 });
  }
}
