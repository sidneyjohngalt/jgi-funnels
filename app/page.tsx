import { SiteFooter, SiteHeader } from "@/components/Chrome";
import { BriefingHero, Chapter, Faq, ForWhom, Host, RuledList } from "@/components/sections";
import StickyCta from "@/components/StickyCtaSmart";
import { RaiseProgress } from "@/components/ui";
import Video from "@/components/Video";
import { WebinarKitForm, WebinarKitScript } from "@/components/WebinarKit";
import { MEDIA, WEBINAR, WEBINARKIT } from "@/content/investor";
import p from "./lander.module.css";

const WATCH = ["register", "register-again"];
const MICHAEL =
  "https://s3.amazonaws.com/webflow-prod-assets/6ace6cba9e3d2ce35f9649e8/6af36f443a10b9a7d7c26390_team-michael-gegelman.webp";

/**
 * Investor funnel, step 1: briefing registration.
 * One job: get the right people to register. Six parts, two to three scrolls.
 */
export default function Lander() {
  const formHtml = WEBINARKIT.registration?.html ?? null;

  const registerPanel = (id: string) => (
    <div className={p.panel}>
      <div className={p.panelHead}>
        <h2 className={p.panelTitle}>Save your seat</h2>
        <p className={p.panelWhen}>
          {WEBINAR.scheduleNote ?? "Pick the session that suits you on the next screen."}
        </p>
      </div>
      <WebinarKitForm html={formHtml} id={id} />
      <p className={p.privacy}>
        We use your details only to send your link, reminders and the replay. Unsubscribe at any time.
      </p>
    </div>
  );

  return (
    <>
      <SiteHeader />
      <main id="main">
        <BriefingHero
          kicker="The Stakeholder Briefing"
          meta={`Online · About ${WEBINAR.lengthMinutes} minutes · Free`}
          title={
            <>
              Hear the plan from the man who built it. <em>Then decide for yourself.</em>
            </>
          }
          intro={
            <>
              <p>
                CEO Michael Gegelman walks through version 4.0 of Estate Transformation, the phone-first app that helps
                families leave a finished file instead of a project, and the raise that takes it to market.
              </p>
              <p className={p.forLine}>
                For financial advisors, family offices, angel investors and private individuals.
              </p>
            </>
          }
          footnote={<RaiseProgress light />}
          aside={registerPanel("register")}
        />

        <Chapter label="Your host" id="host" title="Twenty five years on one question.">
          <div className={p.hostGrid}>
            <Video
              src={MEDIA.landerIntro}
              title="Michael on what the briefing covers"
              placeholderNote="60 to 90 seconds: Michael on what the briefing covers and who it is for."
            />
            <Host
              name="Michael Gegelman"
              role="Founder and CEO, John Galt Institute"
              photo={MICHAEL}
              body={
                <p>
                  How do you leave your family a finished file instead of a project? Michael built the first organizer
                  in 2001 and took it to about 400 advisor offices. In 2021 he spent 18 months settling his own
                  parents&apos; estate. Version 4.0 is what he wished they had.
                </p>
              }
              timeline={[
                { when: "2001", what: "Builds the first organizer" },
                { when: "v2.0", what: "About 400 advisor offices" },
                { when: "2021", what: "18 months settling his parents' estate" },
                { when: "v4.0", what: "Everything on the phone" },
              ]}
            />
          </div>
        </Chapter>

        <Chapter label="What you will hear" id="what" title="Three things to take away.">
          <RuledList
            items={[
              {
                title: "The problem",
                body: <p>Why settling an estate still takes families months, and what it costs them.</p>,
              },
              {
                title: "The plan",
                body: (
                  <p>
                    The version 4.0 app, Advisor Transformation for advisors, what the raise funds, and how
                    contractual participation units work.
                  </p>
                ),
              },
              {
                title: "The next step",
                body: (
                  <p>
                    How to apply for a one to one call with Michael and see the private data room, if you want to look
                    closer.
                  </p>
                ),
              },
            ]}
          />
        </Chapter>

        <Chapter label="Who should come" id="who" title="Is this for you?">
          <ForWhom
            yes={[
              "Financial advisors and RIAs",
              "Family offices",
              "Angel investors",
              "Private individuals who back early companies",
            ]}
            no={[
              "Anyone looking for quick or promised returns",
              "Anyone who wants a sales pitch rather than the facts",
              "Anyone not ready to do their own due diligence",
            ]}
          />
        </Chapter>

        <Chapter label="Before you register" id="faq" title="Fair questions.">
          <Faq
            items={[
              {
                q: "Will I be asked to commit to anything?",
                a: (
                  <p>
                    No. It is a briefing. If you want to go further afterwards, you can apply for a call with Michael.
                  </p>
                ),
              },
              {
                q: "What if I cannot make the time?",
                a: <p>Register anyway. Everyone who registers gets the replay.</p>,
              },
              {
                q: "Where are the terms?",
                a: <p>Terms and eligibility are shared at the briefing and in the private data room.</p>,
              },
              {
                q: "Is this advice?",
                a: (
                  <p>
                    No. John Galt Institute does not give legal, tax or investment advice. Please speak with your own
                    advisors before you decide anything.
                  </p>
                ),
              },
            ]}
          />
        </Chapter>

        <section className={`${p.final} dark`} aria-labelledby="final-title">
          <div className={p.finalInner}>
            <div>
              <h2 id="final-title" className={p.finalTitle}>
                An hour with the founder. <em>No obligation after it.</em>
              </h2>
              <p className={p.finalNote}>About {WEBINAR.lengthMinutes} minutes, with time for your questions.</p>
            </div>
            {registerPanel("register-again")}
          </div>
        </section>
      </main>
      <SiteFooter />
      <div className={p.stickySpace} aria-hidden="true" />
      <StickyCta href="#register" label="Save my seat" watch={WATCH} />
      <WebinarKitScript script={WEBINARKIT.registration?.script ?? null} />
    </>
  );
}
