/**
 * Investor funnel content slots. Anything left as `null` shows a clearly marked placeholder.
 * Paste real values here as Sidney supplies them. Keep README's placeholder list in step.
 */

/* ------------------------------------------------------------------ */
/* WebinarKit (Pro)                                                     */
/* ------------------------------------------------------------------ */
/**
 * In WebinarKit: event settings > Design > "Embed a registration widget on your site"
 * > View setup instructions. WebinarKit gives two snippets:
 *   Step 1: an HTML snippet (the inline form). It can appear several times on a page.
 *   Step 2: a script. It must load once per page, after the forms.
 * Paste them below as plain strings. The lander renders Step 1 in the hero and again
 * near the bottom, and loads Step 2 once.
 *
 * For the custom thank you page (/registered), switch the toggle to the thank you widget
 * and paste those two snippets into `thankYou`. In WebinarKit, set the event's thank you
 * page to: https://<funnel domain>/registered
 *
 * Embed code is public page markup, not a secret, so it is fine to keep it here.
 */
export const WEBINARKIT: {
  registration: { html: string; script: string } | null;
  thankYou: { html: string; script: string } | null;
  replay: { html: string; script: string } | null;
} = {
  registration: null, // TODO(Sidney): paste WebinarKit registration embed (Step 1 html, Step 2 script)
  thankYou: null, // TODO(Sidney): paste WebinarKit thank you embed
  replay: null, // TODO(Sidney): paste WebinarKit replay embed for /replay
};

/** Replay page (/replay). The closing date must be real: no fake countdowns. */
export const REPLAY = {
  closesOn: null as string | null, // e.g. "Friday, November 20". TODO(Sidney): how many days the replay stays open
  nextSession: null as string | null, // e.g. "Tuesday, December 1 at 7 pm Eastern". TODO(Sidney)
};

/** Shown on the registered and confirmation pages. Leave null to hide the line. */
export const CONTACT = {
  emailSender: null as string | null, // e.g. "michael@johngaltinstitute.com". TODO(Sidney)
  textFromNumber: null as string | null, // TODO(Sidney): number reminders and personal texts come from (after A2P approval)
  textFromName: null as string | null, // e.g. "Sidney Pengilly". TODO(Sidney)
};

/** TODO(counsel): approved plain-words risk statement for the confirmation page. */
export const RISK_STATEMENT: string | null = null;

/** Shown under the form. Keep in step with the WebinarKit event schedule. */
export const WEBINAR = {
  title: "The Stakeholder Webinar",
  lengthMinutes: 60,
  scheduleNote: null as string | null,
  nextSessionIso: null as string | null, // e.g. "2026-12-01T19:00:00-05:00". TODO(Sidney): next session; until then a labelled sample date shows
};

/* ------------------------------------------------------------------ */
/* Media                                                               */
/* ------------------------------------------------------------------ */
export const MEDIA = {
  appTour: {
    src: "https://s3.amazonaws.com/webflow-prod-assets/6ace6cba9e3d2ce35f9649e8/6af7553ebf2872059d170fea_et-tour-1080.mp4",
    poster: "https://s3.amazonaws.com/webflow-prod-assets/6ace6cba9e3d2ce35f9649e8/6af7553f6f2b70c745c3a01e_et-tour-poster.webp",
  },
  landerIntro: null as string | null, // TODO(Sidney): 60 to 90 second video, Michael on what the briefing covers and who it is for
  registeredMain: null as string | null, // TODO(Sidney): main video on /registered: due diligence or "why now"
  welcomeFromMichael: null as string | null, // TODO(Sidney): main video on /confirmed: due diligence or "why now", not a general welcome
  founderFilm: "https://jgi-media.b-cdn.net/founder-story-1080.mp4" as string | null,
  appExplainer: "https://jgi-media.b-cdn.net/et-film/ET-App-Explainer-1080p.mp4" as string | null,
  proformaExplainer: null as string | null, // TODO(Sidney)
  testimonials: [
    { label: "Version 2.0 advisor", src: null as string | null },
    { label: "Version 3.0 advisor", src: null as string | null },
  ], // TODO(Sidney): testimonial video URLs (permission granted)
};

/** TODO(Sidney): one-to-one pitch deck link. */
export const PITCH_DECK_URL: string | null = null;

/* ------------------------------------------------------------------ */
/* Data room (NDA signers only)                                        */
/* ------------------------------------------------------------------ */
export type DataRoomDoc = { id: string; title: string; url: string | null };
export type DataRoomSection = { id: string; title: string; explainer: string; docs: DataRoomDoc[] };

