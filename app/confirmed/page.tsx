import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/Chrome";
import { Chapter, EmailTip, QuestionVideos } from "@/components/sections";
import { TrackedDoc, TrackedSection } from "@/components/Tracked";
import { ButtonLink, DryRunBanner, FunnelSteps, Placeholder } from "@/components/ui";
import Video from "@/components/Video";
import { BOOKING } from "@/config/investor";
import { CONTACT, DATA_ROOM, FOUNDER_FILM, IMAGES, MEDIA, PITCH_DECK_URL, QUESTIONS_BEFORE_CALL, WHY_NOW } from "@/content/investor";
import FounderFilm from "@/components/FounderFilm";
import { RaiseBox, Seats, StakeholderPath } from "@/components/Pitch";
import SectionNav from "@/components/SectionNav";
import { formatCallParts } from "@/lib/format";
import { ghlIsLive } from "@/lib/ghl";
import { getSession } from "@/lib/session";
import c from "./confirmed.module.css";

export const metadata: Metadata = { title: "Your call is confirmed" };
export const dynamic = "force-dynamic";

/** The page's sections, in order, for the sticky progress bar. */
const PREP_STEPS = [
  { id: "start", label: "Start here" },
  { id: "call", label: "The call" },
  { id: "seat", label: "Your seat" },
  { id: "answers", label: "Short answers" },
  { id: "data-room", label: "Data room" },
  { id: "films", label: "Resources" },
  { id: "contact", label: "Before the call" },
];


/**
 * Confirmation page. Booked is not sold: between booking and the call the stakeholder researches us,
 * so this page answers them first. Order: confirm, email tip, Michael's main video, what the call
 * is for, your seat, short answers, data room, films, who will contact you. A sticky bar tracks
 * progress through those sections so nobody stops at the data room thinking the page has ended.
 */
