import type { Metadata } from "next";
import ApplicationForm from "@/components/ApplicationForm";
import { SiteFooter, SiteHeader } from "@/components/Chrome";
import PlainQuestions from "@/components/PlainQuestions";
import RawEmbed from "@/components/RawEmbed";
import { ButtonLink, DryRunBanner, Placeholder } from "@/components/ui";
import c from "@/components/plain.module.css";
import { INVESTOR_TYPES, PARTICIPATION_INTEREST } from "@/config/investor";
import { FOUNDER_FILM, MEDIA, QUESTIONS_BEFORE_BRIEFING, REPLAY, WEBINARKIT } from "@/content/investor";
import FounderFilm from "@/components/FounderFilm";
import Video from "@/components/Video";
import { ghlIsLive } from "@/lib/ghl";

export const metadata: Metadata = { title: "The briefing replay" };

/**
 * Replay page, sent to every registrant after each session (link it from the replay email).
 * Plain version, 27 Nov: the replay, then the application right under it (no button to another page),
 * then short answers and the next live session.
 */
export default function ReplayPage() {
  const rp = WEBINARKIT.replay;
  return (
    <>
      <DryRunBanner live={ghlIsLive()} />
      <SiteHeader />
      <main id="main" className={c.page}>
        <header className={c.block} aria-labelledby="replay-title">
          <p className={c.label}>
            The briefing replay ·{" "}
            {REPLAY.closesOn ? `Available until ${REPLAY.closesOn}` : "Available for a limited time [closing date to confirm]"}
          </p>
          <h1 id="replay-title" className={c.h1}>
            The full briefing with Michael, whenever suits you.
          </h1>
          {rp ? (
            <RawEmbed html={rp.html} script={rp.script} />
          ) : (
            <Placeholder
              video
              title="Briefing replay"
              note="The replay embed goes here, with chapter markers for the plan, the team and the questions."
            />
          )}
        </header>

        <section className={c.block} aria-labelledby="apply-title" id="apply">
          <p className={c.label}>Next step</p>
          <h2 id="apply-title" className={c.h2}>
            Ready to look closer? Apply for your seat.
          </h2>
          <p className={c.lead}>
            A few short questions, then pick a time with CEO Michael Gegelman. He reads every answer before you talk.
          </p>
          <div className={c.embed}>
            <div className="panel">
              <ApplicationForm fromWebinar prefill={{}} investorTypes={INVESTOR_TYPES} participation={PARTICIPATION_INTEREST} />
            </div>
          </div>
        </section>

        <section className={c.block} aria-labelledby="answers-title" id="questions">
          <p className={c.label}>Short answers</p>
          <h2 id="answers-title" className={c.h2}>
            Questions people ask after the briefing.
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

        <section className={c.block} aria-labelledby="next-title" id="next">
          <p className={c.label}>Ask in person</p>
          <h2 id="next-title" className={c.h2}>
            Prefer to ask your questions live?
          </h2>
          <p className={c.lead}>
            {REPLAY.nextSession ? `The next session is ${REPLAY.nextSession}.` : "The next session date goes here. [to confirm]"}
          </p>
          <ButtonLink href="/" variant="ghost">
            Save a seat at the next session
          </ButtonLink>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
