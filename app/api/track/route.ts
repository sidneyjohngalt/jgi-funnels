import { NextResponse } from "next/server";
import { CUSTOM_FIELDS } from "@/config/investor";
import { addNote, updateContact } from "@/lib/ghl";
import { clean } from "@/lib/request";
import { getSession } from "@/lib/session";

/**
 * Records what each person opens on the confirmation page so Michael gets a pre-call brief.
 * Each event becomes a short note on the GHL contact. The client sends each item once per visit.
 */
export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return new NextResponse(null, { status: 204 });

  const body = await req.json().catch(() => ({}));
  const kind = clean(body.kind, 20); // "section" | "doc" | "video"
  const label = clean(body.label, 160);
  if (!label || !["section", "doc", "video"].includes(kind)) return new NextResponse(null, { status: 204 });

  const verb = kind === "section" ? "Viewed section" : kind === "video" ? "Played video" : "Opened document";
  const when = new Date().toISOString();
  try {
    await addNote(s.contactId, `Pre-call activity: ${verb}: ${label} (${when})`);
    if (CUSTOM_FIELDS.dataRoomActivity) {
      await updateContact(s.contactId, {
        customFields: [{ key: CUSTOM_FIELDS.dataRoomActivity, field_value: `${verb}: ${label} at ${when}` }],
      });
    }
  } catch (e) {
    console.error("track failed", e);
  }
  return new NextResponse(null, { status: 204 });
}
