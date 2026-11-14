import type { Metadata } from "next";
import { redirect } from "next/navigation";
import FunnelShell from "@/components/FunnelShell";
import NdaForm from "@/components/NdaForm";
import { Card } from "@/components/ui";
import { NDA_IS_PLACEHOLDER, NDA_PARAGRAPHS, NDA_TITLE } from "@/content/nda";
import { getSession } from "@/lib/session";
import { formatCallTime } from "@/lib/format";

export const metadata: Metadata = { title: "Sign the NDA" };
export const dynamic = "force-dynamic";

export default async function NdaPage() {
  const s = await getSession();
  if (!s) redirect("/apply");
  if (!s.booking) redirect("/book");
  if (s.step === "nda-signed") redirect("/confirmed");

  return (
    <FunnelShell
      step={2}
      eyebrow="Your call is booked"
      title="One last step: open the data room."
      intro={
        <>
          <p>
            Your call with Michael is set for <strong>{formatCallTime(s.booking.start, s.booking.timezone)}</strong>.
          </p>
          <p>
            Sign this short agreement to see the full data room before you talk: the proforma, cap table, prospectus
            and more.
          </p>
        </>
      }
    >
      <Card>
        <NdaForm title={NDA_TITLE} paragraphs={NDA_PARAGRAPHS} placeholder={NDA_IS_PLACEHOLDER} />
      </Card>
    </FunnelShell>
  );
}
