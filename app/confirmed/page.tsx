import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/Chrome";
import { EmailTip } from "@/components/sections";
import { TrackedDoc, TrackedSection } from "@/components/Tracked";
import { ButtonLink, DryRunBanner } from "@/components/ui";
import Video from "@/components/Video";
import FounderFilm from "@/components/FounderFilm";
import NdaUnlock from "@/components/NdaUnlock";
import { BOOKING } from "@/config/investor";
import { CONTACT, DATA_ROOM, FOUNDER_FILM, MEDIA, PITCH_DECK_URL, QUESTIONS_BEFORE_CALL } from "@/content/investor";
import { NDA_IS_PLACEHOLDER, NDA_PARAGRAPHS, NDA_TITLE } from "@/content/nda";
import { formatCallParts } from "@/lib/format";
import { ghlIsLive } from "@/lib/ghl";
import { currentCall } from "@/lib/appointment";
import { getSession } from "@/lib/session";
import c from "./cf.module.css";

export const metadata: Metadata = { title: "Your call is confirmed" };
export const dynamic = "force-dynamic";

/**
 * Confirmation page, plain version (27 Nov, after the Jeremy Haynes design review).
 * One ivory column, five parts in his order:
 *   1. You are booked, with the date.  2. Michael's main video.  3. Five questions, one line each, a video each.
 *   4. The data room, open or locked.  5. Who will contact you.
 * Every block: a title, one sentence, then the thing. Longer answers sit behind "Read more".
 */
