import type { ReactNode } from "react";
import type { QA } from "@/content/investor";
import { TrackedSection } from "./Tracked";
import Video from "./Video";
import c from "./plain.module.css";

/**
 * Plain question rows (27 Nov redesign): number and question, a one-line answer, "Read more" for the
 * full answer, then the video. `media` swaps in a different film for a question (for example the
 * founder film); `tracked` writes what people open to their GHL contact (confirmation page only).
 */
export default function PlainQuestions({
  items,
  media = {},
  tracked,
  placeholderNote = "1 to 3 minute answer from Michael.",
}: {
  items: QA[];
  media?: Record<string, ReactNode>;
  tracked?: boolean;
  placeholderNote?: string;
}) {
  return (
    <ol className={c.qList}>
      {items.map((q, i) => {
        const body = (
          <>
            <h3 className={c.qTitle}>
              <span className={c.qN}>{String(i + 1).padStart(2, "0")}</span>
              {q.question}
            </h3>
            <p className={c.qShort}>{q.short ?? q.answer}</p>
            {q.short ? (
              <details className={c.more}>
                <summary>Read more</summary>
                <p>{q.answer}</p>
              </details>
            ) : null}
            <div className={c.qVideo}>
              {media[q.question] ?? (
                <Video
                  src={q.src}
                  title={q.question}
                  placeholderNote={placeholderNote}
                  trackLabel={tracked ? `Question video: ${q.question}` : undefined}
                />
              )}
            </div>
          </>
        );
        return (
          <li key={q.question} className={c.q}>
            {tracked ? <TrackedSection label={`Question: ${q.question}`}>{body}</TrackedSection> : body}
          </li>
        );
      })}
    </ol>
  );
}
