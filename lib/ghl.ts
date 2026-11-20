import "server-only";
import { GHL_LOCATION_ID, TAGS } from "@/config/investor";

/**
 * GoHighLevel API v2 client. Server-side only.
 *
 * Every call belongs to one funnel event (see GhlEvent). An event talks to GHL only when ALL are true:
 *   GHL_API_TOKEN      is set (Private Integration token, added by Sidney in Vercel)
 *   GHL_LIVE_EVENTS    lists the event (comma separated, e.g. "apply-start" or "2"; empty = everything dry-run)
 *   the contact is real (a contact created in dry-run is never sent to GHL by a later live event)
 * Otherwise the call runs in dry-run: the payload is logged and a fake ID is returned.
 *
 * GHL_TEST_MODE=true adds the tag "test" to every contact a live event touches.
 * GHL_LOCATION_ID overrides the location in config. Sidney alone sets these variables.
 */

export type GhlEvent = "apply-start" | "apply-complete" | "book" | "nda-sign" | "nda-skip" | "track";

/** Contract event numbers, so either form works in GHL_LIVE_EVENTS. */
const EVENT_NUMBERS: Record<GhlEvent, string> = {
  "apply-start": "2",
  "apply-complete": "3",
  book: "4",
  "nda-sign": "5",
  "nda-skip": "6",
  track: "7",
};

const BASE = "https://services.leadconnectorhq.com";
const VERSION = "2021-07-28";

