import Image from "next/image";
import { SiteHeader } from "@/components/Chrome";
import Countdown from "@/components/Countdown";
import FounderFilm from "@/components/FounderFilm";
import StickyCta from "@/components/StickyCtaSmart";
import { ButtonLink, RaiseProgress } from "@/components/ui";
import { WebinarKitForm, WebinarKitScript } from "@/components/WebinarKit";
import {
  AGENDA,
  DISCLAIMER,
  FOUNDER_FILM,
  IMAGES,
  KEY_FIGURES as HEAD_STATS,
  STAKEHOLDER_CLASSES as CLASSES,
  WEBINAR,
  WEBINARKIT,
} from "@/content/investor";
import { ghlIsLive } from "@/lib/ghl";
import p from "./lander.module.css";

const WATCH = ["register"];

const PROBLEM_STATS = [
  { value: "570 hours", label: "of executor work to settle an average estate" },
  { value: "44%", label: "have experienced or seen family conflict over an estate" },
  { value: "1 in 7", label: "Americans has unclaimed money or property waiting" },
  { value: "24%", label: "of Americans have a will. Far fewer have an inventory." },
];

const TIMELINE = [
  { year: "2001", text: "CEO Michael Gegelman builds the first organizer for a client named Ada." },
  { year: "2008", text: "Version 2.0 reaches about 400 advisor offices and thousands of estates." },
  { year: "2021", text: "Michael spends 18 months settling his own parents' estate." },
  { year: "Now", text: "Version 4.0: phone first, built for families and their advisors." },
];


/**
 * Stakeholder funnel, step 1: webinar opt-in page. Haynes's opt-in layout (headline, short video,
 * countdown, floating opt-in box, jump-to-form buttons on phones) with a fuller case for a cold
 * audience: what it is and why it matters in the headline, then the problem, the solution and the
 * opportunity. The headline matches the site's Venture Studio page. Three colours: charcoal, ivory, gold.
 */
