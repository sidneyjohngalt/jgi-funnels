"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RawEmbed from "./RawEmbed";
import PhoneField from "./PhoneField";
import { DEFAULT_COUNTRY, toE164, validLocalNumber } from "@/lib/countries";
import s from "./webinar.module.css";

/**
 * WebinarKit registration form slot. Renders WebinarKit's Step 1 HTML when supplied.
 * Until then it shows a working test form that saves nothing and moves on to /registered.
 * Place <WebinarKitScript> once, at the bottom of the page, after every form.
 */
export function WebinarKitForm({ html, id }: { html: string | null; id?: string }) {
  return (
    <div className={s.formSlot} id={id}>
      {html ? (
        <RawEmbed html={html} className={s.embed} />
      ) : (
        <PreviewForm />
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

/**
 * Test stand-in for the WebinarKit form. Checks the fields like the real one would,
 * keeps the details in this browser tab only (to prefill the application), and saves nothing.
 */
function PreviewForm() {
  const router = useRouter();
  const [v, setV] = useState({ firstName: "", lastName: "", email: "", phone: "", consent: false });
  const [error, setError] = useState("");
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const set = (k: "firstName" | "lastName" | "email" | "phone") => (e: { target: { value: string } }) => {
    setError("");
    setV((p) => ({ ...p, [k]: e.target.value }));
  };

  function submit(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (!v.firstName.trim() || !v.lastName.trim()) return setError("Please enter your first and last name.");
    if (!/^[^@ ]+@[^@ ]+[.][^@ ]+$/.test(v.email.trim())) return setError("Please enter a valid email address.");
    if (!validLocalNumber(country, v.phone)) return setError("Please enter your mobile number, with area code.");
    setError("");
    try {
      sessionStorage.setItem(
        "jgi_reg",
        JSON.stringify({ firstName: v.firstName.trim(), lastName: v.lastName.trim(), email: v.email.trim(), phone: toE164(country, v.phone) }),
      );
    } catch {
      /* ignore */
    }
    router.push("/registered");
  }

  return (
    <form className={s.mock} onSubmit={submit} noValidate aria-label="Register for the briefing">
      <div className={s.mockFields}>
        <div className={s.mockRow}>
          <input className={s.mockField} aria-label="First name" placeholder="First name" autoComplete="given-name" value={v.firstName} onChange={set("firstName")} />
          <input className={s.mockField} aria-label="Last name" placeholder="Last name" autoComplete="family-name" value={v.lastName} onChange={set("lastName")} />
        </div>
        <input className={s.mockField} type="email" aria-label="Email address" placeholder="Email address" autoComplete="email" value={v.email} onChange={set("email")} />
        <PhoneField
          id="reg-phone"
          stacked
          country={country}
          number={v.phone}
          onCountry={setCountry}
          onNumber={(x) => set("phone")({ target: { value: x } })}
          selectClassName={s.mockField}
          inputClassName={s.mockField}
        />
        <label className={s.mockConsent}>
          <input className={s.mockBox} type="checkbox" checked={v.consent} onChange={(e) => setV((p) => ({ ...p, consent: e.target.checked }))} />
          Yes, text me reminders about this briefing. Message and data rates may apply. Reply STOP to opt out.
        </label>
      </div>
      {error ? (
        <p className={s.mockError} role="alert">
          {error}
        </p>
      ) : null}
      <button className={s.mockButton} type="submit">
        Save my seat
      </button>
      <p className={s.mockNote} role="note">
        Test form: nothing is saved or sent. The live sign-up form replaces it.
      </p>
    </form>
  );
}