export default async function ConfirmedPage() {
  const s = await getSession();
  if (!s) redirect("/apply");
  if (!s.booking) redirect("/apply");
  const signed = s.step === "nda-signed" || !!s.nda;
  const ndaProps = { title: NDA_TITLE, paragraphs: NDA_PARAGRAPHS, placeholder: NDA_IS_PLACEHOLDER };
  const call = await currentCall(s);
  if (call.status === "cancelled") redirect("/rebook");
  const when = formatCallParts(call.status === "booked" ? call.start : s.booking.start, s.booking.timezone);

  // Films that used to sit in their own grid now live where a reader looks for them.
  const videoFor: Record<string, { src: string | null; poster?: string }> = {
    "Where is the app today?": { src: MEDIA.appExplainer ?? MEDIA.appTour.src, poster: MEDIA.appTour.poster },
  };

  return (
    <>
      <DryRunBanner live={ghlIsLive()} />
      <SiteHeader minimal />
      <main id="main" className={c.page}>
        {/* 1. You are booked */}
        <header className={c.block} aria-labelledby="conf-title">
          <p className={c.label}>Your call is confirmed</p>
          <h1 id="conf-title" className={c.h1}>
            You&rsquo;re booked, {s.firstName}.
          </h1>
          <p className={c.when}>
            <strong>
              {when.date} at {when.time}
            </strong>
            <br />
            With {BOOKING.hostName}. About {BOOKING.durationMinutes} minutes.
          </p>
          <div className={c.actions}>
            <ButtonLink href="/api/calendar" variant="gold">
              Add to my calendar
            </ButtonLink>
            <a className={c.textLink} href="/rebook">
              Need a different time?
            </a>
          </div>
          <p className={c.lead}>
            The call is to meet the team, answer your questions and see if a seat fits you. Before then, watch the
            video and skim the answers below. It takes about 15 minutes.
          </p>
          {signed ? null : (
            <div className={c.lockBar} role="note">
              <p>
                <strong>Your data room is locked.</strong> Sign the NDA to open it. It takes about a minute.
              </p>
              <NdaUnlock {...ndaProps} label="Sign the NDA" />
            </div>
          )}
        </header>

        {/* 2. Michael's main video */}
        <section className={c.block} aria-labelledby="start-title" id="start">
          <p className={c.label}>Start here</p>
          <h2 id="start-title" className={c.h2}>
            Michael, before your call.
          </h2>
          <p className={c.lead}>Why now, and what you will find if you look us up. A few minutes.</p>
          <TrackedSection label="Main video from Michael">
            <Video
              src={MEDIA.welcomeFromMichael}
              title="Michael before your call"
              placeholderNote="Main video from Michael: why now, or what search and AI tools say about us. Opens with a 60 second summary."
              trackLabel="Main video from Michael"
            />
          </TrackedSection>
        </section>

        {/* 3. Five questions */}
        <section className={c.block} aria-labelledby="answers-title" id="answers">
          <p className={c.label}>Short answers</p>
          <h2 id="answers-title" className={c.h2}>
            Your questions, answered.
          </h2>
          <ol className={c.qList}>
            {QUESTIONS_BEFORE_CALL.map((q, i) => {
              const v = videoFor[q.question] ?? { src: q.src };
              return (
                <li key={q.question} className={c.q}>
                  <TrackedSection label={`Question: ${q.question}`}>
                    <h3 className={c.qTitle}>
                      <span className={c.qN}>{String(i + 1).padStart(2, "0")}</span>
                      {q.question}
                    </h3>
                    <p className={c.qShort}>{q.short ?? q.answer}</p>
                    {q.short ? (
                      <details className={c.more}>
                        <summary>Read more</summary>
                        <p>{q.answer}</p>
                      </details>
                    ) : null}
                    <div className={c.qVideo}>
                      <Video
                        src={v.src}
                        poster={v.poster}
                        title={q.question}
                        placeholderNote="1 to 3 minute answer from Michael."
                        trackLabel={`Question video: ${q.question}`}
                      />
                    </div>
                  </TrackedSection>
                </li>
              );
            })}
          </ol>
        </section>

        {/* 4. Data room */}
        <section className={c.block} aria-labelledby="room-title" id="before">
          <p className={c.label}>Before the call</p>
          <h2 id="room-title" className={c.h2}>
            Your data room.
          </h2>
          <p className={c.lead}>
            Open it before you talk, so the call goes on your questions, not the basics. Michael sees which parts you
            open.
          </p>

          {signed ? (
            <>
              {s.nda ? <p className={c.signed}>Signed by {s.nda.name}. Everything below is open to you.</p> : null}
              <ul className={c.room}>
                {DATA_ROOM.map((sec) => (
                  <li key={sec.id} id={sec.id}>
                    <TrackedSection label={`Data room: ${sec.title}`} className={c.roomRow}>
                      <div>
                        <h3 className={c.roomTitle}>{sec.title}</h3>
                        <p className={c.roomNote}>{sec.explainer}</p>
                      </div>
                      <ul className={c.docs}>
                        {sec.docs.map((d) => (
                          <li key={d.id}>
                            <TrackedDoc label={d.title} href={d.url} className={c.docLink} pendingClassName={c.docPending} />
                          </li>
                        ))}
                        {sec.id === "opportunity" ? (
                          <li>
                            <TrackedDoc label="One to one pitch deck" href={PITCH_DECK_URL} className={c.docLink} pendingClassName={c.docPending} />
                          </li>
                        ) : null}
                      </ul>
                      {sec.id === "opportunity" ? (
                        <div className={c.roomMedia}>
                          <FounderFilm {...FOUNDER_FILM} />
                          <p className={c.caption}>The founder film: why Michael built this.</p>
                        </div>
                      ) : null}
                      {sec.id === "economics" ? (
                        <div className={c.roomMedia}>
                          <Video
                            src={MEDIA.proformaExplainer}
                            title="The proforma explained"
                            placeholderNote="The proforma explainer goes here."
                            trackLabel="Proforma explainer"
                          />
                          <p className={c.caption}>The proforma, explained line by line.</p>
                        </div>
                      ) : null}
                      {sec.id === "reviews" ? (
                        <div className={c.roomMediaPair}>
                          {MEDIA.testimonials.map((t) => (
                            <div key={t.label}>
                              <Video
                                src={t.src}
                                title={`${t.label} testimonial`}
                                placeholderNote={`${t.label} testimonial, unedited.`}
                                trackLabel={`Testimonial: ${t.label}`}
                              />
                              <p className={c.caption}>{t.label}, in their own words.</p>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </TrackedSection>
                  </li>
                ))}
              </ul>
              <p className={c.fine}>Individual experiences vary and are not a guarantee of future results.</p>
            </>
          ) : (
            <div className={c.locked} id="locked-room">
              <ul className={c.lockedList}>
                {DATA_ROOM.map((sec) => (
                  <li key={sec.id} id={sec.id}>
                    <span className={c.lockTag} aria-hidden="true">
                      Locked
                    </span>
                    <span>
                      <strong>{sec.title}.</strong> {sec.explainer}
                    </span>
                  </li>
                ))}
              </ul>
              <NdaUnlock {...ndaProps} label="Sign the NDA to open it" autoOpenWhenVisible="locked-room" />
            </div>
          )}
        </section>

        {/* 5. Who will contact you */}
        <section className={c.block} aria-labelledby="contact-title" id="contact">
          <p className={c.label}>What happens next</p>
          <h2 id="contact-title" className={c.h2}>
            Who you will hear from.
          </h2>
          <p className={c.lead}>
            {CONTACT.textFromName ?? "Someone from our team"} will send you a short personal note before your call
            {CONTACT.textFromNumber ? (
              <>
                , from <strong>{CONTACT.textFromNumber}</strong>
              </>
            ) : null}
            . Reply any time with a question.
          </p>
          <EmailTip sender={CONTACT.emailSender ?? undefined} />
          <p className={c.fine}>You can come back to this page any time from the link in your confirmation email.</p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
