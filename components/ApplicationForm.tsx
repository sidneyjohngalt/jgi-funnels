"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { Choice } from "@/config/investor";
import f from "./forms.module.css";
import { Button } from "./ui";
import SlotPicker from "./SlotPicker";
import PhoneField from "./PhoneField";
import { splitPhone, toE164, validLocalNumber } from "@/lib/countries";

type Answers = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  investorType: string;
  organization: string;
  state: string;
  participationInterest: string;
  heardFrom: string;
  questions: string;
};

const STEP_COUNT = 5;
/** Shown under the progress bar: a sense of how little is left keeps people going. */
const TIME_LEFT = ["About 2 minutes", "About a minute left", "Under a minute left", "Nearly there", "Last step"];
const LAST_QUESTION = 3;
const CALENDAR = 4;
const ATTR_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "src"];

export default function ApplicationForm({
  prefill,
  investorTypes,
  participation,
  initialStep = 0,
  fromWebinar = false,
}: {
  initialStep?: number;
  /** True on the webinar replay page: the source is the webinar unless a UTM says otherwise. */
  fromWebinar?: boolean;
  prefill: Partial<Answers>;
  investorTypes: Choice[];
  participation: Choice[];
}) {
  const router = useRouter();
  const [step, setStep] = useState(initialStep);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const advanceTimer = useRef<number | undefined>(undefined);
  const [phoneCountry, setPhoneCountry] = useState(() => splitPhone(prefill.phone ?? "").iso);
  const [a, setA] = useState<Answers>({
    firstName: prefill.firstName ?? "",
    lastName: prefill.lastName ?? "",
    email: prefill.email ?? "",
    phone: splitPhone(prefill.phone ?? "").number,
    investorType: "",
    organization: "",
    state: "",
    participationInterest: "",
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
      // Came through the webinar pages (replay, or the lander sign-up in this tab): source is the webinar.
      if (!stored.utm_source && !stored.src && (fromWebinar || sessionStorage.getItem("jgi_reg"))) stored.src = "webinar";
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
        phone: p.phone || (r.phone ? splitPhone(r.phone).number : ""),
      }));
      if (r.phone && !prefill.phone) setPhoneCountry(splitPhone(r.phone).iso);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (step > 0) headingRef.current?.focus();
  }, [step]);

  // Keep answers in this tab, so a refresh or a slip of the back button loses nothing.
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem("jgi_app") || "{}");
      setA((p) => {
        const out = { ...p };
        for (const k of Object.keys(out) as (keyof Answers)[]) if (!out[k] && typeof saved[k] === "string") out[k] = saved[k];
        return out;
      });
    } catch {
      /* ignore */
    }
  }, []);
  useEffect(() => {
    try {
      sessionStorage.setItem("jgi_app", JSON.stringify(a));
    } catch {
      /* ignore */
    }
  }, [a]);
  useEffect(() => () => window.clearTimeout(advanceTimer.current), []);

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
      if (!validLocalNumber(phoneCountry, a.phone)) e.phone = "Please enter your mobile number, with area code.";
    }
    if (step === 1 && !a.investorType) e.investorType = "Please choose the closest match.";
    if (step === 2 && !a.participationInterest) e.participationInterest = "Please choose one.";
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
          phone: toE164(phoneCountry, a.phone),
          smsConsent,
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

  /** Choice cards. On one-question steps, picking an answer moves on by itself. */
  const radios = (k: keyof Answers, legend: string, options: Choice[], autoAdvance = false) => (
    <fieldset className={f.fieldset} aria-describedby={errors[k] ? `e-${k}` : undefined}>
      <legend className="sr-only">{legend}</legend>
      {options.map((o, i) => {
        const [title, ...rest] = o.label.split(": ");
        const sub = rest.join(": ");
        return (
          <label key={o.value} className={f.choice}>
            <input
              id={i === 0 ? `f-${k}` : undefined}
              type="radio"
              name={k}
              value={o.value}
              checked={a[k] === o.value}
              onChange={(e) => {
                set(k)(e);
                setErrors((x) => ({ ...x, [k]: "" }));
                if (autoAdvance) {
                  window.clearTimeout(advanceTimer.current);
                  advanceTimer.current = window.setTimeout(() => formRef.current?.requestSubmit(), 380);
                }
              }}
            />
            <span className={f.choiceText}>
              <strong>{title}</strong>
              {sub ? <span>{sub.charAt(0).toUpperCase() + sub.slice(1)}</span> : null}
            </span>
            <span className={f.tick} aria-hidden="true" />
          </label>
        );
      })}
      {err(k)}
    </fieldset>
  );

  const first = a.firstName.trim();
  const heads: { title: ReactNode; sub: ReactNode }[] = [
    {
      title: "Let’s start with you.",
      sub: "We use these only to reach you about your application and your call.",
    },
    {
      title: first ? `Thanks, ${first}. Which best describes you?` : "Which best describes you?",
      sub: "Pick the closest. You can tell Michael more on the call.",
    },
    {
      title: "Which seat interests you most?",
      sub: "“Not sure yet” is a perfectly good answer. Michael will help you decide.",
    },
    {
      title: "Anything Michael should know?",
      sub: "All optional. Add a line or two, or go straight to picking a time.",
    },
    {
      title: first ? `Last step, ${first}: pick a time with Michael.` : "Last step: pick a time with Michael.",
      sub: "Choose a time that leaves you room to go through the resources first. You get them the moment you book.",
    },
  ];

  const progress = (
    <div className={f.progress}>
      <div className={f.progressTop}>
        <span className={f.stepCount}>
          Step {step + 1} of {STEP_COUNT}
        </span>
        <span className={f.timeLeft}>{TIME_LEFT[step]}</span>
      </div>
      <div
        className={f.track}
        role="progressbar"
        aria-label="Application progress"
        aria-valuemin={0}
        aria-valuemax={STEP_COUNT}
        aria-valuenow={step + 1}
      >
        {/* Starts part-filled: people finish what they feel they have already begun. */}
        <div className={f.fill} style={{ width: `${Math.round(((step + 1) / STEP_COUNT) * 100)}%` }} />
      </div>
    </div>
  );

  const head = (
    <div className={f.head}>
      {progress}
      <h2 ref={headingRef} tabIndex={-1} className={f.q}>
        {heads[step].title}
      </h2>
      <p className={f.qSub}>{heads[step].sub}</p>
    </div>
  );

  if (step === CALENDAR) {
    return (
      <div className={f.form} key="calendar">
        <div className={f.stepAnim}>
          {head}
          <SlotPicker />
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} className={f.form} onSubmit={next} noValidate>
      <div className={f.stepAnim} key={step}>
        {head}

        {formError ? (
          <div className={f.formError} role="alert">
            {formError}
          </div>
        ) : null}

        <div className={f.fields}>
          {step === 0 ? (
            <>
              <div className={`${f.row} ${f.row2}`}>
                {input("firstName", "First name", "text", "given-name")}
                {input("lastName", "Last name", "text", "family-name")}
              </div>
              {input("email", "Email address", "email", "email")}
              <div className={f.field}>
                <PhoneField
                  country={phoneCountry}
                  number={a.phone}
                  onCountry={setPhoneCountry}
                  onNumber={(v) => setA((p) => ({ ...p, phone: v }))}
                  showLabels={{ country: "Country", labelClassName: f.label }}
                  selectClassName={f.input}
                  inputClassName={`${f.input} ${errors.phone ? f.invalid : ""}`}
                  invalid={!!errors.phone}
                  describedBy={errors.phone ? "e-phone" : undefined}
                />
                {err("phone")}
              </div>
              {/* SMS consent wording from CRM (A2P-ready, board 20 Nov 10:24). Optional and unticked. Counsel reviews later. */}
              <label className={f.check} htmlFor="f-smsConsent">
                <input id="f-smsConsent" type="checkbox" checked={smsConsent} onChange={(e) => setSmsConsent(e.target.checked)} />
                <span className={f.checkText}>
                  I agree to receive text messages from John Galt Institute about my application and my call with
                  Michael. Message frequency varies. Message and data rates may apply. Reply STOP to opt out, HELP for
                  help. Consent is not a condition of applying. See our{" "}
                  <a href="https://www.johngaltinstitute.com/privacy-policy" target="_blank" rel="noopener">
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a href="https://www.johngaltinstitute.com/terms-of-use" target="_blank" rel="noopener">
                    Terms
                  </a>
                  .
                </span>
              </label>
              <p className={f.reassure}>Private. Never shared or sold. Applying is not a commitment.</p>
            </>
          ) : null}

          {step === 1 ? radios("investorType", "Which best describes you?", investorTypes, true) : null}

          {step === 2 ? radios("participationInterest", "Which seat interests you most?", participation, true) : null}

          {step === 3 ? (
            <>
              <div className={`${f.row} ${f.row2}`}>
                {input("organization", "Firm or organization", "text", "organization")}
                {input("state", "State or country", "text", "address-level1")}
              </div>
              {input("heardFrom", "How did you hear about us?", "text")}
              <label className={f.field} htmlFor="f-questions">
                <span className={f.label}>What would you most like to cover on your call?</span>
                <textarea id="f-questions" className={f.textarea} value={a.questions} onChange={set("questions")} />
              </label>
            </>
          ) : null}
        </div>

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
        {step === 0 ? (
          <p className={f.consent}>
            By continuing, you agree that John Galt Institute may email you about your application and your call. You
            can unsubscribe at any time.
          </p>
        ) : null}
        {step === 1 || step === 2 ? <p className={f.autoNote}>Tap an answer to continue.</p> : null}
      </div>
    </form>
  );
}