export function liveEvents(): Set<string> {
  return new Set(
    (process.env.GHL_LIVE_EVENTS || "")
      .split(/[,\s]+/)
      .map((x) => x.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function eventIsLive(event: GhlEvent): boolean {
  if (!process.env.GHL_API_TOKEN) return false;
  const set = liveEvents();
  return set.has(event) || set.has(EVENT_NUMBERS[event]);
}

/** True when any event is live (used to insist on a real session secret). */
export function anyEventLive(): boolean {
  return !!process.env.GHL_API_TOKEN && liveEvents().size > 0;
}

export function testMode(): boolean {
  return process.env.GHL_TEST_MODE === "true";
}

function locationId(): string {
  return process.env.GHL_LOCATION_ID || GHL_LOCATION_ID;
}

const isDryId = (id?: string) => !id || id.startsWith("dry_");
const fakeId = (prefix: string) => `dry_${prefix}_${Math.random().toString(36).slice(2, 10)}`;

type Json = Record<string, unknown>;
export type CustomFieldValue = { key: string; field_value: string | string[] };

/** Today in GHL date format (YYYY-MM-DD, UTC). */
export const today = () => new Date().toISOString().slice(0, 10);

export function ghl(event: GhlEvent) {
  const live = eventIsLive(event);
  const tagged = new Set<string>();

  async function call<T = Json>(method: string, path: string, body: Json | undefined, dryRunResult: T, contactId?: string): Promise<T> {
    const send = live && (contactId === undefined || !isDryId(contactId));
    if (!send) {
      console.log(`[ghl:dry-run:${event}] ${method} ${path}`, body ? JSON.stringify(body) : "");
      return dryRunResult;
    }
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${process.env.GHL_API_TOKEN}`,
        Version: VERSION,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
    const text = await res.text();
    if (!res.ok) {
      console.error(`[ghl:${event}] ${method} ${path} -> ${res.status}`, text.slice(0, 500));
      throw new Error(`GHL ${res.status}`);
    }
    console.log(`[ghl:live:${event}] ${method} ${path} -> ${res.status}`);
    return (text ? JSON.parse(text) : {}) as T;
  }

  const withTest = (tags: string[]) => (testMode() && !tags.includes(TAGS.test) ? [...tags, TAGS.test] : tags);

  /** In test mode, make sure every contact this event touches carries the tag "test". */
  async function ensureTestTag(contactId: string) {
    if (!testMode() || tagged.has(contactId)) return;
    tagged.add(contactId);
    await call("POST", `/contacts/${contactId}/tags`, { tags: [TAGS.test] }, {}, contactId);
  }

  const cleanFields = (cf?: CustomFieldValue[]) =>
    (cf ?? []).filter((f) => f.key && (Array.isArray(f.field_value) ? f.field_value.length : f.field_value));

  return {
    event,
    live,

    async upsertContact(input: {
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
      const tags = withTest(input.tags ?? []);
      if (tags.length) body.tags = tags;
      const cf = cleanFields(input.customFields);
      if (cf.length) body.customFields = cf;
      const r = await call<{ contact?: { id: string } }>("POST", "/contacts/upsert", body, { contact: { id: fakeId("contact") } });
      if (!r.contact?.id) throw new Error("GHL upsert returned no contact id");
      tagged.add(r.contact.id);
      return { contactId: r.contact.id };
    },

    async updateContact(contactId: string, input: { customFields?: CustomFieldValue[]; [k: string]: unknown }) {
      const { customFields, ...rest } = input;
      const body: Json = {};
      for (const [k, v] of Object.entries(rest)) if (v !== undefined && v !== "") body[k] = v;
      const cf = cleanFields(customFields);
      if (cf.length) body.customFields = cf;
      if (!Object.keys(body).length) return;
      await ensureTestTag(contactId);
      await call("PUT", `/contacts/${contactId}`, body, {}, contactId);
    },

    async addTags(contactId: string, tags: string[]) {
      const t = withTest(tags);
      if (!t.length) return;
      tagged.add(contactId);
      await call("POST", `/contacts/${contactId}/tags`, { tags: t }, {}, contactId);
    },

    async removeTags(contactId: string, tags: string[]) {
      if (!tags.length) return;
      await call("DELETE", `/contacts/${contactId}/tags`, { tags }, {}, contactId);
    },

    async addNote(contactId: string, body: string) {
      await ensureTestTag(contactId);
      await call("POST", `/contacts/${contactId}/notes`, { body }, {}, contactId);
    },

    /** One Investor Raise card per person: GHL matches the contact's existing card in the pipeline. */
    async upsertOpportunity(input: { contactId: string; pipelineId: string; stageId: string; name: string }): Promise<{ opportunityId: string }> {
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
        input.contactId,
      );
      if (!r.opportunity?.id) throw new Error("GHL opportunity upsert returned no id");
      return { opportunityId: r.opportunity.id };
    },

    async moveOpportunity(opportunityId: string, stageId: string) {
      await call("PUT", `/opportunities/${opportunityId}`, { pipelineStageId: stageId, status: "open" }, {}, opportunityId);
    },

    async loseOpportunity(opportunityId: string, lostReasonId?: string) {
      const body: Json = { status: "lost" };
      if (lostReasonId) body.lostReasonId = lostReasonId;
      await call("PUT", `/opportunities/${opportunityId}`, body, {}, opportunityId);
    },

    /** Returns ISO start times, grouped by date (YYYY-MM-DD in the given timezone). */
    async freeSlots(input: { startMs: number; endMs: number; timezone: string }): Promise<Record<string, string[]>> {
      const cal = calendarId();
      if (!cal || !live) return {};
      const q = new URLSearchParams({ startDate: String(input.startMs), endDate: String(input.endMs), timezone: input.timezone });
      const r = await call<Record<string, unknown>>("GET", `/calendars/${cal}/free-slots?${q}`, undefined, {});
      const out: Record<string, string[]> = {};
      for (const [k, v] of Object.entries(r)) {
        if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(k) && v && typeof v === "object" && Array.isArray((v as { slots?: unknown }).slots)) {
          out[k] = (v as { slots: string[] }).slots;
        }
      }
      return out;
    },

    /** Creates the appointment only. CRM's Call booked workflow adds call:booked and moves the stage. */
    async createAppointment(input: { contactId: string; startTime: string; endTime: string; title: string }): Promise<{ appointmentId: string }> {
      await ensureTestTag(input.contactId);
      const r = await call<{ id?: string }>(
        "POST",
        "/calendars/events/appointments",
        {
          calendarId: calendarId(),
          locationId: locationId(),
          contactId: input.contactId,
          startTime: input.startTime,
          endTime: input.endTime,
          title: input.title,
          appointmentStatus: "confirmed",
          ignoreFreeSlotValidation: false,
        },
        { id: fakeId("appt") },
        input.contactId,
      );
      return { appointmentId: r.id ?? fakeId("appt") };
    },
  };
}

export function calendarId(): string | null {
  return process.env.GHL_CALENDAR_ID || null;
}

/**
 * For the dry-run banner and the preview-only links: once any event writes to GHL,
 * "nothing is sent" is no longer true, so both are hidden.
 */
export function ghlIsLive(): boolean {
  return anyEventLive();
}
