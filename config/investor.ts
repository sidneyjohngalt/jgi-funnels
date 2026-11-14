/**
 * Investor webinar funnel: all funnel-specific settings live here.
 * IDs below are GHL record IDs, not secrets. Tokens live only in Vercel env vars.
 */

export const GHL_LOCATION_ID = "uleeUS7qi57mRfTFWAsg";

export const INVESTOR_PIPELINE = {
  id: "68TEMA13HOVLIcvvezLw",
  stages: {
    applicationStarted: "0f2437c3-4d4e-480f-83a0-3b33674fab36",
    qualifiedNotBooked: "0d0aa0e6-37eb-42ed-8966-c941a8083c1a",
    callBooked: "fdaed01c-34a7-4bdd-8948-b855f01c8581",
    ndaSigned: "9a5f7562-b1b7-4df8-bced-14b24cdc7a28",
    // The stages below are moved in GHL, not by this codebase.
    callHeld: "91da25c2-e914-41ce-bb96-0b45750dcb92",
    softCommit: "2389a912-5ae3-41ad-bea0-fbad536d7c1f",
    agreementSent: "d140d58c-07f9-4043-b291-096bf4bef593",
    signed: "87fe90b8-9750-4b0b-b793-ecbc625f422c",
    invested: "86a9a889-4185-4a46-9968-1e7e25d7b72c",
    noShowOrCancelled: "166ed888-d599-4089-ab6f-dd8bfdd2a3dc",
  },
} as const;

/** WebinarKit moves people through this pipeline itself. Kept for reference only. */
export const WEBINAR_PIPELINE_ID = "IUiIXUZC1ztsYKPLTxby";

export const TAGS = {
  applicationStarted: "investor-application-started",
  applicationComplete: "investor-application-complete",
  qualified: "investor-qualified",
  notQualified: "investor-nurture",
  callBooked: "investor-call-booked",
  ndaSigned: "nda-signed",
  ndaSkipped: "nda-skipped",
} as const;

/**
 * Optional GHL custom field keys. Leave empty to write notes only.
 * TODO(Sidney): create these custom fields in GHL if you want them on the contact card,
 * then paste the field keys here (Settings > Custom Fields > field key).
 */
export const CUSTOM_FIELDS = {
  investorType: "", // e.g. "contact.investor_type"
  participationInterest: "",
  decisionTiming: "",
  ndaSignedAt: "",
  ndaSignedIp: "",
  ndaSignedName: "",
  dataRoomActivity: "",
} as const;

/** Booking window for the first call with Michael. */
export const BOOKING = {
  minHoursAhead: 48,
  maxDaysAhead: 7,
  durationMinutes: 45, // TODO(Sidney): confirm call length once the GHL calendar exists
  hostName: "CEO Michael Gegelman",
  /** TODO(Sidney): set GHL_CALENDAR_ID in Vercel once the calendar is created. */
  timezoneDefault: "America/New_York",
} as const;

/* ------------------------------------------------------------------ */
/* Application questions and qualification                              */
/* ------------------------------------------------------------------ */

export type Choice = { value: string; label: string };

export const INVESTOR_TYPES: Choice[] = [
  { value: "advisor", label: "Financial advisor or RIA" },
  { value: "family-office", label: "Family office" },
  { value: "angel", label: "Angel investor" },
  { value: "hnwi", label: "Private individual" },
  { value: "other", label: "Something else" },
];

export const PARTICIPATION_INTEREST: Choice[] = [
  { value: "silver", label: "Silver Collaborator: contribute expertise and capital" },
  { value: "gold", label: "Gold Advisor: offer Advisor Transformation to my clients" },
  { value: "platinum", label: "Platinum Capital Partner: fund the launch stage" },
  { value: "unsure", label: "Not sure yet, I would like to talk it through" },
];

export const DECISION_TIMING: Choice[] = [
  { value: "30d", label: "In the next 30 days" },
  { value: "90d", label: "In the next one to three months" },
  { value: "exploring", label: "I am still exploring" },
];

export type ApplicationAnswers = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  investorType?: string;
  organization?: string;
  state?: string;
  participationInterest?: string;
  decisionTiming?: string;
  heardFrom?: string;
  questions?: string;
};

/**
 * TODO(Sidney): qualification criteria are not set yet.
 * Everyone qualifies for now. When criteria are agreed, edit QUALIFICATION below.
 * Each rule returns true when the applicant passes. All rules must pass.
 */
export const QUALIFICATION: {
  enabled: boolean;
  rules: { id: string; description: string; test: (a: ApplicationAnswers) => boolean }[];
} = {
  enabled: false,
  rules: [
    // Example, not active:
    // { id: "not-exploring", description: "Ready to decide within 90 days", test: (a) => a.decisionTiming !== "exploring" },
  ],
};

export function isQualified(a: ApplicationAnswers): boolean {
  if (!QUALIFICATION.enabled) return true;
  return QUALIFICATION.rules.every((r) => r.test(a));
}
