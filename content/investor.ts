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
} = {
  registration: null, // TODO(Sidney): paste WebinarKit registration embed (Step 1 html, Step 2 script)
  thankYou: null, // TODO(Sidney): paste WebinarKit thank you embed
};

/** Shown under the form. Keep in step with the WebinarKit event schedule. */
export const WEBINAR = {
  title: "The Stakeholder Webinar",
  lengthMinutes: 60,
  scheduleNote: null as string | null, // e.g. "Every Tuesday at 7 pm Eastern". TODO(Sidney)
};

/* ------------------------------------------------------------------ */
/* Media                                                               */
/* ------------------------------------------------------------------ */
export const MEDIA = {
  appTour: {
    src: "https://s3.amazonaws.com/webflow-prod-assets/6ace6cba9e3d2ce35f9649e8/6af7553ebf2872059d170fea_et-tour-1080.mp4",
    poster: "https://s3.amazonaws.com/webflow-prod-assets/6ace6cba9e3d2ce35f9649e8/6af7553f6f2b70c745c3a01e_et-tour-poster.webp",
  },
  welcomeFromMichael: null as string | null, // TODO(Sidney): Michael's welcome video URL (MP4 or embed)
  founderFilm: null as string | null, // TODO(Sidney): founder film URL (live on the main site)
  appExplainer: null as string | null, // TODO(Sidney): final app explainer MP4 URL (Bunny jgi-media/et-film/)
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
