# Investor email wrapper (for CRM to save in GHL)

One light HTML wrapper for every investor workflow email, to the spec in section 4 of "JGI CRM: investor sending set-up" (https://claude.ai/artifact/EyNWykuM8F8zvHMgPeHU1A). The emails stay plain letters from Michael; the wrapper adds a quiet header and footer.

Files
- `investor-wrapper.html`: the wrapper. 600 px single column, tables and inline CSS, Outlook (mso) fallbacks.
- `investor-wrapper.txt`: the matching plain-text version.
- `button-snippet.html`: optional button (Charcoal deep, Gold text, 48 px) with the plain link under it.
- Wordmark: `public/email/jgi-wordmark-gold-320.png` (320 x 87, shown at 160 px, flattened on #1C1B19), served at
  https://jgi-funnels.vercel.app/email/jgi-wordmark-gold-320.png. Once the funnel domain is live, or if CRM uploads it to
  GHL's media library, swap the `src`.
- Signature photo: `public/email/michael-signature-128.jpg` (128 x 128, shown at 64 px, round; square crop of the full width of
  Michael's office portrait from 2% down, approved by Sidney 27 Nov), served at
  https://jgi-funnels.vercel.app/email/michael-signature-128.jpg. Swap the `src` with the wordmark's.

Placeholders (CRM replaces them in GHL; Funnels did not guess GHL's merge field names)
- `[EMAIL BODY]`: the email's own paragraphs, each as `<p>...</p>`.
- `[PREVIEW TEXT]`: the inbox preview line (or delete the hidden div).
- `[UNSUBSCRIBE LINK]`: GHL's unsubscribe link merge field.
- `[COUNSEL FOOTER]`: counsel's wording, when it arrives.

Checks: no em or en dashes, two images (wordmark and signature photo), no background images, file well under 100 KB. Fonts fall back to Georgia and
Helvetica or Arial where web fonts are ignored (Gmail, Outlook). The wrapper asks for light colours only.
- `screenshots/`: phone (390 px) and desktop (1280 px) renders with a sample body (`sample-filled.html`, fake text).
