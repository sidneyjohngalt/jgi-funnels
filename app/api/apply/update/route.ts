import { NextResponse } from "next/server";
import {
  CLASS_INTEREST,
  FIELDS,
  INVESTOR_PIPELINE,
  INVESTOR_SEGMENT,
  INVESTOR_TYPES,
  OPPORTUNITY_LOST_REASON_ID,
  PARTICIPATION_INTEREST,
  TAGS,
  isQualified,
  type ApplicationAnswers,
} from "@/config/investor";
import { ghl } from "@/lib/ghl";
import { clean } from "@/lib/request";
import { getSession, setSession } from "@/lib/session";

const labelOf = (list: { value: string; label: string }[], v?: string) => list.find((c) => c.value === v)?.label ?? v ?? "";

/** Event 3, steps 2 and later. Each step updates the contact; `final: true` runs qualification. */
export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ ok: false, message: "Please start the application again." }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const a: Partial<ApplicationAnswers> = {
    investorType: clean(body.investorType, 40),
    organization: clean(body.organization, 160),
    state: clean(body.state, 80),
    participationInterest: clean(body.participationInterest, 40),
    heardFrom: clean(body.heardFrom, 200),
    questions: clean(body.questions, 2000),
  };
  const final = body.final === true;
  const g = ghl("apply-complete");

  try {
    await g.updateContact(s.contactId, {
      companyName: a.organization || undefined,
      state: a.state || undefined,
      customFields: [
        { key: FIELDS.investorSegment, field_value: INVESTOR_SEGMENT[a.investorType ?? ""] ?? "" },
        { key: FIELDS.classInterest, field_value: CLASS_INTEREST[a.participationInterest ?? ""] ?? "" },
      ],
    });

    if (!final) return NextResponse.json({ ok: true });

    // Michael's brief: the application summary note stays alongside the fields.
    const lines = [
      "Stakeholder application completed.",
      `Describes themselves as: ${labelOf(INVESTOR_TYPES, a.investorType) || "not given"}`,
      `Organization: ${a.organization || "not given"}`,
      `State or country: ${a.state || "not given"}`,
      `Interested in: ${labelOf(PARTICIPATION_INTEREST, a.participationInterest) || "not given"}`,
      `Heard about us from: ${a.heardFrom || "not given"}`,
      `Questions for the call: ${a.questions || "none"}`,
    ];
    await g.addNote(s.contactId, lines.join(String.fromCharCode(10)));

    const qualified = isQualified({ firstName: s.firstName, lastName: "", email: s.email, phone: "", ...a });
    if (qualified) {
      await g.addTags(s.contactId, [TAGS.applicationComplete, TAGS.qualified]);
      if (s.opportunityId) await g.moveOpportunity(s.opportunityId, INVESTOR_PIPELINE.stages.qualifiedNotBooked);
    } else {
      await g.addTags(s.contactId, [TAGS.applicationComplete, TAGS.notQualified]);
      await g.updateContact(s.contactId, { customFields: [{ key: FIELDS.lostReason, field_value: "Not a fit" }] });
      if (s.opportunityId) await g.loseOpportunity(s.opportunityId, OPPORTUNITY_LOST_REASON_ID || undefined);
    }

    const alreadyFurther = ["booked", "nda-signed", "nda-skipped"].includes(s.step);
    await setSession({ ...s, step: alreadyFurther ? s.step : qualified ? "qualified" : "not-qualified" });
    return NextResponse.json({ ok: true, next: qualified ? (alreadyFurther ? "/confirmed" : "/book") : "/apply/thank-you" });
  } catch (e) {
    console.error("apply/update failed", e);
    return NextResponse.json({ ok: false, message: "Something went wrong saving your answers. Please try again." }, { status: 502 });
  }
}
