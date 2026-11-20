# JGI Funnels: project brief (lander, webinar and investor funnel)

You build and maintain the John Galt Institute's funnels: landing pages, the investor application, the NDA step and the post-booking confirmation page. First funnel: the investor webinar funnel. The same codebase will host later funnels, so build reusable pieces (page sections, form steps, GHL client).

Stack: Next.js on Vercel, code in GitHub. Separate domain from the main site (domain to confirm with Sidney, likely fintechtransformation.info). GoHighLevel (GHL) is the CRM. WebinarKit runs only the webinar itself.

## Who we are (facts; never invent others)
- John Galt Institute (JGI), Charlotte NC. CEO Michael Gegelman.
- Product: Estate Transformation, a phone-first app that helps people organize, inventory and value everything they own, so their family inherits a finished file, not a project. Advisor Transformation is the version for financial advisors.
- Story: 2001, Michael built the first organizer. v2.0 reached about 400 advisor offices. 2021, Michael spent 18 months settling his own parents' estate. v4.0 is the phone-first app.
- The raise: $7.14M total, $2.417M raised, $4,719,984 to go, in contractual participation units.
- Investor audience: RIAs and financial advisors, family offices, angels, high net worth individuals. Mostly older readers.

## Rules (never break)
- Say "contractual participation units". Never "equity" or "shares". No returns claims, no projected returns.
- "CEO Michael Gegelman" on first mention. Say "organizer", never "binder".
- No pricing, internal costs, supplier or developer names, or competitor names.
- No em or en dashes anywhere in on-page text.
- Not legal, tax or investment advice; keep a short footer line saying so.
- Never deploy to the production domain, send any email or SMS, or connect live forms to real contacts without Sidney's explicit OK. Vercel preview deploys are fine.
- Never put API keys or tokens in code or in this file. Server-side env vars on Vercel only.
- Ask rather than guess. Use clearly marked placeholders for anything missing.

## Brand and voice
Match the main website (www.johngaltinstitute.com, built in Webflow). Retro modern, calm and premium, in the spirit of Apple, Stripe and Mercury. Plain, warm, unhurried copy, short sentences, no hype words. Large readable type for an older audience, generous spacing, high contrast, works perfectly on a phone.

