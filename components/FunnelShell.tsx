import type { ReactNode } from "react";
import { ghlIsLive } from "@/lib/ghl";
import { SiteFooter, SiteHeader } from "./Chrome";
import s from "./shell.module.css";
import { DryRunBanner, FunnelSteps } from "./ui";

/** Shared frame for the application, booking, NDA and confirmation steps. */
export default function FunnelShell({
  step,
  eyebrow,
  title,
  intro,
  children,
  wide,
}: {
  step?: 0 | 1 | 2;
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <>
      <DryRunBanner live={ghlIsLive()} />
      <SiteHeader minimal />
      <main id="main" className={s.main}>
        <div className={wide ? s.wide : s.narrow}>
          {step !== undefined ? <FunnelSteps current={step} /> : null}
          {eyebrow ? <p className={s.kicker}>{eyebrow}</p> : null}
          <h1 className={s.title}>{title}</h1>
          {intro ? <div className={s.intro}>{intro}</div> : null}
          {children}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
