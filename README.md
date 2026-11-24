# JGI Funnels

Landing pages and funnels for the John Galt Institute. Next.js on Vercel. The first funnel is the investor webinar funnel. The project brief is in `CLAUDE.md`. Read it before you change anything.

## The investor funnel

| Step | Route | What it does |
| --- | --- | --- |
| 1. Lander | `/` | Webinar registration. WebinarKit's inline form shows in the hero and again near the bottom, and its script loads once. On phones, a sticky "Save my seat" bar shows until a form is on screen. |
| 1b. Registered | `/registered` | Custom thank you page. WebinarKit's thank you embed (countdown and watch room link), a Gmail tip, one main video from Michael, short question videos, the app tour and what to have ready. |
| 2. Webinar | WebinarKit | WebinarKit runs the webinar, sends every webinar email and tags people in GHL. This codebase sends no email. |
| 2b. Replay | `/replay` | Replay embed with the full application (and calendar) on the same page. Link it from the replay email. Real closing date only. |
| 3. Application and booking | `/apply` | Four short question steps, then the calendar as step 5 on the same page. Step 1 (name, email, phone) goes to GHL straight away: it upserts the contact, adds the opportunity in **Application Started** and tags `investor-application-started`. Steps 2 and 3 update the contact. Step 4 runs qualification; qualified people pick a time straight away, others go to the thank you page. |
| 3b. Not qualified | `/apply/thank-you` | Thank you page. The contact gets the `investor-nurture` tag and no booking. |
| 4. Booking | step 5 of `/apply` (`/book` now redirects there) | Our own slot picker, open 48 hours to 7 days ahead (enforced on the server). Qualified people sit in **Qualified, Not Booked**; after booking they move to **Call Booked** and get the `investor-call-booked` tag. |
| 5. NDA | `/nda` | Scrollable NDA with click-to-sign: a tick box plus a typed full name. The timestamp, IP address, browser and NDA version go to a GHL note, the contact moves to **NDA Signed** and gets the `nda-signed` tag. "Continue without NDA" opens the confirm modal, and skippers get `nda-skipped`. |
| 6. Confirmed | `/confirmed` | Call date and time, add to calendar, a Gmail tip, Michael's main video, what the call is for, short question videos, your seat (path, three seats, raise), the data room and the NDA-only resources (proforma explainer, pitch deck), which stay locked for skippers until they sign the NDA in a pop-up on the same page, films and resources, and who will contact them. A sticky bar at the top shows every section, highlights the one in view and fills as they scroll. Each section viewed, video played and document opened becomes a note on the GHL contact, so Michael has a pre-call brief. |

GHL moves the stages after the call (Call Held onwards), not this code.

### Linking from GHL emails to the application

Post-webinar emails can prefill step 1 like this:

```
https://<domain>/apply?first_name={{contact.first_name}}&last_name={{contact.last_name}}&email={{contact.email}}&phone={{contact.phone}}&utm_source=webinar&utm_campaign=<name>
```

Any `utm_*` or `src` parameters, plus the referrer, are saved to a note on the contact. Use the same link for WebinarKit's in-room offer button and the replay page.

## WebinarKit setup (Pro)

1. In the event, go to **Settings > Design** and switch on **Embed a registration widget on your site**. Choose the **inline form**, then click **View setup instructions**.
2. Paste the **Step 1 HTML** into `WEBINARKIT.registration.html` and the **Step 2 script** into `WEBINARKIT.registration.script`. Both are in `content/investor.ts`. The lander places the form twice and loads the script once, after both forms, which is how WebinarKit expects it.
3. Switch to the **thank you widget**, then paste its two snippets into `WEBINARKIT.thankYou`.
4. In WebinarKit, set the event's thank you page to `https://<domain>/registered`.
5. Make a test registration on the preview link to confirm that the dates show and the thank you page redirects.

Embed code is public page markup, so it is safe to keep in the repo.

## Safety: dry-run until Sidney says go

Every GHL call belongs to one funnel event. An event talks to GHL only when **all** of these hold (Vercel Production env vars, set by Sidney only):

