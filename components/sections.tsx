import Image from "next/image";
import type { ReactNode } from "react";
import s from "./sections.module.css";
import { Eyebrow, Section } from "./ui";

/** Reusable page sections. Each takes its copy as props so later funnels can reuse them. */

export function SplitHero({
  eyebrow,
  title,
  intro,
  aside,
  footnote,
}: {
  eyebrow: string;
  title: ReactNode;
  intro: ReactNode;
  aside: ReactNode;
  footnote?: ReactNode;
}) {
  return (
    <section className={`${s.hero} dark`} aria-labelledby="hero-title">
      <div className={s.heroInner}>
        <div className={s.heroCopy}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 id="hero-title">{title}</h1>
          <div className={s.heroIntro}>{intro}</div>
          {footnote ? <div className={s.heroFootnote}>{footnote}</div> : null}
        </div>
        <div className={s.heroAside}>{aside}</div>
      </div>
    </section>
  );
}

export function PointGrid({
  eyebrow,
  title,
  points,
  tone = "ivory",
  id,
}: {
  eyebrow?: string;
  title: string;
  points: { title: string; body: ReactNode }[];
  tone?: "ivory" | "raised";
  id?: string;
}) {
  return (
    <Section tone={tone} id={id} labelledBy={id ? `${id}-title` : undefined}>
      <div className={s.headBlock}>
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h2 id={id ? `${id}-title` : undefined}>{title}</h2>
      </div>
      <ol className={s.points}>
        {points.map((p, i) => (
          <li key={p.title} className={s.point}>
            <span className={s.pointNum}>{String(i + 1).padStart(2, "0")}</span>
            <h3>{p.title}</h3>
            <div className={s.pointBody}>{p.body}</div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function AudienceList({ title, items }: { title: string; items: string[] }) {
  return (
    <Section tone="raised" tight width="narrow">
      <h2 className={s.center}>{title}</h2>
      <ul className={s.audience}>
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </Section>
  );
}

export function HostStory({
  eyebrow,
  name,
  photo,
  body,
  timeline,
}: {
  eyebrow: string;
  name: string;
  photo: string;
  body: ReactNode;
  timeline: { when: string; what: string }[];
}) {
  return (
    <Section tone="ivory" labelledBy="host-title">
      <div className={s.host}>
        <div className={s.hostPhoto}>
          <Image src={photo} alt={name} width={800} height={800} sizes="(max-width: 860px) 70vw, 380px" />
        </div>
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 id="host-title">{name}</h2>
          <div className={s.hostBody}>{body}</div>
        </div>
      </div>
      <ol className={s.timeline} aria-label="Track record">
        {timeline.map((t) => (
          <li key={t.when}>
            <span className={s.when}>{t.when}</span>
            <span>{t.what}</span>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function Faq({ title, items }: { title: string; items: { q: string; a: ReactNode }[] }) {
  return (
    <Section tone="raised" width="narrow" labelledBy="faq-title">
      <h2 id="faq-title" className={s.center}>
        {title}
      </h2>
      <div className={s.faq}>
        {items.map((it) => (
          <details key={it.q} className={s.faqItem}>
            <summary>{it.q}</summary>
            <div className={s.faqA}>{it.a}</div>
          </details>
        ))}
      </div>
    </Section>
  );
}