export const DATA_ROOM: DataRoomSection[] = [
  {
    id: "opportunity",
    title: "Opportunity",
    explainer: "The problem we solve, who it is for, and why now.",
    docs: [{ id: "opportunity-overview", title: "Opportunity overview", url: null }],
  },
  {
    id: "technology",
    title: "Technology",
    explainer: "How the version 4.0 app works and what it is built on.",
    docs: [{ id: "technology-overview", title: "Technology overview", url: null }],
  },
  {
    id: "resources",
    title: "Resources",
    explainer: "Films, walkthroughs and background reading to explore at your own pace.",
    docs: [{ id: "resources-library", title: "Resource library", url: null }],
  },
  {
    id: "economics",
    title: "Economics",
    explainer: "The proforma and the thinking behind it.",
    docs: [{ id: "proforma", title: "Proforma", url: null }],
  },
  {
    id: "agreement",
    title: "Agreement",
    explainer: "The participation agreement and prospectus, for you and your advisors to read.",
    docs: [
      { id: "prospectus", title: "Stakeholder prospectus", url: null },
      { id: "agreement", title: "Participation agreement", url: null },
    ],
  },
  {
    id: "corporate",
    title: "Corporate",
    explainer: "Company documents, structure and the cap table.",
    docs: [{ id: "cap-table", title: "Cap table", url: null }],
  },
  {
    id: "reviews",
    title: "Reviews",
    explainer: "What advisors who used earlier versions have said.",
    docs: [{ id: "reviews", title: "Advisor reviews", url: null }],
  },
];
// TODO(Sidney): data room links for every document above.

/* ------------------------------------------------------------------ */
/* Question videos: one short answer per question Michael gets asked.  */
/* Draft topics only. Michael should replace them with the questions   */
/* he actually hears most. TODO(Michael)                               */
/* ------------------------------------------------------------------ */
/**
 * Short written answers sit beside each video so the page is complete before the videos exist.
 * Facts come only from the brief, the prospectus and the investor teaser.
 * TODO(Sidney): approve the wording.
 */
export type QA = { question: string; answer: string; src: string | null; minutes?: number };

export const QUESTIONS_BEFORE_BRIEFING: QA[] = [
  {
    question: "What is Estate Transformation, in two minutes?",
    answer:
      "A phone-first app that helps people organize, inventory and value everything they own during their lifetime, so their family inherits a finished file, not a project. Advisor Transformation is the version financial advisors offer to their clients.",
    src: null,
  },
  {
    question: "Why is Michael the person to build this?",
    answer:
      "He has worked on this problem since 2001. Version 2.0 reached about 400 advisor offices and thousands of estates. In 2021 he spent 18 months as personal representative of his own parents' estate, and that experience shaped version 4.0.",
    src: null,
  },
  {
    question: "What will I hear at the briefing, and what will I not be asked to do?",
    answer:
      "The problem, Michael's story, the two platforms and how the Venture Studio raise works, then your questions, live. No payment is taken at the briefing. At the end, you can apply for a one to one call if you would like to look closer.",
    src: null,
  },
  {
    question: "Who is the briefing for?",
    answer:
      "Financial advisors and RIAs, family offices, private capital partners and professionals who want to take an active part in building version 4.0. It is not for anyone looking for quick or promised returns.",
    src: null,
  },
];

export const QUESTIONS_BEFORE_CALL: QA[] = [
  {
    question: "How do contractual participation units work?",
    answer:
      "Participation is set out in the Venture Studio Stakeholder Agreement. Depending on your seat, it can include revenue, project and acquisition participation. Units are not stock and carry only the rights the signed agreement gives them. The full terms are in the data room.",
    src: null,
  },
  {
    question: "What does the raise pay for, and how is it going?",
    answer:
      "It funds the Assembly to Launch stage: building and launching version 4.0 of Estate Transformation and Advisor Transformation, advisor onboarding, reaching families directly, the referral engine, legal and compliance readiness, and working capital. $2.417M of $7.14M is raised so far.",
    src: null,
  },
  {
    question: "Where is the app today?",
    answer:
      "Version 4.0 is in build as a phone-first app, and Michael will show you where it stands on the call. It builds on versions used in about 400 advisor offices on thousands of estates.",
    src: null,
  },
  {
    question: "Who can take a seat?",
    answer:
      "People who will take an active part, in one of three seats: Silver Collaborator, Gold Advisor or Platinum Capital Partner. Every seat is subject to company approval and a signed agreement.",
    src: null,
  },
  {
    question: "What happens after our call?",
    answer:
      "Only if you would like to go further: read the data room, review the Stakeholder Agreement with your own attorney or CPA, sign it electronically, then send your contribution by wire. You then receive a welcome pack and your onboarding.",
    src: null,
  },
];

