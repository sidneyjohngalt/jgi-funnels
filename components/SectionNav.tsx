"use client";

import { useEffect, useRef, useState } from "react";
import s from "./sectionNav.module.css";

export type NavItem = { id: string; label: string };

/**
 * Sticky bar that shows every section of a long page, highlights the one in view, ticks off the
 * ones already passed and fills a progress line as the reader scrolls. Tap a step to jump to it.
 * Works on phones (the row scrolls sideways and keeps the current step in view) and desktop.
 */
export default function SectionNav({ items, label = "On this page" }: { items: NavItem[]; label?: string }) {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const barRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const offset = (barRef.current?.offsetHeight ?? 64) + 24;
      const els = items.map((it) => document.getElementById(it.id));
      let current = 0;
      els.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top - offset <= 0) current = i;
      });
      // At the very bottom, the last section counts as reached even if it is short.
      const doc = document.documentElement;
      const atBottom = window.innerHeight + window.scrollY >= doc.scrollHeight - 4;
      if (atBottom) current = items.length - 1;
      setActive(current);

      const first = els[0];
      const last = els[els.length - 1];
      if (first && last) {
        const start = first.getBoundingClientRect().top + window.scrollY - offset;
        const end = last.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
        const p = end > start ? (window.scrollY - start) / (end - start) : 1;
        setProgress(Math.max(0, Math.min(1, atBottom ? 1 : p)));
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [items]);

  // Keep the current step visible in the sideways-scrolling row on phones.
  useEffect(() => {
    const list = listRef.current;
    const li = list?.children[active] as HTMLElement | undefined;
    if (!list || !li) return;
    // Start the current step just inside the left edge, so its number is never under the fade.
    const target = li.offsetLeft - 16;
    list.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [active]);

  function go(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const offset = (barRef.current?.offsetHeight ?? 64) + 12;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: reduce ? "auto" : "smooth" });
    history.replaceState(null, "", `#${id}`);
  }

  return (
    <nav ref={barRef} className={s.bar} aria-label={label}>
      <div className={s.inner}>
        <p className={s.count} aria-live="polite">
          <span className={s.countLabel}>Step</span> {active + 1} <span className={s.of}>of {items.length}</span>
        </p>
        <ol ref={listRef} className={s.list}>
          {items.map((it, i) => {
            const state = i < active ? s.done : i === active ? s.now : "";
            return (
              <li key={it.id} className={`${s.item} ${state}`}>
                <a href={`#${it.id}`} onClick={(e) => go(e, it.id)} aria-current={i === active ? "location" : undefined}>
                  <span className={s.num} aria-hidden="true">
                    {i < active ? "✓" : i + 1}
                  </span>
                  <span className={s.text}>{it.label}</span>
                  {i < active ? <span className="sr-only"> (viewed)</span> : null}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
      <div className={s.track} aria-hidden="true">
        <div className={s.fill} style={{ transform: `scaleX(${progress})` }} />
      </div>
    </nav>
  );
}
