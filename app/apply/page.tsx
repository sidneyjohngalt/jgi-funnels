import type { Metadata } from "next";
import ApplicationForm from "@/components/ApplicationForm";
import FunnelShell from "@/components/FunnelShell";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { DECISION_TIMING, INVESTOR_TYPES, PARTICIPATION_INTEREST } from "@/config/investor";

export const metadata: Metadata = { title: "Apply for a call with Michael" };
export const dynamic = "force-dynamic";

type SP = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

/**
 * Investor application. GHL emails after the webinar can link here with merge fields to prefill step 1:
 *   /apply?first_name={{contact.first_name}}&last_name={{contact.last_name}}&email={{contact.email}}&phone={{contact.phone}}&utm_source=webinar
 */
export default async function ApplyPage({ searchParams }: { searchParams: SP }) {
  const q = await searchParams;
  const s = await getSession();
  if (s?.step === "not-qualified") redirect("/apply/thank-you");
  if (s && ["booked", "nda-skipped"].includes(s.step)) redirect(s.step === "booked" ? "/nda" : "/confirmed");
  if (s?.step === "nda-signed") redirect("/confirmed");
  const initialStep = s?.step === "qualified" ? 4 : s?.step === "started" || s?.step === "applied" ? 1 : 0;
  const prefill = {
    firstName: one(q.first_name).slice(0, 80),
    lastName: one(q.last_name).slice(0, 80),
    email: one(q.email).slice(0, 200),
    phone: one(q.phone).slice(0, 40),
  };
  return (
    <FunnelShell
      step={0}
      eyebrow="Investor application"
      title="Apply for a call with Michael."
      intro={
        <p>
          Four short questions, then pick a time on the same page. About three minutes. CEO Michael Gegelman reads
          every answer before your call.
        </p>
      }
    >
      <div className="panel">
        <ApplicationForm
          initialStep={initialStep}
          prefill={prefill}
          investorTypes={INVESTOR_TYPES}
          participation={PARTICIPATION_INTEREST}
          timing={DECISION_TIMING}
        />
      </div>
    </FunnelShell>
  );
}
