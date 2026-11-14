"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { track } from "./track";

/** Records a section as viewed once at least 40% of it has been on screen for 1.5 seconds. */
export function TrackedSection({ label, children, className, id }: { label: string; children: ReactNode; className?: string; id?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => {
            track("section", label);
            io.disconnect();
          }, 1500);
        } else if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [label]);
  return (
    <div ref={ref} className={className} id={id}>
      {children}
    </div>
  );
}

/** A document link that records the open on the contact. Shows a marked placeholder when the link is missing. */
export function TrackedDoc({ label, href, className, pendingClassName }: { label: string; href: string | null; className?: string; pendingClassName?: string }) {
  if (!href) {
    return (
      <span className={pendingClassName} aria-label={`${label}: link to come`}>
        {label} <em>(link to come)</em>
      </span>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener" className={className} onClick={() => track("doc", label)}>
      {label} <span aria-hidden="true">→</span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
