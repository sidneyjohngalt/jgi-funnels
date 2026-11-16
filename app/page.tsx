import Image from "next/image";
import { SiteFooter, SiteHeader } from "@/components/Chrome";
import FounderFilm from "@/components/FounderFilm";
import { Agenda, Chapter, Facts, Faq, GlowHero, PhoneFrame, PhotoCards, ScrollCue } from "@/components/sections";
import StickyCta from "@/components/StickyCtaSmart";
import { ButtonLink } from "@/components/ui";
import { WebinarKitForm, WebinarKitScript } from "@/components/WebinarKit";
import { AGENDA, DISCLAIMER, FOUNDER_FILM, IMAGES, WEBINAR, WEBINARKIT } from "@/content/investor";
import p from "./lander.module.css";

const WATCH = ["register"];

/**
 * Investor funnel, step 1: briefing registration. Built from the main site's design kit:
 * glow hero, agenda with a gold rail, founder block, photo cards, ledger form, glow CTA band.
 */
export default function Lander() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <GlowHero
          backdrop={IMAGES.appCollage}
          eyebrow="Live briefing with the founder"
          title={
            <>
              Preparing America&apos;s wealth <em>for transfer.</em>
            </>
          }
          lead={
            <p>
              An hour with CEO Michael Gegelman on why estates stall, the app built to fix it, and how advisors and
              investors can take part.
            </p>
          }
        >
          <div className={p.heroActions}>
            <ButtonLink href="#register" variant="gold">
              Save my seat
            </ButtonLink>
            <span className={p.meta}>About {WEBINAR.lengthMinutes} minutes · Online · Free</span>
          </div>
          <ScrollCue href="#agenda" label="See what you will hear" />
        </GlowHero>

        <Chapter
          id="agenda"
          label="What you will hear"
          title="Sixty minutes, four parts."
          intro={<p>The problem, the story, the platforms and the Venture Studio, with live questions at the end.</p>}
        >
          <Agenda
            items={AGENDA.map((a) => ({ label: a.label, title: a.title, body: <p>{a.body}</p> }))}
            aside={<PhoneFrame src={IMAGES.appDashboard} alt="Estate Transformation app, dashboard" />}
          />
        </Chapter>

        <section className={`glow ${p.host}`} aria-labelledby="host-title">
          <div className={p.hostInner}>
            <figure className={p.portrait}>
              <Image
                src={IMAGES.michaelOffice}
                alt="CEO Michael J. Gegelman in his office"
                width={831}
                height={1352}
                sizes="(max-width: 900px) 70vw, 380px"
              />
            </figure>
            <div>
              <p className="eyebrow">Your host</p>
              <h2 id="host-title" className={p.hostTitle}>
                CEO Michael J. Gegelman, <em>Founder</em>
              </h2>
              <p className={p.hostBio}>
                Michael built the first organizer in 2001 and took it to about 400 advisor offices. In 2021 he spent 18
                months settling his own parents&apos; estate. Version 4.0 is what he wished they had.
              </p>
              <div className={p.film}>
                <FounderFilm {...FOUNDER_FILM} />
              </div>
            </div>
          </div>
        </section>

        <Chapter
          id="who"
          label="Who it is for"
          title="For the people who carry an estate."
          intro={
            <p>
              Financial advisors, family offices, angel investors and private individuals. Not for anyone looking for
              quick or promised returns.
            </p>
          }
        >
          <PhotoCards
            cards={[
              {
                kicker: "For families",
                title: "Estate Transformation",
                body: "One living record of what you own and who it goes to, so your family inherits a finished file.",
                img: IMAGES.canoe,
                alt: "A canoe on a still lake at dawn",
              },
              {
                kicker: "For financial advisors",
                title: "Advisor Transformation",
                body: "Bring the same record to your clients, and be the advisor the next generation keeps.",
                img: IMAGES.advisorCouple,
                alt: "An advisor in a warm consultation with an older couple",
                position: "62% 50%",
              },
            ]}
          />
        </Chapter>

        <section id="register" className={p.register} aria-labelledby="register-title">
          <div className={p.registerInner}>
            <div className={p.registerCopy}>
              <p className="eyebrow">Save your seat</p>
              <h2 id="register-title">One hour. Your questions answered live.</h2>
              <p className={p.registerLead}>
                {WEBINAR.scheduleNote ?? "Pick the session that suits you. Everyone who registers gets the replay."}
              </p>
              <Facts
                items={[
                  { k: "Raised so far", v: "$2.417M" },
                  { k: "Raise total", v: "$7.14M" },
                  { k: "Length", v: `${WEBINAR.lengthMinutes} minutes` },
                ]}
              />
              <p className={p.units}>Participation is offered in contractual participation units.</p>
            </div>
            <div className={p.registerForm}>
              <div className="panel">
                <WebinarKitForm html={WEBINARKIT.registration?.html ?? null} id="register-form" />
                <p className={p.privacy}>We use your details only to send your link, reminders and the replay.</p>
              </div>
              <div className={p.registerPhone} aria-hidden="true">
                <PhoneFrame src={IMAGES.appWho} alt="" />
              </div>
            </div>
          </div>
        </section>

        <Chapter id="faq" label="Before you register" title="Fair questions." center>
          <Faq
            items={[
              {
                q: "Will I be asked to commit to anything?",
                a: <p>No. It is a briefing. If you want to go further afterwards, you can apply for a call with Michael.</p>,
              },
              { q: "What if I cannot make the time?", a: <p>Register anyway. Everyone who registers gets the replay.</p> },
              { q: "Where are the terms?", a: <p>Terms and eligibility are shared at the briefing and in the private data room.</p> },
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

        <section className={`glow ${p.final}`} aria-labelledby="final-title">
          <p className="eyebrow">Live briefing with the founder</p>
          <h2 id="final-title" className={p.finalTitle}>
            An hour with the founder. <em>No obligation after it.</em>
          </h2>
          <ButtonLink href="#register" variant="gold">
            Save my seat
          </ButtonLink>
          <p className={p.disclaimer}>{DISCLAIMER}</p>
        </section>
      </main>
      <SiteFooter />
      <div className={p.stickySpace} aria-hidden="true" />
      <StickyCta href="#register" label="Save my seat" watch={WATCH} />
      <WebinarKitScript script={WEBINARKIT.registration?.script ?? null} />
    </>
  );
}
