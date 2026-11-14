import { SiteFooter, SiteHeader } from "@/components/Chrome";
import { AudienceList, Faq, HostStory, PointGrid, SplitHero } from "@/components/sections";
import StickyCta from "@/components/StickyCtaSmart";
import { Card, Eyebrow, Muted, RaiseProgress, Section } from "@/components/ui";
import Video from "@/components/Video";
import { WebinarKitForm, WebinarKitScript } from "@/components/WebinarKit";
import { MEDIA, WEBINAR, WEBINARKIT } from "@/content/investor";
import p from "./lander.module.css";

const WATCH = ["register", "register-again"];

/** Investor funnel, step 1: webinar registration lander. */
export default function Lander() {
  const formHtml = WEBINARKIT.registration?.html ?? null;

  const registerCard = (id: string, heading: string) => (
    <Card className={p.registerCard}>
      <Eyebrow>Free live briefing</Eyebrow>
      <h2 className={p.registerTitle}>{heading}</h2>
      <p className={p.registerMeta}>
        About {WEBINAR.lengthMinutes} minutes, with time for your questions.
        {WEBINAR.scheduleNote ? ` ${WEBINAR.scheduleNote}.` : " Choose the time that suits you when you register."}
      </p>
      <WebinarKitForm html={formHtml} id={id} />
      <p className={p.privacy}>We use your details to send your link, reminders and the replay. Unsubscribe at any time.</p>
    </Card>
  );

  return (
    <>
      <SiteHeader />
      <main id="main">
        <SplitHero
          eyebrow="Stakeholder webinar · Venture Studio"
          title="Meet the founder. See the plan. Ask your questions."
          intro={
            <>
              <p>
                A live briefing with CEO Michael Gegelman on version 4.0 of Estate Transformation: a phone-first app that
                helps people organize, inventory and value everything they own, so their family inherits a finished
                file, not a project.
              </p>
              <p>Hear the full plan for the raise, meet the team, and decide for yourself whether to go further.</p>
            </>
          }
          footnote={<RaiseProgress />}
          aside={registerCard("register", "Save your seat")}
        />

        <PointGrid
          id="what"
          eyebrow="What you will hear"
          title="One hour, four things to take away."
          points={[
            {
              title: "The problem",
              body: (
                <p>
                  Why settling an estate takes families so long, and what Michael learned in the 18 months he spent
                  settling his own parents&apos; estate.
                </p>
              ),
            },
            {
              title: "The product",
              body: (
                <p>
                  A look at the version 4.0 app, and at Advisor Transformation, the version built for financial
                  advisors and their clients.
                </p>
              ),
            },
            {
              title: "The plan",
              body: (
                <p>
                  What the raise funds, how contractual participation units work, and how the three ways to take part
                  differ.
                </p>
              ),
            },
            {
              title: "The next step",
              body: (
                <p>
                  How to apply for a one to one call with Michael if you would like to look closer, and what you will
                  see in the private data room.
                </p>
              ),
            },
          ]}
        />

        <AudienceList
          title="Who the briefing is for"
          items={["Financial advisors and RIAs", "Family offices", "Angel investors", "Private individuals"]}
        />

        <HostStory
          eyebrow="Your host"
          name="Michael Gegelman"
          photo="https://s3.amazonaws.com/webflow-prod-assets/6ace6cba9e3d2ce35f9649e8/6af36f443a10b9a7d7c26390_team-michael-gegelman.webp"
          body={
            <>
              <p>
                Michael has spent 25 years on one question: how do you leave your family a finished file instead of a
                project?
              </p>
              <p>
                He built the first organizer in 2001. Version 2.0 reached about 400 advisor offices. Then, in 2021, he
                spent 18 months settling his own parents&apos; estate and saw how much was still left to chance. Version
                4.0 puts everything on the phone.
              </p>
            </>
          }
          timeline={[
            { when: "2001", what: "Michael builds the first organizer." },
            { when: "v2.0", what: "Reaches about 400 advisor offices." },
            { when: "2021", what: "18 months settling his own parents' estate." },
            { when: "v4.0", what: "The phone-first app." },
          ]}
        />

        <Section tone="dark" labelledBy="tour-title">
          <div className={p.tour}>
            <div>
              <Eyebrow>See the app</Eyebrow>
              <h2 id="tour-title">A short tour of version 4.0</h2>
              <Muted>Organize it now. Inventory it now. Value it now.</Muted>
            </div>
            <Video src={MEDIA.appTour.src} poster={MEDIA.appTour.poster} title="Estate Transformation app tour" />
          </div>
        </Section>

        <Faq
          title="Questions before you register"
          items={[
            {
              q: "Is it live?",
              a: (
                <p>
                  You will see the available times when you register. If none of them suit you, register anyway and we
                  will send you the replay.
                </p>
              ),
            },
            {
              q: "How long is it?",
              a: <p>About {WEBINAR.lengthMinutes} minutes, with time at the end for questions.</p>,
            },
            {
              q: "Will I be asked to commit to anything?",
              a: (
                <p>
                  No. The webinar is a briefing. If you would like to go further afterwards, you can apply for a one to
                  one call with Michael.
                </p>
              ),
            },
            {
              q: "Where are the terms?",
              a: (
                <p>
                  Terms, eligibility and seat availability are shared only at the briefing and in the private data room.
                </p>
              ),
            },
            {
              q: "Is this advice?",
              a: (
                <p>
                  No. John Galt Institute does not provide legal, tax or investment advice. Please speak with your own
                  advisors before making any decision.
                </p>
              ),
            },
          ]}
        />

        <Section tone="navy" width="narrow" labelledBy="final-title">
          <div className={p.final}>
            <h2 id="final-title" className={p.finalTitle}>
              Hear it from Michael, then decide.
            </h2>
            {registerCard("register-again", "Save your seat")}
          </div>
        </Section>
      </main>
      <SiteFooter />
      <div className={p.stickySpace} aria-hidden="true" />
      <StickyCta href="#register" label="Save my seat" watch={WATCH} />
      <WebinarKitScript script={WEBINARKIT.registration?.script ?? null} />
    </>
  );
}
