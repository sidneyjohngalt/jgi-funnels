import Image from "next/image";
import type { ReactNode } from "react";
import s from "./sections.module.css";
import { Placeholder } from "./ui";
import Video from "./Video";
import { TrackedSection } from "./Tracked";

/**
 * Reusable page sections. Each takes its copy as props so later funnels can reuse them.
 * Look: a printed briefing paper more than a web template. Hairline rules, a label column,
 * plain type, very few boxes.
 */

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/** Light hero with a masthead line, copy on the left and the form panel on the right. */
export function BriefingHero({
  kicker,
  meta,
  title,
  intro,
  aside,
  footnote,
}: {
  kicker: string;
  meta?: string;
  title: ReactNode;
  intro: ReactNode;
  aside: ReactNode;
  footnote?: ReactNode;
}) {
  return (
    <section className={s.hero} aria-labelledby="hero-title">
      <div className={s.heroInner}>
        <div className={s.masthead}>
          <span>{kicker}</span>
          {meta ? <span className={s.mastMeta}>{meta}</span> : null}
        </div>
        <div className={s.heroGrid}>
          <div className={s.heroCopy}>
            <h1 id="hero-title">{title}</h1>
            <div className={s.heroIntro}>{intro}</div>
          </div>
          <div className={s.heroAside}>{aside}</div>
          {footnote ? <div className={s.heroFootnote}>{footnote}</div> : null}
        </div>
      </div>
    </section>
  );
}

/** A section laid out like a report page: a short label in the margin, content beside it. */
export function Chapter({
  label,
  title,
  id,
  tone = "ivory",
  children,
  intro,
}: {
  label: string;
  title?: ReactNode;
  id?: string;
  tone?: "ivory" | "raised" | "dark";
  intro?: ReactNode;
  children?: ReactNode;
}) {
  const hid = id ? `${id}-title` : undefined;
  return (
    <section id={id} className={cx(s.chapter, s[tone], tone === "dark" && "dark")} aria-labelledby={hid}>
      <div className={s.chapterInner}>
        <div className={s.label}>{label}</div>
        <div className={s.body}>
          {title ? <h2 id={hid}>{title}</h2> : null}
          {intro ? <div className={s.chapterIntro}>{intro}</div> : null}
          {children}
        </div>
      </div>
    </section>
  );
}

/** Numbered rows divided by hairlines. */
export function RuledList({ items }: { items: { title: string; body: ReactNode }[] }) {
  return (
    <ol className={s.ruled}>
      {items.map((it, i) => (
        <li key={it.title}>
          <span className={s.ruledNum}>{i + 1}</span>
          <div>
            <h3>{it.title}</h3>
            <div className={s.ruledBody}>{it.body}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Who it is for, and who it is not for, side by side. */
export function ForWhom({ yes, no }: { yes: string[]; no: string[] }) {
  return (
    <div className={s.forWhom}>
      <div>
        <h3>It is for</h3>
        <ul className={s.plainList}>
          {yes.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>It is not for</h3>
        <ul className={s.plainList}>
          {no.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Host block: portrait, a few lines, and a short track record. */
export function Host({
  name,
  role,
  photo,
  body,
  timeline,
}: {
  name: string;
  role: string;
  photo: string;
  body: ReactNode;
  timeline?: { when: string; what: string }[];
}) {
  return (
    <div className={s.host}>
      <figure className={s.hostPhoto}>
        <Image src={photo} alt={name} width={640} height={640} sizes="(max-width: 860px) 60vw, 300px" />
        <figcaption>
          <strong>{name}</strong>
          <span>{role}</span>
        </figcaption>
      </figure>
      <div className={s.hostBody}>
        {body}
        {timeline ? (
          <dl className={s.timeline}>
            {timeline.map((t) => (
              <div key={t.when}>
                <dt>{t.when}</dt>
                <dd>{t.what}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </div>
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
      {items.map((v) => {
        const inner = (
          <>
            <div className={s.qvText}>
              <h3>{v.question}</h3>
              {v.minutes ? <span className={s.qvLen}>{v.minutes} min</span> : null}
            </div>
            <div className={s.qvMedia}>
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
          <em>&ldquo;Looks safe&rdquo;</em> or drag it to your Primary tab. Your reminders and links will then arrive
          where you expect them.
        </p>
      </div>
    </aside>
  );
}

/** A big, plain statement used between sections. */
export function Statement({ children, cite }: { children: ReactNode; cite?: string }) {
  return (
    <figure className={s.statement}>
      <blockquote>{children}</blockquote>
      {cite ? <figcaption>{cite}</figcaption> : null}
    </figure>
  );
}
