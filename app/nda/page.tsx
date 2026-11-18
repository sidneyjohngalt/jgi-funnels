import type { Metadata } from "next";
import { redirect } from "next/navigation";
import FunnelShell from "@/components/FunnelShell";
import { ApplyingFor } from "@/components/Pitch";
import NdaForm from "@/components/NdaForm";
import { NDA_IS_PLACEHOLDER, NDA_PARAGRAPHS, NDA_TITLE } from "@/content/nda";
import { getSession } from "@/lib/session";
import { formatCallTime } from "@/lib/format";

export const metadata: Metadata = { title: "Sign the NDA" };
export const dynamic = "force-dynamic";

export default async function NdaPage() {
  const s = await getSession();
  if (!s) redirect("/apply");
  if (!s.booking) redirect("/apply");
  if (s.step === "nda-signed") redirect("/confirmed");

  return (
    <FunnelShell
      step={1}
      eyebrow="Your call is booked"
      title="One last step: open the data room."
      intro={
        <>
          <p>
            Your call with Michael is set for <strong>{formatCallTime(s.booking.start, s.booking.timezone)}</strong>.
          </p>
          <p>
            This short agreement is the key to the data room: the proforma, cap table, prospectus and more, ready to
            read before you talk. Signing takes about a minute.
          </p>
        </>
      }
      aside={<ApplyingFor pathCurrent={2} />}
    >
      <div className="panel">
        <NdaForm title={NDA_TITLE} paragraphs={NDA_PARAGRAPHS} placeholder={NDA_IS_PLACEHOLDER} />
      </div>
    </FunnelShell>
  );
}
