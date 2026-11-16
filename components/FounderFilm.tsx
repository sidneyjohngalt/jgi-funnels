"use client";

import { useRef, useState } from "react";
import { track } from "./track";
import s from "./sections.module.css";

/** Founder film: poster with a pulsing gold play button; plays in place, starting past the silent opening. */
export default function FounderFilm({
  src,
  mobileSrc,
  poster,
  captions,
  label = "Hear my story",
  startAt = 3.2,
  trackLabel = "Founder film",
}: {
  src: string;
  mobileSrc?: string;
  poster: string;
  captions?: string;
  label?: string;
  startAt?: number;
  trackLabel?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);
  const start = () => {
    setPlaying(true);
    track("video", trackLabel);
    requestAnimationFrame(() => {
      const v = ref.current;
      if (!v) return;
      try {
        v.currentTime = startAt;
      } catch {}
      v.play().catch(() => {});
    });
  };
  return (
    <div className={s.film}>
      {playing ? (
        <video ref={ref} controls playsInline poster={poster} aria-label={label} preload="auto">
          {mobileSrc ? <source src={mobileSrc} type="video/mp4" media="(max-width: 700px)" /> : null}
          <source src={src} type="video/mp4" />
          {captions ? <track kind="captions" src={captions} srcLang="en" label="English" /> : null}
        </video>
      ) : (
        <button type="button" className={s.filmPoster} onClick={start} style={{ backgroundImage: `url(${poster})` }}>
          <span className={s.play}>
            <span className={s.playBtn} aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
              </svg>
            </span>
            {label}
          </span>
        </button>
      )}
    </div>
  );
}
