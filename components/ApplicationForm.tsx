"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Choice } from "@/config/investor";
import f from "./forms.module.css";
import { Button } from "./ui";
import SlotPicker from "./SlotPicker";

type Answers = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  investorType: string;
  organization: string;
  state: string;
  participationInterest: string;
  decisionTiming: string;
  heardFrom: string;
  questions: string;
};

const STEP_TITLES = ["Your details", "About you", "Your interest", "Anything else", "Pick a time with Michael"];
const LAST_QUESTION = 3;
const CALENDAR = 4;
const ATTR_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "src"];

export default function ApplicationForm({
  prefill,
  investorTypes,
  participation,
  timing,
  initialStep = 0,
}: {
  initialStep?: number;
  prefill: Partial<Answers>;
  investorTypes: Choice[];
  participation: Choice[];
  timing: Choice[];
}) {
  const router = useRouter();
  const [step, setStep] = useState(initialStep);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [a, setA] = useState<Answers>({
    firstName: prefill.firstName ?? "",
    lastName: prefill.lastName ?? "",
    email: prefill.email ?? "",
    phone: prefill.phone ?? "",
    investorType: "",
    organization: "",
    state: "",
    participationInterest: "",
    decisionTiming: "",
    heardFrom: "",
    questions: "",
  });

  // Keep where people came from (webinar emails, ads) for the GHL note.
  useEffect(() => {
    try {
      const qs = new URLSearchParams(window.location.search);
      const stored = JSON.parse(sessionStorage.getItem("jgi_attr") || "{}");
      for (const k of ATTR_KEYS) if (qs.get(k)) stored[k] = qs.get(k);
      if (!stored.referrer && document.referrer) stored.referrer = document.referrer.slice(0, 200);
      sessionStorage.setItem("jgi_attr", JSON.stringify(stored));
    } catch {
      /* ignore */
    }
  }, []);

  // Carry over details typed on the sign-up page (same browser tab only), without overwriting anything.
  useEffect(() => {
    try {
      const r = JSON.parse(sessionStorage.getItem("jgi_reg") || "{}");
      setA((p) => ({
        ...p,
        firstName: p.firstName || r.firstName || "",
        lastName: p.lastName || r.lastName || "",
        email: p.email || r.email || "",
        phone: p.phone || r.phone || "",
      }));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (step > 0) headingRef.current?.focus();
  }, [step]);

  const set = (k: keyof Answers) => (e: { target: { value: string } }) => setA((p) => ({ ...p, [k]: e.target.value }));

  async function post(url: string, body: unknown) {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok && data.ok, data };
  }

  function validateStep(): Record<string, string> {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!a.firstName.trim()) e.firstName = "Please enter your first name.";
      if (!a.lastName.trim()) e.lastName = "Please enter your last name.";
      if (!/^[^ @]+@[^ @]+[.][^ @]{2,}$/.test(a.email.trim())) e.email = "Please enter a valid email address.";
      if (a.phone.replace(/[^0-9]/g, "").length < 7) e.phone = "Please enter a phone number we can reach you on.";
    }
    if (step === 1 && !a.investorType) e.investorType = "Please choose the closest match.";
    if (step === 2) {
      if (!a.participationInterest) e.participationInterest = "Please choose one.";
      if (!a.decisionTiming) e.decisionTiming = "Please choose one.";
    }
    return e;
  }

  async function next(ev: React.FormEvent) {
    ev.preventDefault();
    setFormError("");
    const e = validateStep();
    setErrors(e);
    if (Object.keys(e).length) {
      const first = Object.keys(e)[0];
      document.getElementById(`f-${first}`)?.focus();
      return;
    }
    setBusy(true);
    try {
      if (step === 0) {
        let attribution = {};
        try {
          attribution = JSON.parse(sessionStorage.getItem("jgi_attr") || "{}");
        } catch {}
        const r = await post("/api/apply/start", {
          firstName: a.firstName,
          lastName: a.lastName,
          email: a.email,
          phone: a.phone,
          attribution,
        });
        if (!r.ok) {
          if (r.data.errors) setErrors(r.data.errors);
          setFormError(r.data.message || "Please check your details and try again.");
          return;
        }
        setStep(1);
        return;
      }
      const final = step === LAST_QUESTION;
      const r = await post("/api/apply/update", { ...a, final });
      if (!r.ok) {
        setFormError(r.data.message || "Something went wrong. Please try again.");
        return;
      }
      if (final) {
        // Qualified applicants pick a time on this same page; everyone else moves on.
        if (!r.data.next || r.data.next === "/book") {
          setStep(CALENDAR);
          return;
        }
        router.push(r.data.next);
        return;
      }
      setStep(step + 1);
    } catch {
      setFormError("We could not reach the server. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  const err = (k: string) =>
    errors[k] ? (
      <span className={f.error} id={`e-${k}`}>
        {errors[k]}
      </span>
    ) : null;

  const input = (k: keyof Answers, label: string, type = "text", autoComplete?: string, optional?: boolean) => (
    <label className={f.field} htmlFor={`f-${k}`}>
      <span className={f.label}>
        {label} {optional ? <span className={f.optional}>(optional)</span> : null}
      </span>
      <input
        id={`f-${k}`}
        className={`${f.input} ${errors[k] ? f.invalid : ""}`}
        type={type}
        value={a[k]}
        onChange={set(k)}
        autoComplete={autoComplete}
        aria-invalid={!!errors[k]}
        aria-describedby={errors[k] ? `e-${k}` : undefined}
        inputMode={type === "tel" ? "tel" : type === "email" ? "email" : undefined}
      />
      {err(k)}
    </label>
  );

  const radios = (k: keyof Answers, legend: string, options: Choice[]) => (
    <fieldset className={f.fieldset} aria-describedby={errors[k] ? `e-${k}` : undefined}>
      <legend className={f.legend}>{legend}</legend>
      {options.map((o, i) => (
        <label key={o.value} className={f.choice}>
          <input
            id={i === 0 ? `f-${k}` : undefined}
            type="radio"
            name={k}
            value={o.value}
            checked={a[k] === o.value}
            onChange={set(k)}
          />
          <span>{o.label}</span>
        </label>
      ))}
      {err(k)}
    </fieldset>
  );

  if (step === CALENDAR) {
    return (
      <div className={f.form}>
        <div>
          <span className={f.stepCount}>
            Step {CALENDAR + 1} of {STEP_TITLES.length}
          </span>
          <h2 ref={headingRef} tabIndex={-1} style={{ marginTop: 8, outline: "none" }}>
            {STEP_TITLES[CALENDAR]}
          </h2>
          <p className={f.hint} style={{ marginTop: 0 }}>
            Thank you{a.firstName ? `, ${a.firstName}` : ""}. Pick a time that leaves you room to go through the
            resources first. You will get them straight after you book.
          </p>
        </div>
        <SlotPicker />
      </div>
    );
  }

  return (
    <form className={f.form} onSubmit={next} noValidate>
      <div>
        <span className={f.stepCount}>
          Step {step + 1} of {STEP_TITLES.length}
        </span>
        <h2 ref={headingRef} tabIndex={-1} style={{ marginTop: 8, outline: "none" }}>
          {STEP_TITLES[step]}
        </h2>
        {step === 0 ? (
          <p className={f.hint} style={{ marginTop: 0 }}>
            We will only use these to reach you about your application and your call.
          </p>
        ) : null}
      </div>

      {formError ? (
        <div className={f.formError} role="alert">
          {formError}
        </div>
      ) : null}

      {step === 0 ? (
        <>
          <div className={`${f.row} ${f.row2}`}>
            {input("firstName", "First name", "text", "given-name")}
            {input("lastName", "Last name", "text", "family-name")}
          </div>
          {input("email", "Email address", "email", "email")}
          {input("phone", "Phone number", "tel", "tel")}
        </>
      ) : null}

      {step === 1 ? (
        <>
          {radios("investorType", "Which best describes you?", investorTypes)}
          {input("organization", "Firm or organization", "text", "organization", true)}
          {input("state", "State, or country if outside the US", "text", "address-level1", true)}
        </>
      ) : null}

      {step === 2 ? (
        <>
          {radios("participationInterest", "Which way of taking part interests you most?", participation)}
          {radios("decisionTiming", "When would you like to make a decision?", timing)}
        </>
      ) : null}

      {step === 3 ? (
        <>
          {input("heardFrom", "How did you hear about us?", "text", undefined, true)}
          <label className={f.field} htmlFor="f-questions">
            <span className={f.label}>
              What would you most like to cover on your call? <span className={f.optional}>(optional)</span>
            </span>
            <textarea id="f-questions" className={f.textarea} value={a.questions} onChange={set("questions")} />
          </label>
        </>
      ) : null}

      <div className={f.actions}>
        {step > 0 ? (
          <button type="button" className={f.back} onClick={() => setStep(step - 1)} disabled={busy}>
            Back
          </button>
        ) : (
          <span />
        )}
        <Button type="submit" variant="ink" disabled={busy}>
          {busy ? "Saving..." : step === LAST_QUESTION ? "Continue to pick a time" : "Continue"}
        </Button>
      </div>
    </form>
  );
}
