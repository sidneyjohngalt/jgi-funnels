import type { ReactNode } from "react";
import { ghlIsLive } from "@/lib/ghl";
import { SiteFooter, SiteHeader } from "./Chrome";
import s from "./shell.module.css";
import { DryRunBanner, FunnelSteps } from "./ui";

/**
 * Shared frame for the application, NDA and thank-you steps. Same dark, gold-glow ground as the
 * lander so the funnel feels like one place. Forms sit in ivory panels. An optional `aside`
 * restates what the visitor is applying for (sticky beside the form on desktop).
 */
export default function FunnelShell({
  step,
  eyebrow,
  title,
  intro,
  children,
  aside,
  wide,
}: {
  step?: 0 | 1 | 2;
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  aside?: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={s.page}>
      <DryRunBanner live={ghlIsLive()} />
      <SiteHeader minimal />
      <main id="main" className={s.main}>
        <div className={s.glow} aria-hidden="true" />
        <div className={aside ? s.split : wide ? s.wide : s.narrow}>
          <div className={s.primary}>
            {step !== undefined ? (
              <div className={s.stepsWrap}>
                <FunnelSteps current={step} />
              </div>
            ) : null}
            {eyebrow ? <p className={s.kicker}>{eyebrow}</p> : null}
            <h1 className={s.title}>{title}</h1>
            {intro ? <div className={s.intro}>{intro}</div> : null}
            {children}
          </div>
          {aside ? <aside className={s.aside}>{aside}</aside> : null}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
