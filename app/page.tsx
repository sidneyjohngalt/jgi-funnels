import Image from "next/image";
import { SiteHeader } from "@/components/Chrome";
import Countdown from "@/components/Countdown";
import FounderFilm from "@/components/FounderFilm";
import StickyCta from "@/components/StickyCtaSmart";
import { ButtonLink, RaiseProgress } from "@/components/ui";
import { WebinarKitForm, WebinarKitScript } from "@/components/WebinarKit";
import c from "@/components/plain.module.css";
import {
  AGENDA,
  DISCLAIMER,
  FOUNDER_FILM,
  IMAGES,
  STAKEHOLDER_CLASSES as CLASSES,
  WEBINAR,
  WEBINARKIT,
} from "@/content/investor";
import { ghlIsLive } from "@/lib/ghl";
import p from "./lander.module.css";

const WATCH = ["register"];

const PROBLEM_STATS = [
  { value: "570 hours", label: "of executor work to settle an average estate" },
  { value: "44%", label: "have seen family conflict over an estate" },
  { value: "1 in 7", label: "Americans has unclaimed money or property" },
  { value: "24%", label: "of Americans have a will. Far fewer have an inventory." },
];

/**
 * Stakeholder funnel, step 1: webinar opt-in page. Plain version, 27 Nov: one ivory column with the
 * sign-up box beside it (sticky on desktop, straight after the video on phones). Headline, video and form
 * first, then the problem, the solution, the seats, the agenda and the host, one short block each.
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
    <div className={c.page}>
      <SiteHeader minimal />
      <main id="main" className={p.layout}>
        {/* Headline and video */}
        <header className={p.head}>
          <p className={c.label}>Free live briefing with CEO Michael Gegelman</p>
          <h1 className={c.h1}>Help build the infrastructure for the $124 trillion wealth transfer.</h1>
          <p className={c.lead}>
            A will says who inherits. It does not say where anything is. In this free briefing, Michael shows you the
            problem, the app built to fix it, and how you can take a seat in the Venture Studio taking it to market.
          </p>
          <p className={p.meta}>Live and online · About {WEBINAR.lengthMinutes} minutes · Free · Replay for every registrant</p>
          <FounderFilm {...FOUNDER_FILM} label="Watch first: the estate that changed everything" />
        </header>

        {/* Sign-up box: beside the page on desktop (sticky), after the video on phones */}
        <aside id="register" className={p.formCol} aria-labelledby="register-title">
          <div className={p.form}>
            <p className={c.label}>Free live briefing</p>
            <h2 id="register-title" className={p.formTitle}>
              Save your seat
            </h2>
            <Countdown iso={WEBINAR.nextSessionIso} />
            <WebinarKitForm html={WEBINARKIT.registration?.html ?? null} id="register-form" />
            <p className={p.privacy}>Used only for your link, reminders and the replay. Unsubscribe any time.</p>
          </div>
        </aside>

        <div className={p.rest}>
          {/* The problem */}
          <section className={p.block} aria-labelledby="problem-title">
            <p className={c.label}>The problem</p>
            <h2 id="problem-title" className={c.h2}>
              The hardest work starts after the funeral.
            </h2>
            <p className={c.lead}>
              Wills and trusts decide who gets what. None of them find the assets, list them or value them. That work
              lands on the family, often without the one person who knew where everything was.
            </p>
            <ul className={p.stats}>
              {PROBLEM_STATS.map((x) => (
                <li key={x.value}>
                  <strong>{x.value}</strong>
                  <span>{x.label}</span>
                </li>
              ))}
            </ul>
            <p className={c.fine}>
              Sources: EstateExec; National Association of Unclaimed Property Administrators; Caring.com, 2025; Cerulli
              Associates, 2024. See the{" "}
              <a href="https://www.johngaltinstitute.com/claims" rel="noopener">
                claims and sources page
              </a>
              .
            </p>
          </section>

          {/* The solution */}
          <section className={p.block} aria-labelledby="solution-title">
            <p className={c.label}>The solution</p>
            <h2 id="solution-title" className={c.h2}>
              Do the work now, while the owner can still answer.
            </h2>
            <p className={c.lead}>
              Organize it now. Inventory it now. Value it now. When the day comes, the family starts with a finished file,
              not a project.
            </p>
            <ul className={c.plainList}>
              <li>
                <strong>Estate Transformation,</strong> for families: a phone-first app that organizes an estate into 29
                asset classes.
              </li>
              <li>
                <strong>Advisor Transformation,</strong> for financial advisors: offer it to clients and stay connected
                with the heirs.
              </li>
            </ul>
          </section>

          {/* The seats */}
          <section className={p.block} aria-labelledby="opp-title">
            <p className={c.label}>The opportunity</p>
            <h2 id="opp-title" className={c.h2}>
              Three ways to take a seat.
            </h2>
            <p className={c.lead}>
              FinTech Transformation is the Venture Studio funding the launch of version 4.0, for people who will take an
              active part.
            </p>
            <ul className={c.plainList}>
              {CLASSES.map((x) => (
                <li key={x.name}>
                  <strong>{x.name}.</strong> {x.what}
                </li>
              ))}
            </ul>
            <div className={p.raise}>
              <RaiseProgress light />
            </div>
            {jump}
          </section>

          {/* What they will see */}
          <section className={p.block} aria-labelledby="learn-title">
            <p className={c.label}>The briefing</p>
            <h2 id="learn-title" className={c.h2}>
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

          {/* Host */}
          <section className={p.block} aria-labelledby="host-title">
            <p className={c.label}>Your host</p>
            <div className={p.host}>
              <Image
                className={p.hostImg}
                src={IMAGES.michaelOffice}
                alt="CEO Michael J. Gegelman"
                width={831}
                height={1352}
                sizes="120px"
              />
              <div>
                <h2 id="host-title" className={p.hostName}>
                  CEO Michael J. Gegelman
                </h2>
                <p>
                  Built the first organizer in 2001 and took it to about 400 advisor offices. In 2021 he spent 18 months
                  settling his own parents&apos; estate. Version 4.0 is what he wished they had.
                </p>
              </div>
            </div>
          </section>

          {/* Who it is for */}
          <section className={p.block} aria-labelledby="close-title">
            <p className={c.label}>Who should attend</p>
            <h2 id="close-title" className={c.h2}>
              Advisors, family offices and partners who want to take part.
            </h2>
            <p className={c.lead}>Hear the facts from the founder first. Not for anyone looking for quick or promised returns.</p>
            {jump}
            <p className={c.fine}>{DISCLAIMER}</p>
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
            <a href="/api/session/reset?to=/apply">Apply and book</a> ·{" "}
            <a href="/api/session/demo?nda=signed">Confirmation (signed)</a> ·{" "}
            <a href="/api/session/demo?nda=skipped">Confirmation (skipped)</a>
          </p>
        )}
      </footer>
      <StickyCta href="#register" label="Save my free seat" watch={WATCH} />
      <WebinarKitScript script={WEBINARKIT.registration?.script ?? null} />
    </div>
  );
}
