"use client";

import { useEffect } from "react";
import RawEmbed from "./RawEmbed";
import s from "./webinar.module.css";

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
          <div className={s.mockFields} aria-hidden="true">
            <div className={s.mockRow}>
              <span className={s.mockField}>First name</span>
              <span className={s.mockField}>Last name</span>
            </div>
            <span className={s.mockField}>Email address</span>
            <span className={s.mockField}>Mobile number</span>
            <span className={s.mockConsent}>
              <span className={s.mockBox} />
              Yes, text me reminders about this briefing. Message and data rates may apply. Reply STOP to opt out.
            </span>
          </div>
          <a className={s.mockButton} href="/registered">
            Save my seat
          </a>
          <p className={s.mockNote} role="note">
            Preview: the live form replaces this. The button skips ahead and saves nothing.
          </p>
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
