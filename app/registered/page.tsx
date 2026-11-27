import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/Chrome";
import FounderFilm from "@/components/FounderFilm";
import PlainQuestions from "@/components/PlainQuestions";
import RawEmbed from "@/components/RawEmbed";
import SectionNav from "@/components/SectionNav";
import { EmailTip } from "@/components/sections";
import { Placeholder } from "@/components/ui";
import Video from "@/components/Video";
import c from "@/components/plain.module.css";
import { AGENDA, CONTACT, FOUNDER_FILM, MEDIA, QUESTIONS_BEFORE_BRIEFING, WEBINAR, WEBINARKIT } from "@/content/investor";

export const metadata: Metadata = { title: "You are registered" };

const STEPS = [
  { id: "registered", label: "You're in" },
  { id: "start", label: "Michael's video" },
  { id: "answers", label: "Your questions" },
  { id: "agenda", label: "The briefing" },
  { id: "ready", label: "On the day" },
];

/**
 * Custom thank you page (set the event's thank you page URL in WebinarKit to /registered).
 * Plain version, 27 Nov: one ivory column, five parts. One job: get people to the briefing,
 * and answer what they look up right after registering.
 */
export default function Registered() {
  const ty = WEBINARKIT.thankYou;
  return (
    <>
      <SiteHeader />
      <main id="main" className={c.page}>
        {/* 1. You are in */}
        <header className={c.block} aria-labelledby="reg-title" id="registered">
          <p className={c.label}>You are registered</p>
          <h1 id="reg-title" className={c.h1}>
            You&rsquo;re in. See you at the briefing.
          </h1>
          <p className={c.lead}>
            Your private link is on its way by email. Add the briefing to your calendar now, so it is not missed.
          </p>
          <div className={c.embed}>
            <div className="panel">
              {ty ? (
                <RawEmbed html={ty.html} script={ty.script} />
              ) : (
                <Placeholder
                  title="Your session time, countdown and add to calendar"
                  note="The thank you embed goes here: the chosen time, add to calendar buttons, and the way into the room when it starts."
                  minHeight={120}
                />
              )}
            </div>
          </div>
          <EmailTip sender={CONTACT.emailSender ?? undefined} />
        </header>

        <SectionNav tone="light" label="Before the briefing, step by step" items={STEPS} />

        {/* 2. Michael's main video */}
        <section className={c.block} aria-labelledby="start-title" id="start">
          <p className={c.label}>Start here</p>
          <h2 id="start-title" className={c.h2}>
            Before you give us an hour, see who we are.
          </h2>
          <p className={c.lead}>What you will find if you look us up, and why the timing matters. A few minutes.</p>
          <Video
            src={MEDIA.registeredMain}
            title="A word from Michael before the briefing"
            placeholderNote="Main video from Michael: why now, or what search and AI tools say about us. Opens with a 60 second summary."
          />
        </section>

        {/* 3. Questions */}
        <section className={c.block} aria-labelledby="answers-title" id="answers">
          <p className={c.label}>Short answers</p>
          <h2 id="answers-title" className={c.h2}>
            Questions people ask first.
          </h2>
          <PlainQuestions
            items={QUESTIONS_BEFORE_BRIEFING}
            media={{
              "What is Estate Transformation, in two minutes?": (
                <Video
                  src={MEDIA.appExplainer ?? MEDIA.appTour.src}
                  poster={MEDIA.appTour.poster}
                  title="Estate Transformation, the app explained"
                />
              ),
              "Why is Michael the person to build this?": <FounderFilm {...FOUNDER_FILM} />,
            }}
          />
        </section>

        {/* 4. What the briefing covers */}
        <section className={c.block} aria-labelledby="agenda-title" id="agenda">
          <p className={c.label}>What you will hear</p>
          <h2 id="agenda-title" className={c.h2}>
            In {WEBINAR.lengthMinutes} minutes, you will see:
          </h2>
          <ol className={c.steps}>
            {AGENDA.map((a, i) => (
              <li key={a.label}>
                <span className={c.qN}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{a.label}.</strong> {a.body}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* 5. On the day */}
        <section className={c.block} aria-labelledby="ready-title" id="ready">
          <p className={c.label}>On the day</p>
          <h2 id="ready-title" className={c.h2}>
            Three small things.
          </h2>
          <ul className={c.plainList}>
            <li>
              <strong>Join on a computer.</strong> The slides are easier to read than on a phone.
            </li>
            <li>
              <strong>Allow about {WEBINAR.lengthMinutes} minutes,</strong> with time for your questions at the end.
            </li>
            <li>
              <strong>Bring your questions.</strong> Michael answers as many as he can, live.
            </li>
          </ul>
          {CONTACT.textFromNumber ? (
            <p className={c.fine}>
              Reminders come by text from <strong>{CONTACT.textFromNumber}</strong>. Save it so you recognise it.
            </p>
          ) : null}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
