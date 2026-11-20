import { NextResponse } from "next/server";
import { ghl } from "@/lib/ghl";
import { clean } from "@/lib/request";
import { getSession } from "@/lib/session";

/**
 * Records what each person opens on the confirmation page so Michael gets a pre-call brief.
 * Event 7 (Later in the contract): each item becomes a short note on the GHL contact, once per visit.
 * Appending to the Signals noted field (one line per action, newest first) comes when CRM switches it on.
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
    await ghl("track").addNote(s.contactId, `Pre-call activity: ${verb}: ${label} (${when})`);
  } catch (e) {
    console.error("track failed", e);
  }
  return new NextResponse(null, { status: 204 });
}
