"use client";

import { useEffect, useRef } from "react";

/**
 * Renders third-party embed markup (WebinarKit) and makes any <script> tags in it run.
 * Scripts set through innerHTML never execute, so each one is re-created as a real element.
 *
 * WebinarKit: the Step 1 HTML can repeat on a page; the Step 2 script must load once.
 * Use `html` for the form and `script` for the loader; scripts are de-duplicated per page by src/text.
 */
const loaded = new Set<string>();

function runScripts(container: HTMLElement) {
  container.querySelectorAll("script").forEach((old) => {
    const key = old.src || old.textContent || "";
    if (key && loaded.has(key)) {
      old.remove();
      return;
    }
    const s = document.createElement("script");
    for (const attr of Array.from(old.attributes)) s.setAttribute(attr.name, attr.value);
    if (!old.src) s.text = old.textContent ?? "";
    old.replaceWith(s);
    if (key) loaded.add(key);
  });
}

export default function RawEmbed({ html, script, className }: { html: string; script?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = html + (script ?? "");
    runScripts(el);
  }, [html, script]);

  return <div ref={ref} className={className} />;
}
