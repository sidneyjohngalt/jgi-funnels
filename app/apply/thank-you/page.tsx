import type { Metadata } from "next";
import FunnelShell from "@/components/FunnelShell";
import { ButtonLink } from "@/components/ui";

export const metadata: Metadata = { title: "Thank you" };

/**
 * Shown to applicants who do not meet the qualification criteria. They get the nurture tag in GHL.
 * No ad pixel fires here. Copy needs Sidney's approval.
 */
export default function NotQualified() {
  return (
    <FunnelShell
      eyebrow="Application received"
      title="Thank you for applying."
      intro={
        <>
          <p>
            We have your answers. Right now, calls with Michael are open to a small group of stakeholders whose plans
            fit this stage of the Venture Studio.
          </p>
          <p>
            We would like to keep you close. We will send you short updates on the Venture Studio and the app, about
            once a month, and you can reply to any of them with a question. As version 4.0 moves toward launch, a seat
            may open that fits you.
          </p>
        </>
      }
    >
      <div className="panel">
        <h2>In the meantime</h2>
        <p>Watch the full briefing again, or read the story of Estate Transformation and the people behind it.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <ButtonLink href="/replay" variant="ink">
            Watch the replay
          </ButtonLink>
          <ButtonLink href="https://www.johngaltinstitute.com" variant="ghost">
            Visit johngaltinstitute.com
          </ButtonLink>
        </div>
      </div>
    </FunnelShell>
  );
}