Brand tokens (taken from the live site's Webflow variables, 14 Nov). Use these exact values as CSS variables:
- Ivory #F6F1E7 (page background) · Ivory raised #FFFDF8 (cards) · White #FFFFFF
- Ink #1E1C19 (text) · Ink muted #5E574C (secondary text) · Charcoal #262626 · Charcoal deep #1C1B19 (dark sections)
- Gold #FFC000 (accents and buttons on dark) · Gold text #7A5A00 (gold-coloured text on light backgrounds) · Champagne #F0DC9B
- Ledger green #1F3B2D · Vault navy #14233C (deep accent sections) · Hairline #D8CFBE (borders and rules)
- Fonts (Google Fonts): Playfair Display for headings, Manrope for body, Oswald for small uppercase labels.

Brand assets (hosted on the site; use the URLs directly or download into /public):
- Wordmark (gold): https://s3.amazonaws.com/webflow-prod-assets/6ace6cba9e3d2ce35f9649e8/6af494b5ec5271f2e876f9d8_jgi-wordmark-gold-2026.webp
- Icon 512 (favicon): https://s3.amazonaws.com/webflow-prod-assets/6ace6cba9e3d2ce35f9649e8/6af494b5ec5271f2e876f9e9_jgi-galt-icon-512.png
- App tour video: https://s3.amazonaws.com/webflow-prod-assets/6ace6cba9e3d2ce35f9649e8/6af7553ebf2872059d170fea_et-tour-1080.mp4 (poster: https://s3.amazonaws.com/webflow-prod-assets/6ace6cba9e3d2ce35f9649e8/6af7553f6f2b70c745c3a01e_et-tour-poster.webp)
- App hero collage: https://s3.amazonaws.com/webflow-prod-assets/6ace6cba9e3d2ce35f9649e8/6af759ef76f20d2ef49fde40_et-hero-collage.webp
- Venture studio announcement image: https://s3.amazonaws.com/webflow-prod-assets/6ace6cba9e3d2ce35f9649e8/6af397082f4be44888c751f5_venture-studio-announcement-1400.jpg
- Team photos: Michael https://s3.amazonaws.com/webflow-prod-assets/6ace6cba9e3d2ce35f9649e8/6af36f443a10b9a7d7c26390_team-michael-gegelman.webp · Sidney https://s3.amazonaws.com/webflow-prod-assets/6ace6cba9e3d2ce35f9649e8/6af36f44878073f3c0192855_team-sidney-pengilly.webp · TD https://s3.amazonaws.com/webflow-prod-assets/6ace6cba9e3d2ce35f9649e8/6af36f44878073f3c0192844_team-td-mangrum.webp · Mair https://s3.amazonaws.com/webflow-prod-assets/6ace6cba9e3d2ce35f9649e8/6af36f46efc0eb7e3c53d69a_team-mair-ahmed.webp
- Look at www.johngaltinstitute.com before designing and match its layout feel. The site also has a live press release on the FinTech Transformation venture studio raise; keep wording consistent with it.

## The flow (locked 14 Nov)
1. **Lander.** Webinar registration page. One slot for the WebinarKit embedded form (placeholder until Sidney adds the embed code; WebinarKit Pro).
2. **Webinar (WebinarKit).** WebinarKit sends confirmation, reminders and replay, and hosts the watch room. It passes each person to GHL tagged registered, attended, replay watched or no-show (Webinar pipeline). Our code sends no webinar emails.
3. **Investor application** (our own multi-step form; no Typeform, no Calendly). Step 1 asks only name, email and phone and is sent to GHL immediately: create or update the contact and an opportunity in "Application Started", so abandoned applications can be chased. Later steps update the contact. Qualification criteria are not set yet: build the logic as a config with everyone qualifying for now, and mark it TODO for Sidney. Not qualified: thank-you page plus nurture tag, no booking.
4. **Book the first call (with Michael).** Qualified applicants move to "Qualified, Not Booked", then book. Booking window: at least 48 hours ahead, at most 6 days (Sidney, 20 Nov), 60-minute calls, with copy asking them to pick a time that leaves room to go through the resources first. Use the GHL calendar (to be created; placeholder for now). On booking the code creates the appointment and writes the Confirmation page link; CRM's Call booked workflow adds call:booked and moves the stage.
5. **NDA step, straight after booking.** Short scrollable NDA with click-to-sign: tick box plus typed full name, store timestamp and IP, send to GHL, stage "NDA Signed", tags nda:signed and dataroom:access-granted. Option "Continue without NDA" opens a confirm modal: "Are you sure? Signing the NDA gives you access to the full data room: proforma, cap table, prospectus and more." Buttons: "Sign the NDA" or "Continue without due diligence". Skippers get tag nda:skipped. NDA text is a placeholder until Sidney supplies it (counsel is confirming click-to-sign is enough).
6. **Confirmation page.** "Your call is confirmed" with date and time. Then:
   - Welcome video from Michael at the top (placeholder).
   - What the call is for: meet the team, answer questions, see if they are a good fit to become a collaborator. What to expect and what to come prepared with.
   - How to use this page before the call.
   - Data room sections with a one-line explainer each (Opportunity, Technology, Resources, Economics, Agreement, Corporate, Reviews). Only for NDA signers; skippers see a prompt to sign.
   - App explainer video, founder film, v2.0 and v3.0 testimonials (permission granted), one-to-one pitch deck, proforma explainer (placeholders where not yet supplied).
   - Track which sections and documents each person opens and write it to their GHL contact (custom fields or notes), so Michael gets a pre-call brief.
7. **After the call (GHL, not this codebase):** Call Held, Soft Commit, Agreement Sent (PandaDoc), Signed, Invested (set by hand when the wire lands), then welcome pack. No-shows and cancellations go to "No-show or Cancelled".

## GHL reference (investor sub-account)
- Location ID: uleeUS7qi57mRfTFWAsg
- Investor Raise pipeline: 68TEMA13HOVLIcvvezLw. Stage IDs:
  - Application Started 0f2437c3-4d4e-480f-83a0-3b33674fab36
  - Qualified, Not Booked 0d0aa0e6-37eb-42ed-8966-c941a8083c1a
  - Call Booked fdaed01c-34a7-4bdd-8948-b855f01c8581
  - NDA Signed 9a5f7562-b1b7-4df8-bced-14b24cdc7a28
  - Call Held 91da25c2-e914-41ce-bb96-0b45750dcb92
  - Soft Commit 2389a912-5ae3-41ad-bea0-fbad536d7c1f
  - Agreement Sent d140d58c-07f9-4043-b291-096bf4bef593
  - Signed 87fe90b8-9750-4b0b-b793-ecbc625f422c
  - Invested 86a9a889-4185-4a46-9968-1e7e25d7b72c
  - No-show or Cancelled 166ed888-d599-4089-ab6f-dd8bfdd2a3dc
- Webinar pipeline: IUiIXUZC1ztsYKPLTxby (Waitlist, Registered, Attended, Replay Watched, No-show).
- Talk to GHL from server-side API routes only, with the token in GHL_API_TOKEN (Vercel env, Sidney only). Per-event switch GHL_LIVE_EVENTS and GHL_TEST_MODE: see README. Tags, fields and events follow the "JGI Funnel and CRM integration contract" (https://claude.ai/artifact/MoyGpMJaGTyvGXgTvmcp8F); its "Reconciled decisions" win.
- SMS is not available until carrier (A2P) registration is approved. Design for email and phone follow-up first.

## Placeholders to track (list them in README and keep it current)
Domain · WebinarKit embed code · qualification criteria · GHL calendar · NDA text · Michael's welcome video · pitch deck · data room links · proforma explainer · testimonial videos.

## How to work
- Build the base first (lander, application, NDA step, confirmation page, GHL client), preview on Vercel, then improve. Funnel research (for example Jeremy Haynes notes in the JGI OneDrive research folder) can refine copy and structure later.
- Check every page on a phone width and a desktop width before calling it done.
- End every session with one line for Sidney to paste to JGI HQ: date · Funnels · done (preview link) · next · blocked by · needs from.