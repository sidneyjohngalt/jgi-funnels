import type { Metadata } from "next";
import FunnelShell from "@/components/FunnelShell";
import { ButtonLink, Card } from "@/components/ui";

export const metadata: Metadata = { title: "Thank you" };

/** Shown to applicants who do not meet the qualification criteria. They get the nurture tag in GHL. */
export default function NotQualified() {
  return (
    <FunnelShell
      eyebrow="Application received"
      title="Thank you for applying."
      intro={
        <p>
          We have your answers. Right now, calls with Michael are open to a small group whose plans fit this stage of
          the raise. We will keep you up to date as things move, and you are welcome to get in touch at any time.
        </p>
      }
    >
      <Card>
        <h2>In the meantime</h2>
        <p>Read the full story of Estate Transformation and the people behind it on our main site.</p>
        <ButtonLink href="https://www.johngaltinstitute.com" variant="ink">
          Visit johngaltinstitute.com
        </ButtonLink>
      </Card>
    </FunnelShell>
  );
}
