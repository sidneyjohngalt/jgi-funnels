"use client";

import { useEffect } from "react";
import RawEmbed from "./RawEmbed";
import s from "./webinar.module.css";
import { Placeholder } from "./ui";

/**
 * WebinarKit registration form slot. Renders WebinarKit's Step 1 HTML when supplied.
 * Until then it shows a clearly marked, non-working preview of the form.
 * Place <WebinarKitScript> once, at the bottom of the page, after every form.
 */
export function WebinarKitForm({ html, id }: { html: string | null; id?: string }) {
  return (
    <div className={s.formSlot} id={id}>
      {html ? (
        <RawEmbed html={html} className={s.embed} />
      ) : (
        <div className={s.mock} aria-label="Registration form preview">
          <Placeholder
            title="Registration form"
            note="The live registration form appears here once the embed code is added. This preview does not collect anything."
          />
          <div className={s.mockFields} aria-hidden="true">
            <span className={s.mockField}>First name</span>
            <span className={s.mockField}>Email address</span>
            <span className={s.mockButton}>Save my seat</span>
          </div>
        </div>
      )}
    </div>
  );
}

/** Loads WebinarKit's Step 2 script once, after all forms on the page. */
export function WebinarKitScript({ script }: { script: string | null }) {
  useEffect(() => {
    if (!script) return;
    if (document.querySelector("[data-wk-loader]")) return;
    const holder = document.createElement("div");
    holder.setAttribute("data-wk-loader", "");
    holder.innerHTML = script;
    document.body.appendChild(holder);
    holder.querySelectorAll("script").forEach((old) => {
      const el = document.createElement("script");
      for (const a of Array.from(old.attributes)) el.setAttribute(a.name, a.value);
      if (!old.src) el.text = old.textContent ?? "";
      old.replaceWith(el);
    });
  }, [script]);
  return null;
}