export default async function ConfirmedPage() {
  const s = await getSession();
  if (!s) redirect("/apply");
  if (!s.booking) redirect("/apply");
  const signed = s.step === "nda-signed" || !!s.nda;
  const when = formatCallParts(s.booking.start, s.booking.timezone);

  return (
    <>
      <DryRunBanner live={ghlIsLive()} />
      <SiteHeader minimal />
      <main id="main">
        {/* ---------- Confirmation ---------- */}
        <section className={`glow ${c.head}`} aria-labelledby="conf-title">
          <div className="backdrop" style={{ backgroundImage: `url(${IMAGES.appCollage})` }} aria-hidden="true" />
          <div className={c.headInner}>
            <FunnelSteps current={2} />
            <p className={c.kicker}>Your call is confirmed</p>
            <div className={c.headGrid}>
              <div>
                <h1 id="conf-title">
                  See you on {when.date.split(",")[0]}, <em>{s.firstName}.</em>
                </h1>
                <dl className={c.when}>
                  <div>
                    <dt>Date</dt>
                    <dd>{when.date}</dd>
                  </div>
                  <div>
                    <dt>Time</dt>
                    <dd>{when.time}</dd>
                  </div>
                  <div>
                    <dt>With</dt>
                    <dd>{BOOKING.hostName}</dd>
                  </div>
                  <div>
                    <dt>Length</dt>
                    <dd>About {BOOKING.durationMinutes} minutes</dd>
                  </div>
                </dl>
                <div className={c.calRow}>
                  <ButtonLink href="/api/calendar" variant="gold">
                    Add to my calendar
                  </ButtonLink>
                  <ButtonLink href="#start" variant="ghost">
                    Prepare for the call
                  </ButtonLink>
                </div>
              </div>
              <figure className={c.portrait}>
                <Image src={IMAGES.michaelOffice} alt="CEO Michael J. Gegelman" width={831} height={1352} sizes="(max-width: 980px) 40vw, 320px" />
                <figcaption>CEO Michael J. Gegelman, Founder</figcaption>
              </figure>
            </div>
            <div className={c.tip}>
              <EmailTip sender={CONTACT.emailSender ?? undefined} />
            </div>
            <p className={c.howTo}>
              <strong>How to use this page:</strong> before your call, work down the seven steps in the bar at the
              top, at your own pace. Nothing here is held back: the plan, the people and the documents are all on
              this page. Bring anything that is still unclear to Michael.
            </p>
          </div>
        </section>

        <SectionNav label="Your preparation, step by step" items={PREP_STEPS} />

        {/* ---------- Michael's main video ---------- */}
        <Chapter
          label="Start here"
          id="start"
          title="Why now, and what you will find if you look us up."
          intro={
            <>
              <p>{WHY_NOW}</p>
              <p>Michael, in a few minutes, on the questions most people research before a call like this.</p>
            </>
          }
        >
          <TrackedSection label="Main video from Michael">
            <Video
              src={MEDIA.welcomeFromMichael}
              title="Michael before your call"
              placeholderNote="Main video from Michael: due diligence (what search and AI tools say about us, and what we did when things went wrong) or a dated, outside reason why now. Opens with a 60 second summary, then chapters."
              trackLabel="Main video from Michael"
            />
          </TrackedSection>
        </Chapter>

        {/* ---------- What the call is for ---------- */}
        <Chapter label="Your first call" id="call" title="What the call is for.">
          <TrackedSection label="What the call is for">
            <p className={c.big}>
              A relaxed conversation to meet the team, answer your questions, and see together whether one of the three
              seats in the Venture Studio fits you.
            </p>
            <div className={c.cols}>
              <div>
                <h3>What to expect</h3>
                <ul className={c.list}>
                  <li>About {BOOKING.durationMinutes} minutes, at an unhurried pace.</li>
                  <li>A short introduction to the team and how we got here.</li>
                  <li>Plenty of time for your questions.</li>
                  <li>A clear picture of the next steps, if you would like to go further.</li>
                </ul>
              </div>
              <div>
                <h3>Come prepared with</h3>
                <ul className={c.list}>
                  <li>Your questions, written down so none get lost.</li>
                  <li>A sense of which seat fits you, and how you would like to take an active part.</li>
                  <li>Anything from the data room you would like to talk through.</li>
                </ul>
              </div>
            </div>
          </TrackedSection>
        </Chapter>

        {/* ---------- Your seat ---------- */}
        <Chapter
          label="Your seat"
          id="seat"
          tone="glow"
          title="Where you are on the path to a seat."
          intro={
            <p>
              You are applying for a seat in the FinTech Transformation Venture Studio: the build and launch of version
              4.0, and the infrastructure for the $124 trillion wealth transfer.
            </p>
          }
        >
          <StakeholderPath current={1} />
          <div className={c.seatGap} />
          <Seats />
          <RaiseBox />
        </Chapter>

        {/* ---------- Short answers ---------- */}
        <Chapter
          label="Short answers"
          id="answers"
          title="Straight answers to the questions people ask."
          intro={<p>Read the short answer, or watch Michael answer it himself. Nothing you ask will be off limits on the call.</p>}
        >
          <QuestionVideos items={QUESTIONS_BEFORE_CALL} tracked />
        </Chapter>

        {/* ---------- Data room ---------- */}
        <Chapter label="Data room" id="data-room" tone="glow" title="Everything behind the plan.">
          {signed ? (
            <div className={c.drList}>
              {DATA_ROOM.map((sec) => (
                <TrackedSection key={sec.id} label={`Data room: ${sec.title}`} className={c.drRow}>
                  <div>
                    <h3>{sec.title}</h3>
                    <p className={c.drNote}>{sec.explainer}</p>
                  </div>
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
              <p className={c.lockedLead}>
                Sign the NDA to open the full data room: proforma, cap table, prospectus and more. It takes about a
                minute.
              </p>
              <ul className={c.lockedList}>
                {DATA_ROOM.map((sec) => (
                  <li key={sec.id}>
                    <strong>{sec.title}.</strong> {sec.explainer}
                  </li>
                ))}
              </ul>
              <ButtonLink href="/nda" variant="gold">
                Sign the NDA
              </ButtonLink>
            </div>
          )}
        </Chapter>

        {/* ---------- Films and resources ---------- */}
        <Chapter label="Watch and read" id="films" title="Films and resources.">
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
              <FounderFilm {...FOUNDER_FILM} />
              <h3>The founder film</h3>
              <p className={c.muted}>Why Michael built this, in his own words.</p>
            </TrackedSection>
            {MEDIA.testimonials.map((t) => (
              <TrackedSection key={t.label} label={`Testimonial: ${t.label}`} className={c.res}>
                <Video
                  src={t.src}
                  title={`${t.label} testimonial`}
                  placeholderNote={`${t.label} testimonial video goes here, unedited.`}
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
          <p className={c.note}>Individual experiences vary and are not a guarantee of future results.</p>
        </Chapter>

        {/* ---------- Who will contact you ---------- */}
        <Chapter label="Before the call" id="contact" title="Who you will hear from.">
          <p className={c.big}>
            {CONTACT.textFromName ? `${CONTACT.textFromName} ` : "Someone from our team "}
            will send you a short personal note before your call
            {CONTACT.textFromNumber ? (
              <>
                , from <strong>{CONTACT.textFromNumber}</strong>
              </>
            ) : null}
            . Reply any time with a question.
          </p>
          <p className={c.muted}>You can come back to this page at any time from the same device.</p>
        </Chapter>
      </main>
      <SiteFooter />
    </>
  );
}
