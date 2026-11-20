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

/**
 * Tag names, from the "JGI Funnel and CRM integration contract" (Reconciled decisions, 19 to 20 Nov).
 * Never rename one here without updating the contract first and leaving a board message for CRM.
 * The code no longer adds a booked tag or moves the Call Booked stage: CRM's Call booked workflow does both.
 */
export const TAGS = {
  interestInvestor: "interest:investor",
  applicationStarted: "application:started",
  applicationComplete: "application:complete",
  qualified: "application:qualified",
  notQualified: "application:not-qualified",
  ndaSigned: "nda:signed",
  ndaSkipped: "nda:skipped",
  dataroomAccess: "dataroom:access-granted",
  smsConsent: "consent:sms",
  test: "test",
} as const;

/** GHL contact custom field keys (read from GHL, 20 Nov). */
export const FIELDS = {
  interest: "contact.interest",
  investorSource: "contact.investor_source",
  leadSourceDetail: "contact.lead_source_detail",
  emailConsentSource: "contact.email_consent_source",
  emailConsentDate: "contact.email_consent_date",
  smsConsent: "contact.sms_consent",
  investorSegment: "contact.investor_segment",
  classInterest: "contact.class_interest",
  lostReason: "contact.lost_reason",
  confirmationPageLink: "contact.confirmation_page_link",
  confidentialityAgreementSigned: "contact.confidentiality_agreement_signed",
  dataRoomAccessDate: "contact.data_room_access_date",
  signalsNoted: "contact.signals_noted",
  /** Empty until CRM creates the text field Rebook link (board, 20 Nov); then its key, e.g. "contact.rebook_link". */
  rebookLink: "",
} as const;

/**
 * Opportunity lost reason "Not a fit". GHL has no opportunity lost reasons yet (checked 20 Nov),
 * so the code sets status lost without an ID until CRM creates one and its ID goes here.
 */
export const OPPORTUNITY_LOST_REASON_ID = "";

/**
 * Source tag and Investor source value, from utm_source (or src). Webinar, registered and replay pages
 * link to the application with src=webinar. Anything unknown is source:site / Inbound site.
 */
export const SOURCE_MAP: { match: RegExp; tag: string; investorSource: string }[] = [
  { match: /^webinar/, tag: "source:webinar", investorSource: "Webinar" },
  { match: /^(cold-?email|instantly|outreach)/, tag: "source:cold-email", investorSource: "Cold email" },
  { match: /^(paid|ads?|cpc|ppc|google-?ads|meta-?ads|fb-?ads)/, tag: "source:paid-ads", investorSource: "Paid ads" },
  {
    match: /^(social|facebook|fb|instagram|ig|linkedin|x|twitter|youtube|yt|tiktok)$/,
    tag: "source:social",
    investorSource: "Social", // value added by CRM, 20 Nov
  },
  { match: /^(personal-?network|network|referral|friend)/, tag: "source:personal-network", investorSource: "Personal network" },
];
export const SOURCE_DEFAULT = { tag: "source:site", investorSource: "Inbound site" };

export function sourceFor(attr: Record<string, string>): { tag: string; investorSource: string } {
  const raw = (attr.utm_source || attr.src || "").toLowerCase().trim();
  const medium = (attr.utm_medium || "").toLowerCase().trim();
  if (raw) for (const m of SOURCE_MAP) if (m.match.test(raw)) return { tag: m.tag, investorSource: m.investorSource };
  if (/^(cpc|ppc|paid|paid-?social)$/.test(medium)) return { tag: "source:paid-ads", investorSource: "Paid ads" };
  return SOURCE_DEFAULT;
}

/** Booking window for the first call with Michael. */
export const BOOKING = {
  minHoursAhead: 48,
  maxDaysAhead: 6, // Sidney, 20 Nov
  durationMinutes: 60, // Sidney, 20 Nov
  hostName: "CEO Michael Gegelman",
  /** The investor call calendar ID comes from GHL_CALENDAR_ID in Vercel (CRM puts it in the contract's Fixed IDs). */
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
  { value: "executive", label: "C-Suite or senior executive" },
  { value: "other", label: "Something else" },
];

export const PARTICIPATION_INTEREST: Choice[] = [
  { value: "silver", label: "Silver Collaborator: put my expertise and capital behind the build" },
  { value: "gold", label: "Gold Advisor: offer Advisor Transformation to my own clients" },
  { value: "platinum", label: "Platinum Capital Partner: fund the Assembly to Launch stage" },
  { value: "unsure", label: "Not sure yet: I would like to talk it through" },
];

/** Form choice to the GHL Investor segment value. "Private individual" is a new value CRM adds (Reconciled decisions). */
export const INVESTOR_SEGMENT: Record<string, string> = {
  advisor: "RIA or advisor",
  "family-office": "Family office",
  angel: "Angel or angel network",
  hnwi: "Private individual",
  executive: "Business owner or executive",
  other: "Other",
};

/** Seat choice to the Class interest text field. */
export const CLASS_INTEREST: Record<string, string> = {
  silver: "Silver",
  gold: "Gold",
  platinum: "Platinum",
  unsure: "Not sure",
};

export type ApplicationAnswers = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  investorType?: string;
  organization?: string;
  state?: string;
  participationInterest?: string;
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
    // { id: "advisors-only", description: "Financial advisors only", test: (a) => a.investorType === "advisor" },
  ],
};

export function isQualified(a: ApplicationAnswers): boolean {
  if (!QUALIFICATION.enabled) return true;
  return QUALIFICATION.rules.every((r) => r.test(a));
}
