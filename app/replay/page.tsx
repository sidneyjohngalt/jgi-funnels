import type { Metadata } from "next";
import ApplicationForm from "@/components/ApplicationForm";
import { SiteFooter, SiteHeader } from "@/components/Chrome";
import RawEmbed from "@/components/RawEmbed";
import { Chapter, QuestionVideos } from "@/components/sections";
import { ButtonLink, DryRunBanner, Placeholder } from "@/components/ui";
import { DECISION_TIMING, INVESTOR_TYPES, PARTICIPATION_INTEREST } from "@/config/investor";
import { QUESTIONS_BEFORE_BRIEFING, REPLAY, WEBINARKIT } from "@/content/investor";
import { ghlIsLive } from "@/lib/ghl";
import p from "./replay.module.css";

export const metadata: Metadata = { title: "The briefing replay" };

/**
 * Replay page, sent to every registrant after each session (link it from the replay email).
 * The application sits on the page itself: no button to another page.
 */
export default function ReplayPage() {
  const rp = WEBINARKIT.replay;
  return (
    <>
      <DryRunBanner live={ghlIsLive()} />
      <SiteHeader />
      <main id="main">
        <section className={p.head} aria-labelledby="replay-title">
          <div className={p.inner}>
            <p className={p.kicker}>
              <span>The briefing replay</span>
              <span className={p.closes}>
                {REPLAY.closesOn ? `Available until ${REPLAY.closesOn}` : "Available for a limited time [closing date to confirm]"}
              </span>
            </p>
            <h1 id="replay-title">
              The full briefing with Michael, <em>whenever suits you.</em>
            </h1>
            <div className={p.player}>
              {rp ? (
                <RawEmbed html={rp.html} script={rp.script} />
              ) : (
                <Placeholder
                  video
                  title="Briefing replay"
                  note="The replay embed goes here, with chapter markers for the plan, the team and the questions."
                />
              )}
            </div>
          </div>
        </section>

        <Chapter
          label="Next step"
          id="apply"
          title="Want to look closer? Apply for a call."
          intro={
            <p>
              Four short questions, then pick a time with CEO Michael Gegelman. Michael reads every answer before you
              talk.
            </p>
          }
        >
          <div className="panel">
            <ApplicationForm
              prefill={{}}
              investorTypes={INVESTOR_TYPES}
              participation={PARTICIPATION_INTEREST}
              timing={DECISION_TIMING}
            />
          </div>
        </Chapter>

        <Chapter label="Short answers" id="questions" title="Questions people ask after the briefing.">
          <QuestionVideos items={QUESTIONS_BEFORE_BRIEFING} />
        </Chapter>

        <Chapter label="Ask in person" id="next" title="Prefer to ask your questions live?">
          <p className={p.next}>
            {REPLAY.nextSession
              ? `The next session is ${REPLAY.nextSession}.`
              : "The next session date goes here. [to confirm]"}
          </p>
          <ButtonLink href="/" variant="ghost">
            Save a seat at the next session
          </ButtonLink>
        </Chapter>
      </main>
      <SiteFooter />
    </>
  );
}
