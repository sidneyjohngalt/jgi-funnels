"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import f from "./forms.module.css";
import n from "./nda.module.css";
import { Button, LinkButton } from "./ui";

export default function NdaForm({
  title,
  paragraphs,
  placeholder,
  inline,
  onSigned,
}: {
  title: string;
  paragraphs: string[];
  placeholder: boolean;
  /** Pop-up on the confirmation page: no "continue without" option, stays on the page. */
  inline?: boolean;
  onSigned?: () => void;
}) {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);

  async function submit(action: "sign" | "skip") {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/nda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, agreed, name, source: inline ? "confirmed" : "nda" }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d.ok) {
        setError(d.message || "Something went wrong. Please try again.");
        dialogRef.current?.close();
        return;
      }
      if (onSigned) onSigned();
      else router.push(d.next || "/confirmed");
    } catch {
      setError("We could not reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const fullName = name.trim().split(" ").filter(Boolean).length >= 2;
  const canSign = agreed && fullName && !busy;

  return (
    <div className={n.wrap}>
      <div className={n.doc} tabIndex={0} role="region" aria-label={title}>
        {placeholder ? <p className={n.draftFlag}>Placeholder: final text from counsel to follow</p> : null}
        <h2 className={n.docTitle}>{title}</h2>
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <form
        className={f.form}
        onSubmit={(e) => {
          e.preventDefault();
          if (canSign) submit("sign");
        }}
      >
        <label className={f.check}>
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          <span>I have read this agreement and I agree to its terms.</span>
        </label>

        <label className={f.field} htmlFor="nda-name">
          <span className={f.label}>Type your full name to sign</span>
          <input
            id="nda-name"
            className={`${f.input} ${n.sig}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            placeholder="First and last name"
          />
          <span className={f.hint}>We record the date, time and internet address with your signature.</span>
        </label>

        {error ? (
          <div className={f.formError} role="alert">
            {error}
          </div>
        ) : null}

        <div className={f.actions}>
          {inline ? (
            <span />
          ) : (
            <LinkButton onClick={() => dialogRef.current?.showModal()} disabled={busy}>
              Continue without NDA
            </LinkButton>
          )}
          <Button type="submit" variant="ink" disabled={!canSign}>
            {busy ? "Signing..." : "Sign the NDA"}
          </Button>
        </div>
      </form>

      {inline ? null : (
      <dialog ref={dialogRef} className={n.dialog} aria-labelledby="skip-title">
        <h2 id="skip-title" className={n.dialogTitle}>
          Are you sure?
        </h2>
        <p>
          Signing the NDA gives you access to the full data room: proforma, cap table, prospectus and more.
        </p>
        <div className={n.dialogActions}>
          <Button type="button" variant="ink" onClick={() => dialogRef.current?.close()} autoFocus>
            Sign the NDA
          </Button>
          <Button type="button" variant="ghost" onClick={() => submit("skip")} disabled={busy}>
            Continue without due diligence
          </Button>
        </div>
      </dialog>
      )}
    </div>
  );
}
