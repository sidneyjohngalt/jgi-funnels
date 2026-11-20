import { NextResponse } from "next/server";
import { FIELDS, INVESTOR_PIPELINE, TAGS } from "@/config/investor";
import { NDA_VERSION } from "@/content/nda";
import { ghl, today } from "@/lib/ghl";
import { clean, clientIp, userAgent } from "@/lib/request";
import { getSession, setSession } from "@/lib/session";

export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ ok: false, message: "Please start the application again." }, { status: 401 });
  if (!s.booking) return NextResponse.json({ ok: false, message: "Please book your call first." }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const action = body.action === "skip" ? "skip" : "sign";

  try {
    if (action === "skip") {
      // Event 6: tag and note only; the card stays at Call Booked.
      const g = ghl("nda-skip");
      await g.addTags(s.contactId, [TAGS.ndaSkipped]);
      await g.addNote(s.contactId, `Chose to continue without the NDA on ${new Date().toISOString()}. No data room access.`);
      await setSession({ ...s, step: s.nda ? "nda-signed" : "nda-skipped" });
      return NextResponse.json({ ok: true, next: "/confirmed" });
    }

    const name = clean(body.name, 160);
    if (body.agreed !== true || name.split(" ").filter(Boolean).length < 2) {
      return NextResponse.json(
        { ok: false, message: "Please tick the box and type your full first and last name to sign." },
        { status: 400 },
      );
    }
    const signedAt = new Date().toISOString();
    const lateSigner = s.step === "nda-skipped";
    const where = body.source === "confirmed" ? "the confirmation page (after skipping)" : "the NDA step";
    const ip = await clientIp();
    const ua = await userAgent();

    // Event 5: NDA signed.
    const g = ghl("nda-sign");
    await g.addNote(
      s.contactId,
      [
        `NDA signed (click to sign) on ${where}.`,
        `Typed name: ${name}`,
        `Signed at (UTC): ${signedAt}`,
        `IP address: ${ip}`,
        `Browser: ${ua.slice(0, 300)}`,
        `NDA version: ${NDA_VERSION}`,
        `Email on file: ${s.email}`,
      ].join(String.fromCharCode(10)),
    );
    await g.updateContact(s.contactId, {
      customFields: [
        { key: FIELDS.confidentialityAgreementSigned, field_value: ["Yes"] },
        { key: FIELDS.dataRoomAccessDate, field_value: today() },
      ],
    });
    // nda:signed starts CRM's Data room access workflow. A late signer loses nda:skipped (the notes keep the history).
    await g.addTags(s.contactId, [TAGS.ndaSigned, TAGS.dataroomAccess]);
    if (lateSigner) await g.removeTags(s.contactId, [TAGS.ndaSkipped]).catch(() => undefined);
    if (s.opportunityId) await g.moveOpportunity(s.opportunityId, INVESTOR_PIPELINE.stages.ndaSigned);

    await setSession({ ...s, step: "nda-signed", nda: { signedAt, name } });
    return NextResponse.json({ ok: true, next: "/confirmed" });
  } catch (e) {
    console.error("nda failed", e);
    return NextResponse.json({ ok: false, message: "Something went wrong. Please try again." }, { status: 502 });
  }
}
