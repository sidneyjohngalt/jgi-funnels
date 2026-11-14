import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/Chrome";
import RawEmbed from "@/components/RawEmbed";
import { Chapter, EmailTip, QuestionVideos, RuledList } from "@/components/sections";
import { Placeholder } from "@/components/ui";
import Video from "@/components/Video";
import { CONTACT, MEDIA, QUESTIONS_BEFORE_BRIEFING, WEBINAR, WEBINARKIT } from "@/content/investor";
import p from "./registered.module.css";

export const metadata: Metadata = { title: "You are registered" };

/**
 * Custom thank you page. Set the event's thank you page URL in WebinarKit to /registered.
 * One job: get people to the briefing. People research hardest right after they register,
 * so this page answers their questions before Google does.
 */
export default function Registered() {
  const ty = WEBINARKIT.thankYou;
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className={p.head} aria-labelledby="reg-title">
          <div className={p.headInner}>
            <p className={p.kicker}>You are registered</p>
            <div className={p.headGrid}>
              <div>
                <h1 id="reg-title">
                  You&apos;re in. <em>Here is what happens next.</em>
                </h1>
                <p className={p.lead}>
                  Your private link is on its way by email. If the briefing starts soon, keep this page open: it will
                  take you straight in.
                </p>
              </div>
              <div className="panel">
                {ty ? (
                  <RawEmbed html={ty.html} script={ty.script} />
                ) : (
                  <Placeholder
                    title="Your session time and countdown"
                    note="The thank you embed goes here: your chosen time, add to calendar, and the way into the room when it starts."
                    minHeight={170}
                  />
                )}
              </div>
            </div>
            <div className={p.tip}>
              <EmailTip sender={CONTACT.emailSender ?? undefined} />
            </div>
          </div>
        </section>

        <Chapter
          label="Start here"
          id="main-video"
          title="Before you give us an hour, see who we are."
          intro={<p>A few minutes from Michael on what you will find if you look us up, and why the timing matters.</p>}
        >
          <Video
            src={MEDIA.registeredMain}
            title="A word from Michael before the briefing"
            placeholderNote="Main video from Michael: due diligence (what search and AI tools say about us, and what we did when things went wrong) or a dated, outside reason why now. Opens with a 60 second summary."
          />
        </Chapter>

        <Chapter label="Short answers" id="questions" title="Questions people ask before the briefing.">
          <QuestionVideos items={QUESTIONS_BEFORE_BRIEFING} />
        </Chapter>

        <Chapter
          label="The app"
          id="tour"
          tone="dark"
          title="A short tour of version 4.0."
          intro={<p>Organize it now. Inventory it now. Value it now.</p>}
        >
          <Video src={MEDIA.appTour.src} poster={MEDIA.appTour.poster} title="Estate Transformation app tour" />
        </Chapter>

        <Chapter label="On the day" id="ready" title="Three small things.">
          <RuledList
            items={[
              {
                title: "Join on a computer",
                body: <p>The slides are easier to read on a bigger screen than on a phone.</p>,
              },
              {
                title: "Allow about an hour",
                body: <p>About {WEBINAR.lengthMinutes} minutes, with time at the end for your questions.</p>,
              },
              {
                title: "Bring your questions",
                body: <p>Write them down as they come to you. Michael answers as many as he can.</p>,
              },
            ]}
          />
          {CONTACT.textFromNumber ? (
            <p className={p.textFrom}>
              Reminders come by text from <strong>{CONTACT.textFromNumber}</strong>. Save it so you recognise it.
            </p>
          ) : null}
        </Chapter>
      </main>
      <SiteFooter />
    </>
  );
}
