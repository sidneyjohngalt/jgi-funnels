import Image from "next/image";
import { SiteHeader } from "@/components/Chrome";
import Countdown from "@/components/Countdown";
import FounderFilm from "@/components/FounderFilm";
import StickyCta from "@/components/StickyCtaSmart";
import { ButtonLink } from "@/components/ui";
import { WebinarKitForm, WebinarKitScript } from "@/components/WebinarKit";
import { AGENDA, DISCLAIMER, FOUNDER_FILM, IMAGES, WEBINAR, WEBINARKIT } from "@/content/investor";
import { ghlIsLive } from "@/lib/ghl";
import p from "./lander.module.css";

const WATCH = ["register"];

/**
 * Investor funnel, step 1: webinar opt-in page, built to Jeremy Haynes's opt-in structure
 * (The Most Valuable Webinar Training, 22:58 to 28:24): a headline that alone tells them what they
 * will learn, a short video, a countdown, a floating opt-in box, two to three scrolls of supporting
 * text at most, and on phones, buttons that jump back to the form. Three colours: charcoal, ivory, gold.
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
          {/* Scroll 1: headline, promise, video */}
          <header className={p.head}>
            <p className={p.theme}>
              <span className={p.live}>Live</span> The Wealth Transfer Briefing · with CEO Michael Gegelman
            </p>
            <h1 className={p.h1}>
              Preparing America&apos;s wealth <em>for transfer.</em>
            </h1>
            <p className={p.promise}>
              In 60 minutes, see why estates stall at settlement, the phone-first platform built to fix it, and how
              advisors and investors can take part in the raise behind it.
            </p>
            <ul className={p.meta}>
              <li>About {WEBINAR.lengthMinutes} minutes</li>
              <li>Online</li>
              <li>Free</li>
              <li>Replay for every registrant</li>
            </ul>
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

          {/* Scroll 2: what they will learn, host */}
          <section className={p.learn} aria-labelledby="learn-title">
            <h2 id="learn-title" className={p.h2}>
              What you will learn
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
              <dl className={p.facts}>
                <div>
                  <dt>Raised so far</dt>
                  <dd>$2.417M</dd>
                </div>
                <div>
                  <dt>Raise total</dt>
                  <dd>$7.14M</dd>
                </div>
                <div>
                  <dt>Offered as</dt>
                  <dd>Contractual participation units</dd>
                </div>
              </dl>
            </div>
          </section>

          {/* Scroll 3: who it is for, final call */}
          <section className={p.close} aria-labelledby="close-title">
            <h2 id="close-title" className={p.h2}>
              Who should attend
            </h2>
            <p className={p.closeText}>
              Financial advisors, family offices, angel investors and private individuals who want the facts from the
              founder. Not for anyone looking for quick or promised returns.
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
