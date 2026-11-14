import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/Chrome";
import { TrackedDoc, TrackedSection } from "@/components/Tracked";
import { ButtonLink, DryRunBanner, Eyebrow, FunnelSteps, Placeholder, Section } from "@/components/ui";
import Video from "@/components/Video";
import { BOOKING } from "@/config/investor";
import { DATA_ROOM, MEDIA, PITCH_DECK_URL } from "@/content/investor";
import { formatCallParts } from "@/lib/format";
import { ghlIsLive } from "@/lib/ghl";
import { getSession } from "@/lib/session";
import c from "./confirmed.module.css";

export const metadata: Metadata = { title: "Your call is confirmed" };
export const dynamic = "force-dynamic";

export default async function ConfirmedPage() {
  const s = await getSession();
  if (!s) redirect("/apply");
  if (!s.booking) redirect("/book");
  const signed = s.step === "nda-signed" || !!s.nda;
  const when = formatCallParts(s.booking.start, s.booking.timezone);

  return (
    <>
      <DryRunBanner live={ghlIsLive()} />
      <SiteHeader minimal />
      <main id="main">
        {/* ---------- Confirmation + welcome ---------- */}
        <section className={`${c.hero} dark`} aria-labelledby="conf-title">
          <div className={c.heroInner}>
            <FunnelSteps current={3} />
            <Eyebrow>Your call is confirmed</Eyebrow>
            <h1 id="conf-title" className={c.heroTitle}>
              See you on {when.date.split(",")[0]}, {s.firstName}.
            </h1>
            <div className={c.when}>
              <div>
                <span className={c.whenLabel}>Date</span>
                <span className={c.whenValue}>{when.date}</span>
              </div>
              <div>
                <span className={c.whenLabel}>Time</span>
                <span className={c.whenValue}>{when.time}</span>
              </div>
              <div>
                <span className={c.whenLabel}>With</span>
                <span className={c.whenValue}>{BOOKING.hostName}</span>
              </div>
            </div>
            <div className={c.heroActions}>
              <ButtonLink href="/api/calendar" variant="gold">
                Add to my calendar
              </ButtonLink>
            </div>
            <TrackedSection label="Welcome video from Michael" className={c.welcome}>
              <Video
                src={MEDIA.welcomeFromMichael}
                title="A welcome from Michael"
                placeholderNote="A short welcome video from Michael goes here."
                trackLabel="Welcome video from Michael"
              />
            </TrackedSection>
          </div>
        </section>

        {/* ---------- What the call is for ---------- */}
        <Section tone="ivory" labelledBy="call-title">
          <TrackedSection label="What the call is for">
            <div className={c.callGrid}>
              <div>
                <Eyebrow>Your first call</Eyebrow>
                <h2 id="call-title">What the call is for</h2>
                <p className={c.big}>
                  A relaxed conversation to meet the team, answer your questions, and see together whether you are a
                  good fit to become a collaborator.
                </p>
                <div className={c.host}>
                  <Image src="https://s3.amazonaws.com/webflow-prod-assets/6ace6cba9e3d2ce35f9649e8/6af36f443a10b9a7d7c26390_team-michael-gegelman.webp" alt="" width={72} height={72} className={c.hostImg} />
                  <span>
                    <strong>Michael Gegelman</strong>
                    <br />
                    <span className={c.muted}>CEO, John Galt Institute</span>
                  </span>
                </div>
              </div>
              <div className={c.twoCards}>
                <div className={c.card}>
                  <h3>What to expect</h3>
                  <ul className={c.ticks}>
                    <li>About {BOOKING.durationMinutes} minutes, at an unhurried pace.</li>
                    <li>A short introduction to the team and how we got here.</li>
                    <li>Plenty of time for your questions.</li>
                    <li>A clear picture of the next steps, if you would like to go further.</li>
                  </ul>
                </div>
                <div className={c.card}>
                  <h3>Come prepared with</h3>
                  <ul className={c.ticks}>
                    <li>Your questions, written down so none get lost.</li>
                    <li>A sense of how you would like to take part.</li>
                    <li>Anything from the data room you would like to talk through.</li>
                  </ul>
                </div>
              </div>
            </div>
          </TrackedSection>
        </Section>

        {/* ---------- How to use this page ---------- */}
        <Section tone="raised" width="narrow" tight labelledBy="how-title">
          <h2 id="how-title">How to use this page before the call</h2>
          <ol className={c.how}>
            <li>
              <strong>Watch Michael&apos;s welcome</strong> at the top. It is short.
            </li>
            <li>
              <strong>{signed ? "Open the data room" : "Sign the NDA"}</strong>{" "}
              {signed
                ? "below and start with Opportunity. Take each section at your own pace."
                : "to open the data room, then start with Opportunity."}
            </li>
            <li>
              <strong>Watch the films and the deck</strong> further down when you have a quiet moment.
            </li>
            <li>
              <strong>Note your questions</strong> as you go, and bring them to the call.
            </li>
          </ol>
          <p className={c.muted}>You can come back to this page at any time from the same device.</p>
        </Section>

        {/* ---------- Data room ---------- */}
        <Section tone="navy" id="data-room" labelledBy="dr-title">
          <div className={c.drHead}>
            <Eyebrow>Data room</Eyebrow>
            <h2 id="dr-title" className={c.light}>
              Everything behind the plan
            </h2>
          </div>
          {signed ? (
            <div className={c.drGrid}>
              {DATA_ROOM.map((sec) => (
                <TrackedSection key={sec.id} label={`Data room: ${sec.title}`} className={c.drCard}>
                  <h3>{sec.title}</h3>
                  <p className={c.muted}>{sec.explainer}</p>
                  <ul className={c.docs}>
                    {sec.docs.map((d) => (
                      <li key={d.id}>
                        <TrackedDoc label={d.title} href={d.url} className={c.docLink} pendingClassName={c.docPending} />
                      </li>
                    ))}
                  </ul>
                </TrackedSection>
              ))}
            </div>
          ) : (
            <div className={c.locked}>
              <h3>Sign the NDA to open the data room</h3>
              <p>
                Signing the NDA gives you access to the full data room: proforma, cap table, prospectus and more. It
                takes about a minute.
              </p>
              <ul className={c.lockedList}>
                {DATA_ROOM.map((sec) => (
                  <li key={sec.id}>
                    <strong>{sec.title}:</strong> {sec.explainer}
                  </li>
                ))}
              </ul>
              <ButtonLink href="/nda" variant="gold">
                Sign the NDA
              </ButtonLink>
            </div>
          )}
        </Section>

        {/* ---------- Resources ---------- */}
        <Section tone="ivory" labelledBy="res-title">
          <div className={c.drHead}>
            <Eyebrow>Watch and read</Eyebrow>
            <h2 id="res-title">Films and resources</h2>
          </div>
          <div className={c.resGrid}>
            <TrackedSection label="App explainer video" className={c.res}>
              <Video
                src={MEDIA.appExplainer ?? MEDIA.appTour.src}
                poster={MEDIA.appExplainer ? undefined : MEDIA.appTour.poster}
                title="The app explained"
                trackLabel="App explainer video"
              />
              <h3>The app explained</h3>
              <p className={c.muted}>How version 4.0 helps people organize, inventory and value what they own.</p>
            </TrackedSection>
            <TrackedSection label="Founder film" className={c.res}>
              <Video
                src={MEDIA.founderFilm}
                title="The founder film"
                placeholderNote="The founder film goes here."
                trackLabel="Founder film"
              />
              <h3>The founder film</h3>
              <p className={c.muted}>Why Michael has spent 25 years on this.</p>
            </TrackedSection>
            {MEDIA.testimonials.map((t) => (
              <TrackedSection key={t.label} label={`Testimonial: ${t.label}`} className={c.res}>
                <Video
                  src={t.src}
                  title={`${t.label} testimonial`}
                  placeholderNote={`${t.label} testimonial video goes here.`}
                  trackLabel={`Testimonial: ${t.label}`}
                />
                <h3>{t.label}</h3>
                <p className={c.muted}>An advisor who used an earlier version, in their own words.</p>
              </TrackedSection>
            ))}
            <TrackedSection label="Proforma explainer" className={c.res}>
              <Video
                src={MEDIA.proformaExplainer}
                title="The proforma explained"
                placeholderNote="The proforma explainer goes here."
                trackLabel="Proforma explainer"
              />
              <h3>The proforma explained</h3>
              <p className={c.muted}>A walk through the numbers, line by line.</p>
            </TrackedSection>
            <TrackedSection label="Pitch deck" className={c.res}>
              {PITCH_DECK_URL ? (
                <div className={c.deck}>
                  <TrackedDoc label="Open the pitch deck" href={PITCH_DECK_URL} className={c.deckLink} />
                </div>
              ) : (
                <Placeholder video title="One to one pitch deck" note="The deck link goes here." />
              )}
              <h3>The pitch deck</h3>
              <p className={c.muted}>The deck Michael uses in one to one meetings.</p>
            </TrackedSection>
          </div>
          <p className={c.testimonialNote}>Individual experiences vary and are not a guarantee of future results.</p>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
