"use client";

import { useEffect, useState } from "react";
import s from "./sections.module.css";

/** Phone-only bar that keeps the main action in reach, and hides while a form is on screen. */
export default function StickyCta({ href, label, watch }: { href: string; label: string; watch: string[] }) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const els = watch.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length || typeof IntersectionObserver === "undefined") return;
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) e.isIntersecting ? visible.add(e.target) : visible.delete(e.target);
      setHidden(visible.size > 0);
    });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [watch]);
  return (
    <div className={`${s.sticky} ${hidden ? s.stickyHidden : ""}`} aria-hidden={hidden}>
      <a href={href} className={s.stickyBtn} tabIndex={hidden ? -1 : 0}>
        {label}
      </a>
    </div>
  );
}
