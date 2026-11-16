import Image from "next/image";
import type { ReactNode } from "react";
import s from "./sections.module.css";
import { Placeholder } from "./ui";
import Video from "./Video";
import { TrackedSection } from "./Tracked";

/**
 * Reusable page sections, styled from the main site's design kit (gold glow ground, Playfair
 * headlines, gold pills, real photography). Each takes its copy as props so later funnels can reuse them.
 */

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/** Dark hero on the gold glow, with an optional faint drifting backdrop image. */
export function GlowHero({
  eyebrow,
  title,
  lead,
  children,
  backdrop,
  align = "center",
  id,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
  backdrop?: string;
  align?: "center" | "left";
  id?: string;
}) {
  return (
    <section id={id} className={cx("glow", s.glowHero, align === "left" && s.left)} aria-labelledby="hero-title">
      {backdrop ? <div className="backdrop" style={{ backgroundImage: `url(${backdrop})` }} aria-hidden="true" /> : null}
      <div className={s.glowInner}>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 id="hero-title" className={s.glowTitle}>
          {title}
        </h1>
        {lead ? <div className={s.glowLead}>{lead}</div> : null}
        {children}
      </div>
    </section>
  );
}

/** A section with the kit's type stack: eyebrow, headline, lead, then content. */
export function Chapter({
  label,
  title,
  id,
  tone = "ivory",
  children,
  intro,
  center,
}: {
  label?: string;
  title?: ReactNode;
  id?: string;
  tone?: "ivory" | "raised" | "dark" | "glow";
  intro?: ReactNode;
  children?: ReactNode;
  center?: boolean;
}) {
  const hid = id ? `${id}-title` : undefined;
  return (
    <section
      id={id}
      className={cx(s.chapter, tone === "glow" ? "glow" : s[tone], tone === "dark" && "dark", center && s.center)}
      aria-labelledby={hid}
    >
      <div className={s.chapterInner}>
        {label ? <p className="eyebrow">{label}</p> : null}
        {title ? (
          <h2 id={hid} className={s.chapterTitle}>
            {title}
          </h2>
        ) : null}
        {intro ? <div className={s.chapterIntro}>{intro}</div> : null}
        {children}
      </div>
    </section>
  );
}

/** Circle-and-arrow cue that bridges a heading into the next block. */
export function ScrollCue({ href, label }: { href: string; label: string }) {
  return (
    <a className={s.cue} href={href} aria-label={label}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 5v14M6 13l6 6 6-6" />
      </svg>
    </a>
  );
}

/** Numbered agenda with a gold rail. Optional media sits beside it on desktop. */
export function Agenda({
  items,
  aside,
}: {
  items: { label: string; title: string; body: ReactNode }[];
  aside?: ReactNode;
}) {
  return (
    <div className={cx(s.agendaWrap, !!aside && s.agendaWithAside)}>
      <ol className={s.agenda}>
        {items.map((it, i) => (
          <li key={it.title}>
            <p className={s.agendaN}>
              <b>{String(i + 1).padStart(2, "0")}</b>
              {it.label}
            </p>
            <h3>{it.title}</h3>
            <div className={s.agendaBody}>{it.body}</div>
          </li>
        ))}
      </ol>
      {aside ? <div className={s.agendaAside}>{aside}</div> : null}
    </div>
  );
}

/** Titanium-edged phone holding an app screen. */
export function PhoneFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className={s.phone}>
      <div>
        <Image src={src} alt={alt} width={540} height={1214} sizes="240px" />
      </div>
    </div>
  );
}

/** Full-bleed photo cards with a dark shade rising from the bottom. */
export function PhotoCards({
  cards,
}: {
  cards: { kicker: string; title: string; body: string; img: string; alt: string; position?: string }[];
}) {
  return (
    <div className={s.cards}>
      {cards.map((c) => (
        <figure key={c.title} className={s.card}>
          <Image src={c.img} alt={c.alt} fill sizes="(max-width: 860px) 100vw, 540px" style={{ objectPosition: c.position ?? "50% 50%" }} />
          <figcaption className={s.cardBody}>
            <span className={s.kicker}>{c.kicker}</span>
            <span className={s.cardTitle}>{c.title}</span>
            <span className={s.cardText}>{c.body}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/** Numbered rows divided by hairlines. */
export function RuledList({ items }: { items: { title: string; body: ReactNode }[] }) {
  return (
    <ol className={s.ruled}>
      {items.map((it, i) => (
        <li key={it.title}>
          <span className={s.ruledNum}>{String(i + 1).padStart(2, "0")}</span>
          <div>
            <h3>{it.title}</h3>
            <div className={s.ruledBody}>{it.body}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Faq({ items }: { items: { q: string; a: ReactNode }[] }) {
  return (
    <div className={s.faq}>
      {items.map((it) => (
        <details key={it.q} className={s.faqItem}>
          <summary>{it.q}</summary>
          <div className={s.faqA}>{it.a}</div>
        </details>
      ))}
    </div>
  );
}

export type QuestionVideo = { question: string; src: string | null; minutes?: number };

/** One short video per question, one per row, so each can be measured on its own. */
export function QuestionVideos({ items, tracked }: { items: QuestionVideo[]; tracked?: boolean }) {
  return (
    <ol className={s.qv}>
      {items.map((v, i) => {
        const inner = (
          <>
            <div className={s.qvText}>
              <span className={s.qvN}>{String(i + 1).padStart(2, "0")}</span>
              <h3>{v.question}</h3>
              {v.minutes ? <span className={s.qvLen}>{v.minutes} min</span> : null}
            </div>
            <div>
              {v.src ? (
                <Video src={v.src} title={v.question} trackLabel={tracked ? `Question video: ${v.question}` : undefined} />
              ) : (
                <Placeholder video title="Short answer from Michael" note="1 to 3 minute video. Topic to confirm with Michael." />
              )}
            </div>
          </>
        );
        return (
          <li key={v.question}>
            {tracked ? (
              <TrackedSection label={`Question video: ${v.question}`} className={s.qvRow}>
                {inner}
              </TrackedSection>
            ) : (
              <div className={s.qvRow}>{inner}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/** Small note so reminders and calendar invites do not land in spam. */
export function EmailTip({ sender }: { sender?: string }) {
  return (
    <aside className={s.tip} aria-label="Email tip">
      <span className={s.tipMark} aria-hidden="true">
        @
      </span>
      <div>
        <strong>One small thing, so our emails reach you.</strong>
        <p>
          Our emails come from {sender ?? "the John Galt Institute team"}. If you use Gmail and see{" "}
          <em>&ldquo;Be careful with this message&rdquo;</em> or the email lands in Promotions, choose{" "}
          <em>&ldquo;Looks safe&rdquo;</em> or drag it to your Primary tab.
        </p>
      </div>
    </aside>
  );
}

/** Raise progress and other small facts in a single ledger line. */
export function Facts({ items }: { items: { k: string; v: string }[] }) {
  return (
    <dl className={s.facts}>
      {items.map((f) => (
        <div key={f.k}>
          <dt>{f.k}</dt>
          <dd>{f.v}</dd>
        </div>
      ))}
    </dl>
  );
}
