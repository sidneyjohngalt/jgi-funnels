import "server-only";
import { GHL_LOCATION_ID } from "@/config/investor";

/**
 * GoHighLevel API v2 client. Server-side only.
 *
 * Safety gate: nothing is sent to GHL unless BOTH are set in Vercel env vars:
 *   GHL_PRIVATE_TOKEN  (Private Integration token, added by Sidney)
 *   GHL_LIVE=true      (set only with Sidney's explicit OK)
 * Otherwise every call runs in dry-run mode: the payload is logged and a fake ID is returned,
 * so the full funnel can be clicked through on a preview without touching real contacts.
 */

const BASE = "https://services.leadconnectorhq.com";
const VERSION = "2021-07-28";

export function ghlIsLive(): boolean {
  return process.env.GHL_LIVE === "true" && !!process.env.GHL_PRIVATE_TOKEN;
}

function locationId(): string {
  return process.env.GHL_LOCATION_ID || GHL_LOCATION_ID;
}

type Json = Record<string, unknown>;

async function call<T = Json>(method: string, path: string, body?: Json, dryRunResult?: T): Promise<T> {
  if (!ghlIsLive()) {
    console.log(`[ghl:dry-run] ${method} ${path}`, body ? JSON.stringify(body) : "");
    return (dryRunResult ?? ({} as T)) as T;
  }
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.GHL_PRIVATE_TOKEN}`,
      Version: VERSION,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const text = await res.text();
  if (!res.ok) {
    console.error(`[ghl] ${method} ${path} -> ${res.status}`, text.slice(0, 500));
    throw new Error(`GHL ${res.status}`);
  }
  return (text ? JSON.parse(text) : {}) as T;
}

const fakeId = (prefix: string) => `dry_${prefix}_${Math.random().toString(36).slice(2, 10)}`;

export type CustomFieldValue = { key: string; field_value: string };

/* ----------------------------- Contacts ----------------------------- */

export async function upsertContact(input: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  tags?: string[];
  source?: string;
  customFields?: CustomFieldValue[];
}): Promise<{ contactId: string }> {
  const body: Json = {
    locationId: locationId(),
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phone: input.phone,
    source: input.source ?? "JGI Funnels: stakeholder application",
  };
  if (input.tags?.length) body.tags = input.tags;
  const cf = (input.customFields ?? []).filter((f) => f.key);
  if (cf.length) body.customFields = cf;
  const r = await call<{ contact?: { id: string } }>("POST", "/contacts/upsert", body, {
    contact: { id: fakeId("contact") },
  });
  if (!r.contact?.id) throw new Error("GHL upsert returned no contact id");
  return { contactId: r.contact.id };
}

export async function updateContact(contactId: string, input: { customFields?: CustomFieldValue[]; [k: string]: unknown }) {
  const { customFields, ...rest } = input;
  const body: Json = { ...rest };
  const cf = (customFields ?? []).filter((f) => f.key);
  if (cf.length) body.customFields = cf;
  if (!Object.keys(body).length) return;
  await call("PUT", `/contacts/${contactId}`, body);
}

export async function addTags(contactId: string, tags: string[]) {
  if (!tags.length) return;
  await call("POST", `/contacts/${contactId}/tags`, { tags });
}

export async function addNote(contactId: string, body: string) {
  await call("POST", `/contacts/${contactId}/notes`, { body });
}

/* --------------------------- Opportunities -------------------------- */

export async function upsertOpportunity(input: {
  contactId: string;
  pipelineId: string;
  stageId: string;
  name: string;
}): Promise<{ opportunityId: string }> {
  const r = await call<{ opportunity?: { id: string } }>(
    "POST",
    "/opportunities/upsert",
    {
      locationId: locationId(),
      contactId: input.contactId,
      pipelineId: input.pipelineId,
      pipelineStageId: input.stageId,
      name: input.name,
      status: "open",
    },
    { opportunity: { id: fakeId("opp") } },
  );
  if (!r.opportunity?.id) throw new Error("GHL opportunity upsert returned no id");
  return { opportunityId: r.opportunity.id };
}

export async function moveOpportunity(opportunityId: string, stageId: string) {
  await call("PUT", `/opportunities/${opportunityId}`, { pipelineStageId: stageId, status: "open" });
}

/* ----------------------------- Calendar ----------------------------- */

export function calendarId(): string | null {
  return process.env.GHL_CALENDAR_ID || null;
}

/** Returns ISO start times, grouped by date (YYYY-MM-DD in the given timezone). */
export async function freeSlots(input: { startMs: number; endMs: number; timezone: string }): Promise<Record<string, string[]>> {
  const cal = calendarId();
  if (!cal || !ghlIsLive()) return {};
  const q = new URLSearchParams({
    startDate: String(input.startMs),
    endDate: String(input.endMs),
    timezone: input.timezone,
  });
  const r = await call<Record<string, { slots?: string[] } | unknown>>("GET", `/calendars/${cal}/free-slots?${q}`);
  const out: Record<string, string[]> = {};
  for (const [k, v] of Object.entries(r)) {
    if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(k) && v && typeof v === "object" && Array.isArray((v as { slots?: unknown }).slots)) {
      out[k] = (v as { slots: string[] }).slots;
    }
  }
  return out;
}

export async function createAppointment(input: {
  contactId: string;
  startTime: string;
  endTime: string;
  title: string;
}): Promise<{ appointmentId: string }> {
  const cal = calendarId();
  const r = await call<{ id?: string }>(
    "POST",
    "/calendars/events/appointments",
    {
      calendarId: cal,
      locationId: locationId(),
      contactId: input.contactId,
      startTime: input.startTime,
      endTime: input.endTime,
      title: input.title,
      appointmentStatus: "confirmed",
      ignoreFreeSlotValidation: false,
    },
    { id: fakeId("appt") },
  );
  return { appointmentId: r.id ?? fakeId("appt") };
}