- `GHL_API_TOKEN`: the Private Integration token. `GHL_LOCATION_ID` (optional) overrides the location in `config/investor.ts`.
- `GHL_LIVE_EVENTS`: a comma list of the events that may write. Empty or missing = everything dry-run. Names or contract numbers both work:
  `apply-start` (2) · `apply-complete` (3) · `book` (4) · `nda-sign` (5) · `nda-skip` (6) · `track` (7). Switch-on order: 2, then 3, 5, 6, then 4 once the calendar exists.
- The contact is real: a contact created while event 2 was dry-run is never sent to GHL by a later live event.

`GHL_TEST_MODE=true` adds the tag `test` to every contact a live event touches. `GHL_CALENDAR_ID` is the investor call calendar. `FUNNEL_SESSION_SECRET` (32+ characters) is required once any event is live. Changing these needs a redeploy so the preview banner updates. Until then every GHL call is logged as `[ghl:dry-run:<event>]` and skipped, booking shows sample times, and every funnel page shows a "Preview mode" banner. Tokens live only in Vercel env vars, never in code.

Tags, field keys and the source mapping live in `config/investor.ts` and follow the "JGI Funnel and CRM integration contract" (Reconciled decisions). Never rename one without updating the contract first.

## Personal links and anchors (for GHL emails)

- `{{contact.confirmation_page_link}}` (`/c?t=...`) opens the person's confirmation page on any device. Add `#anchor` to jump to a section; the fragment survives the redirect. Anchors: `start`, `call`, `seat`, `answers`, `films`, `before`, the data room sections `opportunity`, `technology`, `economics`, `resources`, `agreement`, `corporate`, `reviews` (for people who skipped the NDA these land on the locked list, which offers the NDA), and `founder-film`, `app-explainer`, `testimonials`.
- `{{contact.rebook_link}}` (`/r?t=...`, written to the Rebook link field at booking and at every rebook) opens `/rebook`: same 48 hour to 6 day window, keeps the application. If GHL still holds an active appointment, the code moves it the way the contract's "Reschedules" rule (24 Nov) asks: add the tag `call:rescheduled`, cancel the old appointment, wait 3 seconds, book the new time (it checks the new time is free first, and puts the old time back if the new booking fails). CRM's Call cancelled workflow sees the tag and sends nothing; Call booked treats the new appointment as a move. After a cancel a new one is created.
- With event `book` live, the confirmation page, `/rebook` and the calendar file read the person's current appointment on the investor call calendar from GHL (`GET /contacts/:id/appointments`), so cancels, reschedules and bookings made outside the funnel show correctly; a cancelled call sends them to `/rebook`. The token needs read access to contacts and calendar events. In dry-run they use the time saved at booking.

Pages are set to `noindex` until the production domain is approved.

## Placeholders to track

Keep this list current. Each item shows a dashed **Placeholder** box on the page until it is filled.

