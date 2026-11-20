"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import NdaForm from "./NdaForm";
import { Button } from "./ui";
import s from "./ndaUnlock.module.css";

/**
 * "Sign the NDA" button that opens the NDA in a pop-up on the same page. When they sign,
 * the server records it (tag nda-signed, stage NDA Signed) and the page refreshes in place,
 * so the locked data room and resources open without leaving the page.
 */
export default function NdaUnlock({
  title,
  paragraphs,
  placeholder,
  label = "Sign the NDA to unlock",
  variant = "gold",
  autoOpenWhenVisible,
}: {
  title: string;
  paragraphs: string[];
  placeholder: boolean;
  label?: string;
  variant?: "gold" | "ink" | "ghost";
  /** Id of an element: open the pop-up by itself once, the first time it scrolls into view. */
  autoOpenWhenVisible?: string;
}) {
  const router = useRouter();
  const ref = useRef<HTMLDialogElement>(null);
  const [done, setDone] = useState(false);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!autoOpenWhenVisible || !mounted) return;
    const el = document.getElementById(autoOpenWhenVisible);
    if (!el) return;
    let shown = false;
    try {
      shown = sessionStorage.getItem("jgi_nda_prompted") === "1";
    } catch {
      /* ignore */
    }
    if (shown) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          try {
            sessionStorage.setItem("jgi_nda_prompted", "1");
          } catch {
            /* ignore */
          }
          window.setTimeout(() => {
            if (!document.querySelector("dialog[open]")) ref.current?.showModal();
          }, 600);
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [autoOpenWhenVisible, mounted]);

  function signed() {
    setDone(true);
    router.refresh();
    window.setTimeout(() => ref.current?.close(), 1400);
  }

  return (
    <>
      <Button type="button" variant={variant} onClick={() => ref.current?.showModal()}>
        {label}
      </Button>
      {mounted
        ? createPortal(
      <dialog ref={ref} className={s.dialog} aria-labelledby={titleId}>
        <div className={s.head}>
          <div>
            <p className={s.kicker}>Opens the full data room</p>
            <h2 id={titleId} className={s.title}>
              Sign the NDA
            </h2>
          </div>
          <button type="button" className={s.close} onClick={() => ref.current?.close()}>
            Not now
          </button>
        </div>
        {done ? (
          <p className={s.done} role="status">
            Signed. Thank you. The data room is open on this page now.
          </p>
        ) : (
          <>
            <p className={s.lead}>
              Read it, tick the box and type your full name. It takes about a minute. Once signed, everything locked
              on this page opens straight away: the proforma, cap table, prospectus, pitch deck and more.
            </p>
            <NdaForm title={title} paragraphs={paragraphs} placeholder={placeholder} inline onSigned={signed} />
          </>
        )}
      </dialog>,
            document.body,
          )
        : null}
    </>
  );
}
