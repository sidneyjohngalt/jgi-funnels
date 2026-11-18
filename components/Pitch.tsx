import { ACTIVE_PARTICIPATION, KEY_FIGURES, STAKEHOLDER_CLASSES, STAKEHOLDER_PATH } from "@/content/investor";
import type { ReactNode } from "react";
import { RaiseProgress } from "./ui";
import s from "./pitch.module.css";

/**
 * The funnel's shared pitch pieces, so every page says the same thing as the lander.
 * All of them are styled for a dark ground.
 */

export function KeyFigures() {
  return (
    <dl className={s.figures}>
      {KEY_FIGURES.map((x) => (
        <div key={x.label}>
          <dt>{x.label}</dt>
          <dd>{x.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** The three ways to take a seat. `highlight` marks the class an applicant chose. */
export function Seats({ highlight, compact }: { highlight?: string; compact?: boolean }) {
  return (
    <div className={compact ? `${s.seats} ${s.compact}` : s.seats}>
      {STAKEHOLDER_CLASSES.map((c) => (
        <article key={c.id} className={c.id === highlight ? `${s.seat} ${s.chosen}` : s.seat}>
          <p className={s.tag}>
            {c.who}
            {c.id === highlight ? <span className={s.yours}>Your interest</span> : null}
          </p>
          <h3>{c.name}</h3>
          <p className={s.what}>{c.what}</p>
        </article>
      ))}
    </div>
  );
}

export function RaiseBox({ note = true }: { note?: boolean }) {
  return (
    <>
      <div className={s.raiseBox}>
        <RaiseProgress />
      </div>
      {note ? <p className={s.note}>{ACTIVE_PARTICIPATION}</p> : null}
    </>
  );
}

/** The site's five steps, with the visitor's place marked. `current` is 0 based. */
export function StakeholderPath({ current }: { current: number }) {
  return (
    <ol className={s.path} aria-label="Your path to a seat">
      {STAKEHOLDER_PATH.map((label, i) => (
        <li
          key={label}
          className={i < current ? s.done : i === current ? s.now : undefined}
          aria-current={i === current ? "step" : undefined}
        >
          <span className={s.n}>{i < current ? "Done" : i === current ? "Now" : String(i + 1).padStart(2, "0")}</span>
          <span>{label}</span>
        </li>
      ))}
    </ol>
  );
}

export function PitchLabel({ children }: { children: ReactNode }) {
  return <p className={s.label}>{children}</p>;
}

/**
 * Side panel for the application, NDA and thank-you steps: restates what the visitor is
 * applying for in the lander's words, the raise, and where they are on the five steps.
 */
export function ApplyingFor({ pathCurrent, highlight }: { pathCurrent: number; highlight?: string }) {
  return (
    <>
      <p className={s.label}>What you are applying for</p>
      <h2 className={s.asideTitle}>
        A seat in the FinTech Transformation <em>Venture Studio.</em>
      </h2>
      <p className={s.asideText}>
        The Venture Studio funding the build and launch of version 4.0 of Estate Transformation and Advisor
        Transformation: the infrastructure for the $124 trillion wealth transfer.
      </p>
      <Seats compact highlight={highlight} />
      <RaiseBox note={false} />
      <p className={s.label}>Your path</p>
      <StakeholderPath current={pathCurrent} />
      <p className={s.note}>Applying is not a commitment. {ACTIVE_PARTICIPATION}</p>
    </>
  );
}
