import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import s from "./ui.module.css";

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/* ---------------- Section ---------------- */
export function Section({
  tone = "ivory",
  width = "wide",
  tight,
  id,
  children,
  className,
  labelledBy,
}: {
  tone?: "ivory" | "raised" | "dark" | "navy" | "green";
  width?: "wide" | "narrow";
  tight?: boolean;
  id?: string;
  children: ReactNode;
  className?: string;
  labelledBy?: string;
}) {
  const dark = tone === "dark" || tone === "navy" || tone === "green";
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cx(tight ? s.sectionTight : s.section, s[tone], dark && "dark", className)}
    >
      <div className={width === "narrow" ? s.narrow : s.inner}>{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <span className={s.eyebrow}>{children}</span>;
}

export function Lead({ children, muted }: { children: ReactNode; muted?: boolean }) {
  return <p className={cx(s.lead, muted && s.muted)}>{children}</p>;
}

export function Muted({ children, as: As = "p" }: { children: ReactNode; as?: "p" | "span" | "div" }) {
  return <As className={s.muted}>{children}</As>;
}

/* ---------------- Buttons ---------------- */
type BtnVariant = "ink" | "gold" | "ghost";
const variantClass = (v: BtnVariant) => (v === "gold" ? s.btnGold : v === "ghost" ? s.btnGhost : "");

export function ButtonLink({
  href,
  variant = "ink",
  block,
  children,
  ...rest
}: { href: string; variant?: BtnVariant; block?: boolean; children: ReactNode } & Omit<ComponentProps<"a">, "href">) {
  const cls = cx(s.btn, variantClass(variant), block && s.btnBlock);
  if (href.startsWith("#") || href.startsWith("http")) {
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "ink",
  block,
  className,
  ...rest
}: { variant?: BtnVariant; block?: boolean } & ComponentProps<"button">) {
  return <button className={cx(s.btn, variantClass(variant), block && s.btnBlock, className)} {...rest} />;
}

export function LinkButton(props: ComponentProps<"button">) {
  return <button type="button" className={s.linkBtn} {...props} />;
}

/* ---------------- Card ---------------- */
export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx(s.card, className)}>{children}</div>;
}

/* ---------------- Placeholder ---------------- */
/** A clearly marked slot for anything not yet supplied. Every one is listed in README. */
export function Placeholder({
  title,
  note,
  video,
  minHeight,
}: {
  title: string;
  note?: string;
  video?: boolean;
  minHeight?: number;
}) {
  return (
    <div
      className={cx(s.placeholder, video && s.videoPh)}
      style={minHeight ? { minHeight } : undefined}
      role="note"
      aria-label={`Placeholder: ${title}`}
    >
      <span className={s.placeholderTag}>Placeholder</span>
      <span className={s.placeholderTitle}>{title}</span>
      {note ? <span className={s.placeholderNote}>{note}</span> : null}
    </div>
  );
}

/* ---------------- Raise progress ---------------- */
export const RAISE = { total: 7_140_000, raised: 2_417_000, remaining: 4_719_984 };

export function RaiseProgress() {
  const pct = Math.round((RAISE.raised / RAISE.total) * 100);
  return (
    <div className={s.raise} aria-label={`$2.417M raised of $7.14M, ${pct} percent committed`}>
      <div className={s.raiseNums}>
        <span>
          <strong>$2.417M</strong> raised
        </span>
        <span>
          of <strong>$7.14M</strong>
        </span>
      </div>
      <div className={s.raiseBar} aria-hidden="true">
        <div className={s.raiseFill} style={{ width: `${pct}%` }} />
      </div>
      <Muted as="span">
        {pct}% committed · $4,719,984 to go, in contractual participation units
      </Muted>
    </div>
  );
}

/* ---------------- Funnel steps ---------------- */
const FUNNEL_STEPS = ["Apply", "Book your call", "Sign the NDA", "Prepare"] as const;

export function FunnelSteps({ current }: { current: 0 | 1 | 2 | 3 }) {
  return (
    <ol className={s.steps} aria-label="Your progress">
      {FUNNEL_STEPS.map((label, i) => (
        <li
          key={label}
          className={cx(s.step, i === current && s.stepActive, i < current && s.stepDone)}
          aria-current={i === current ? "step" : undefined}
        >
          <span className={s.stepNum}>{i < current ? "✓" : i + 1}</span>
          <span>{label}</span>
        </li>
      ))}
    </ol>
  );
}

export function DryRunBanner({ live }: { live: boolean }) {
  if (live) return null;
  return (
    <div className={s.devBanner} role="status">
      Preview mode: these forms are not connected yet. Nothing you enter is saved or sent.
    </div>
  );
}

export { s as uiStyles, cx };