export default function Lander() {
  const jump = (
    <div className={p.jump}>
      <ButtonLink href="#register" variant="gold">
        Save my free seat
      </ButtonLink>
    </div>
  );
  return (
    <div className={p.page}>
      <SiteHeader minimal />
      <main id="main" className={p.main}>
        <div className={p.glowTop} aria-hidden="true" />
        <div className={p.layout}>
          {/* Scroll 1: what it is and why it matters, then the video */}
          <header className={p.head}>
            <p className={p.theme}>
              <span className={p.live}>Live</span> Free briefing with CEO Michael Gegelman
            </p>
            <h1 className={p.h1}>
              Help build the infrastructure for the <em>$124 trillion</em> wealth transfer.
            </h1>
            <p className={p.promise}>
              A will says who inherits. It does not say where anything is. So when someone dies, their family spends an
              average of 16 months settling the estate. In this free live briefing, CEO Michael Gegelman shows you the
              problem, the phone-first platform built to fix it, and how you can take a seat in the $7.14M Venture Studio
              taking it to market.
            </p>
            <ul className={p.meta}>
              <li>Live and online</li>
              <li>About {WEBINAR.lengthMinutes} minutes</li>
              <li>Free</li>
              <li>Replay for every registrant</li>
            </ul>
            <dl className={p.stats}>
              {HEAD_STATS.map((x) => (
                <div key={x.label}>
                  <dt>{x.label}</dt>
                  <dd>{x.value}</dd>
                </div>
              ))}
            </dl>
          </header>

          <div className={p.video}>
            <FounderFilm {...FOUNDER_FILM} label="Watch first: the estate that changed everything" />
          </div>

          {/* Floating opt-in box */}
          <aside id="register" className={p.formCol} aria-labelledby="register-title">
            <div className={p.form}>
              <p className={p.formKicker}>Free live briefing</p>
              <h2 id="register-title" className={p.formTitle}>
                Save your seat
              </h2>
              <Countdown iso={WEBINAR.nextSessionIso} />
              <div className={p.formBody}>
                <WebinarKitForm html={WEBINARKIT.registration?.html ?? null} id="register-form" />
              </div>
              <p className={p.privacy}>
                Your details are used only for your link, reminders and the replay. Unsubscribe at any time.
              </p>
            </div>
          </aside>

          {/* The problem */}
          <section className={p.problem} aria-labelledby="problem-title">
            <p className={p.eyebrow}>The problem</p>
            <h2 id="problem-title" className={p.h2}>
              The hardest work starts after the funeral.
            </h2>
            <p className={p.body}>
              Wills, trusts and tax plans decide who gets what. None of them find the assets, list them or say what they
              are worth. That work waits until someone dies. Then it lands on a grieving spouse, an adult child or an
              executor, often without the one person who knew where everything was.
            </p>
            <ul className={p.statGrid}>
              {PROBLEM_STATS.map((x) => (
                <li key={x.value}>
                  <strong>{x.value}</strong>
                  <span>{x.label}</span>
                </li>
              ))}
            </ul>
            <p className={p.sources}>
              Sources: EstateExec survey of 1,200+ US adults; National Association of Unclaimed Property Administrators;
              Caring.com Wills and Estate Planning Study, 2025; Cerulli Associates, 2024. See the{" "}
              <a href="https://www.johngaltinstitute.com/claims" rel="noopener">
                claims and sources page
              </a>
              .
            </p>
          </section>

          {/* The solution */}
          <section className={p.solution} aria-labelledby="solution-title">
            <p className={p.eyebrow}>The solution</p>
            <h2 id="solution-title" className={p.h2}>
              Do the work now, while the owner can still answer.
            </h2>
            <p className={p.body}>
              Estate Transformation moves the hardest part of settlement into the owner&apos;s lifetime. Organize it now.
              Inventory it now. Value it now. Keep it current. When the day comes, the family starts with a finished
              file, not a project.
            </p>
            <div className={p.cards}>
              <article className={p.card}>
                <p className={p.cardTag}>For families</p>
                <h3>Estate Transformation</h3>
                <p>
                  A phone-first app that organizes an estate into 29 asset classes, with a labeled physical archive and a
                  home DocStation for estates with history.
                </p>
              </article>
              <article className={p.card}>
                <p className={p.cardTag}>For financial advisors</p>
                <h3>Advisor Transformation</h3>
                <p>
                  Lets advisors offer Estate Transformation to their clients, stay connected with the heirs and find
                  assets. More than 70% of heirs are likely to change advisors after inheriting.
                </p>
              </article>
            </div>
            <ol className={p.timeline} aria-label="Not starting from zero">
              {TIMELINE.map((t) => (
                <li key={t.year}>
                  <span className={p.year}>{t.year}</span>
                  <span>{t.text}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* The opportunity */}
          <section className={p.opportunity} aria-labelledby="opp-title">
            <p className={p.eyebrow}>The opportunity</p>
            <h2 id="opp-title" className={p.h2}>
              Three ways to take a seat.
            </h2>
            <p className={p.body}>
              FinTech Transformation is the Venture Studio funding the build and launch of version 4.0. We are inviting a
              small group of stakeholders who will take an active part, each bringing something different.
            </p>
            <div className={p.classes}>
              {CLASSES.map((c) => (
                <article key={c.name} className={p.classCard}>
                  <p className={p.cardTag}>{c.who}</p>
                  <h3>{c.name}</h3>
                  <p>{c.what}</p>
                </article>
              ))}
            </div>
            <div className={p.raiseBox}>
              <RaiseProgress />
            </div>
            <p className={p.sources}>
              Participation is through contractual participation units, for participants who take an active part. Terms,
              eligibility and seat availability are shared only in the briefing and the private data room.
            </p>
            {jump}
          </section>

          {/* Scroll 2: what they will learn, host */}
          <section className={p.learn} aria-labelledby="learn-title">
            <h2 id="learn-title" className={p.h2}>
              In 60 minutes, you will see
            </h2>
            <ol className={p.points}>
              {AGENDA.map((a, i) => (
                <li key={a.title}>
                  <span className={p.n}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{a.title}</h3>
                    <p>{a.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            {jump}
          </section>

          <section className={p.host} aria-labelledby="host-title">
            <Image
              className={p.hostImg}
              src={IMAGES.michaelOffice}
              alt="CEO Michael J. Gegelman"
              width={831}
              height={1352}
              sizes="(max-width: 900px) 40vw, 200px"
            />
            <div>
              <p className={p.formKicker}>Your host</p>
              <h2 id="host-title" className={p.hostName}>
                CEO Michael J. Gegelman, <em>Founder</em>
              </h2>
              <p className={p.hostBio}>
                Michael built the first organizer in 2001 and took it to about 400 advisor offices. In 2021 he spent 18
                months settling his own parents&apos; estate. Version 4.0 is what he wished they had.
              </p>
            </div>
          </section>

          {/* Scroll 3: who it is for, final call */}
          <section className={p.close} aria-labelledby="close-title">
            <h2 id="close-title" className={p.h2}>
              Who should attend
            </h2>
            <p className={p.closeText}>
              Financial advisors and RIAs, family offices, private capital partners and professionals who want to help
              build what comes next, and hear the facts from the founder first. Not for anyone looking for quick or
              promised returns.
            </p>
            {jump}
            <p className={p.disclaimer}>{DISCLAIMER}</p>
          </section>
        </div>
      </main>
      <footer className={p.footer}>
        <p>
          © {new Date().getFullYear()} John Galt Institute, Inc. · Charlotte, North Carolina ·{" "}
          <a href="https://www.johngaltinstitute.com" rel="noopener">
            johngaltinstitute.com
          </a>
        </p>
        <p>
          John Galt Institute, Inc. does not provide legal, tax or investment advice. Participation is available only
          through the private application process and definitive agreements.
        </p>
        {ghlIsLive() ? null : (
        <p className={p.preview}>
          Preview pages: <a href="/registered">Registered</a> · <a href="/replay">Replay</a> ·{" "}
          <a href="/apply">Apply and book</a> · <a href="/nda">NDA</a> · <a href="/confirmed">Confirmation</a>
        </p>
        )}
      </footer>
      <StickyCta href="#register" label="Save my free seat" watch={WATCH} />
      <WebinarKitScript script={WEBINARKIT.registration?.script ?? null} />
    </div>
  );
}
