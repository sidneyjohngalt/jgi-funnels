"use client";

import { track } from "./track";
import s from "./ui.module.css";
import { Placeholder } from "./ui";

/** Native video with large controls. Shows a placeholder when the source is not supplied yet. */
export default function Video({
  src,
  poster,
  title,
  placeholderNote,
  trackLabel,
}: {
  src: string | null;
  poster?: string;
  title: string;
  placeholderNote?: string;
  trackLabel?: string;
}) {
  if (!src) return <Placeholder video title={title} note={placeholderNote} />;
  return (
    <div className={s.video}>
      <video
        controls
        playsInline
        preload="metadata"
        poster={poster}
        aria-label={title}
        onPlay={trackLabel ? () => track("video", trackLabel) : undefined}
      >
        <source src={src} type="video/mp4" />
        Your browser cannot play this video.
      </video>
    </div>
  );
}