/* ------------------------------------------------------------------ */
/* Design kit assets (main site CDN), 16 Nov.                          */
/* ------------------------------------------------------------------ */
const CDN = "https://s3.amazonaws.com/webflow-prod-assets/6ace6cba9e3d2ce35f9649e8/";
export const FOUNDER_FILM = {
  src: "https://jgi-media.b-cdn.net/founder-story-1080.mp4",
  mobileSrc: "https://jgi-media.b-cdn.net/founder-story-720.mp4",
  poster: "https://jgi-media.b-cdn.net/founder-poster.webp",
  captions: "https://jgi-media.b-cdn.net/founder-story.vtt",
};
export const IMAGES = {
  appCollage: CDN + "6af759ef76f20d2ef49fde40_et-hero-collage.webp",
  michaelOffice: CDN + "6ad0e64e4bb32dd82d96409a_Michael_Gegelman_Office_Portrait.webp",
  michaelHeadshot: CDN + "6acebf69d88ec909625d3b61_michael-gegelman.jpg",
  canoe: CDN + "6acfaaab550b1f58c3bd9018_home-estate-photo.jpg",
  advisorCouple: CDN + "6acfb6b6bc1e15523d83b38b_Warm%20Consultation%20with%20an%20Elderly%20Couple.webp",
  desk2001: CDN + "6ad10ebccce7d13b211d0b22_pv-story-desk-2001.webp",
  appDashboard: CDN + "6af7553d13141bcdfdbfdce3_et-app2-dashboard.webp",
  appWho: CDN + "6af757ff7cae1e3e722ce4d7_et-app4-who.webp",
  skyline: CDN + "6acebf6a6031ec58aec527c3_jgi-epicenter-wide-p-1600.jpg",
};

/** The briefing in four parts, in order. */
export const AGENDA = [
  { label: "The problem", title: "Why settlement breaks down.", body: "Transfer is the easy part. Settlement is where estates stall, and families pay for it in months." },
  { label: "The story", title: "The estate that changed everything.", body: "From the first organizer in 2001 to the 18 months Michael spent settling his own parents' estate." },
  { label: "The platforms", title: "One living record, on the phone.", body: "Estate Transformation for families and Advisor Transformation for financial advisors: what version 4.0 does and who it is for." },
  { label: "The Venture Studio", title: "How the raise works.", body: "What the raise funds, how contractual participation units work, and how you can take part. Then your questions, live." },
];

export const DISCLAIMER =
  "This webinar is for information only. It is not an offer to sell, or a solicitation of an offer to buy, any security.";

/* ------------------------------------------------------------------ */
/* Shared pitch: the same message on every page of the funnel          */
/* Figures come only from the brief and johngaltinstitute.com/claims.   */
/* ------------------------------------------------------------------ */

/** One line, matching the site's Venture Studio page. */
export const BIG_IDEA = "Help build the infrastructure for the $124 trillion wealth transfer.";

export const KEY_FIGURES = [
  { value: "$124T", label: "US wealth expected to change hands through 2048" },
  { value: "30M+", label: "US estates expected to open by 2035" },
  { value: "16 months", label: "average time to settle an estate" },
];

/** Why now, for the confirmation page's urgency line. */
export const WHY_NOW =
  "About 4.1 million Americans turn 65 each year through 2027, the most ever, and more than 30 million US estates are expected to open by 2035. Each of those estates needs someone to find, list and value everything in it.";

export const STAKEHOLDER_CLASSES = [
  {
    id: "silver",
    name: "Silver Collaborator",
    who: "Professionals and partners",
    what: "Put your expertise and capital behind the build and launch.",
  },
  {
    id: "gold",
    name: "Gold Advisor",
    who: "Established financial advisors",
    what: "Offer Advisor Transformation to your own clients, subject to eligibility.",
  },
  {
    id: "platinum",
    name: "Platinum Capital Partner",
    who: "Capital partners",
    what: "Fund the Assembly to Launch stage that takes version 4.0 to market.",
  },
];

/** The site's "Five steps, at your own pace", so every page shows the same road. */
export const STAKEHOLDER_PATH = [
  "Attend the briefing",
  "Meet the CEO one to one",
  "Open the data room",
  "Review with your own attorney or CPA",
  "Sign the Stakeholder Agreement",
];

export const ACTIVE_PARTICIPATION =
  "Participation is through contractual participation units, for participants who take an active part. Terms, eligibility and seat availability are shared only in the briefing and the private data room.";
