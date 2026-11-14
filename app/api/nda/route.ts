import { NextResponse } from "next/server";
import { CUSTOM_FIELDS, INVESTOR_PIPELINE, TAGS } from "@/config/investor";
import { NDA_VERSION } from "@/content/nda";
import { addNote, addTags, moveOpportunity, updateContact } from "@/lib/ghl";
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
      await addTags(s.contactId, [TAGS.ndaSkipped]);
      await addNote(s.contactId, `Chose to continue without the NDA on ${new Date().toISOString()}. No data room access.`);
      await setSession({ ...s, step: s.nda ? "nda-signed" : "nda-skipped" });
      return NextResponse.json({ ok: true, next: "/confirmed" });
    }

    const name = clean(body.name, 160);
    if (body.agreed !== true || name.split(/\s+/).filter(Boolean).length < 2) {
      return NextResponse.json(
        { ok: false, message: "Please tick the box and type your full first and last name to sign." },
        { status: 400 },
      );
    }
    const signedAt = new Date().toISOString();
    const ip = await clientIp();
    const ua = await userAgent();

    await addNote(
      s.contactId,
      [
        "NDA signed (click to sign).",
        `Typed name: ${name}`,
        `Signed at (UTC): ${signedAt}`,
        `IP address: ${ip}`,
        `Browser: ${ua.slice(0, 300)}`,
        `NDA version: ${NDA_VERSION}`,
        `Email on file: ${s.email}`,
      ].join("\n"),
    );
    await updateContact(s.contactId, {
      customFields: [
        { key: CUSTOM_FIELDS.ndaSignedAt, field_value: signedAt },
        { key: CUSTOM_FIELDS.ndaSignedIp, field_value: ip },
        { key: CUSTOM_FIELDS.ndaSignedName, field_value: name },
      ],
    });
    await addTags(s.contactId, [TAGS.ndaSigned]);
    if (s.opportunityId) await moveOpportunity(s.opportunityId, INVESTOR_PIPELINE.stages.ndaSigned);

    await setSession({ ...s, step: "nda-signed", nda: { signedAt, name } });
    return NextResponse.json({ ok: true, next: "/confirmed" });
  } catch (e) {
    console.error("nda failed", e);
    return NextResponse.json({ ok: false, message: "Something went wrong. Please try again." }, { status: 502 });
  }
}