| Placeholder | Where to fill it | Status |
| --- | --- | --- |
| Written answers to the question lists | `content/investor.ts` > `QUESTIONS_BEFORE_BRIEFING`, `QUESTIONS_BEFORE_CALL` | Drafted from the brief, prospectus and teaser; Sidney to approve |
| Domain (likely fintechtransformation.info) | Vercel project domains, plus `NEXT_PUBLIC_SITE_URL` | Waiting on Sidney |
| WebinarKit registration embed | `content/investor.ts` > `WEBINARKIT.registration` | Waiting on Sidney |
| WebinarKit thank you embed | `content/investor.ts` > `WEBINARKIT.thankYou` | Waiting on Sidney |
| Webinar schedule line | `content/investor.ts` > `WEBINAR.scheduleNote` | Optional |
| Qualification criteria | `config/investor.ts` > `QUALIFICATION` (everyone qualifies for now) | TODO Sidney |
| GHL calendar | `GHL_CALENDAR_ID` env var; 48 hour minimum notice, 6 day range, 60 minutes (CRM creates it) | To be created |
| NDA text | `content/nda.ts` (bump `NDA_VERSION` when it changes) | Waiting on counsel |
| Lander intro video (60 to 90 s) | `content/investor.ts` > `MEDIA.landerIntro` | Waiting |
| Main video on /registered (due diligence or "why now") | `content/investor.ts` > `MEDIA.registeredMain` | Waiting |
| Main video on /confirmed (due diligence or "why now") | `content/investor.ts` > `MEDIA.welcomeFromMichael` | Waiting |
| Question videos and their topics | `content/investor.ts` > `QUESTIONS_BEFORE_BRIEFING`, `QUESTIONS_BEFORE_CALL` (draft topics) | Michael to list his real top questions |
| WebinarKit replay embed | `content/investor.ts` > `WEBINARKIT.replay` | Waiting on Sidney |
| Replay closing date and next session | `content/investor.ts` > `REPLAY` | Waiting on Sidney |
| Email sender, text-from number and name | `content/investor.ts` > `CONTACT` (lines hide while empty) | Waiting on Sidney (texts after A2P) |
| "Live" wording | Lander says "Online briefing" until Sidney decides live vs recorded | Decision |
| Pitch deck | `content/investor.ts` > `PITCH_DECK_URL` | Waiting |
| Data room links (10 documents) | `content/investor.ts` > `DATA_ROOM` | Waiting |
| Proforma explainer | `content/investor.ts` > `MEDIA.proformaExplainer` | Waiting |
| Testimonial videos (v2.0, v3.0) | `content/investor.ts` > `MEDIA.testimonials` | Waiting |
| Founder film | `content/investor.ts` > `MEDIA.founderFilm` | URL needed |
| App explainer (final) | `content/investor.ts` > `MEDIA.appExplainer` (the app tour shows until then) | URL needed |
| SMS consent wording (A2P) | `components/ApplicationForm.tsx` (CRM wording, 20 Nov) | Counsel review |
| Opportunity lost reason "Not a fit" | `config/investor.ts` > `OPPORTUNITY_LOST_REASON_ID` (none in GHL yet) | Waiting on CRM |
| Not-qualified page copy | `app/apply/thank-you/page.tsx` | Draft, needs Sidney's OK |

## Working on it

```
npm install
npm run dev        # http://localhost:3000
npm run build      # runs the copy audit first, then builds
```

The **copy audit** (`scripts/copy-audit.mjs`) runs on every build. It fails on em or en dashes, "equity", "shares", "binder", returns claims, or a supplier name in page text.

### Reusable pieces for the next funnel

- `components/ui.tsx`: Section, Eyebrow, buttons, Card, Placeholder, RaiseProgress, FunnelSteps, preview banner.
- `components/sections.tsx`: SplitHero, PointGrid, AudienceList, HostStory (with timeline), Faq.
- `components/WebinarKit.tsx`, `RawEmbed.tsx`: any third-party embed with working scripts.
- `components/FunnelShell.tsx`: the frame for any multi-step funnel page.
- `components/Tracked.tsx`, `track.ts`: section, video and document tracking to GHL notes.
- `lib/ghl.ts`: GHL v2 client (contacts, tags, notes, opportunities, calendar) with the dry-run gate.
- `lib/session.ts`: signed, http-only funnel cookie.

Brand tokens are in `app/globals.css`. They are the live site's Webflow variables, so do not change them without checking the site.

Brand images load straight from the main site's asset host (`s3.amazonaws.com/webflow-prod-assets/...`), so a change on the site carries through here.


## NDA gate and GHL tags

- Signers (on `/nda` or later in the pop-up on `/confirmed`) get the tag `nda-signed`, move to **NDA Signed**, and get a note with the typed name, time, IP, browser, NDA version and where they signed.
- Skippers get `nda-skipped`. If a skipper signs later from the confirmation page, `nda-skipped` is removed and `nda-signed` is added, so they leave the skipped flows and enter the signer flows.
- For GHL workflows: start the signer flows on "tag added: nda-signed", and give the skipped flows an exit condition "contact has tag nda-signed".
- Locked content (data room links, proforma explainer, pitch deck) is not sent to the browser until the person has signed.
