import type { Metadata } from "next";
import ApplicationForm from "@/components/ApplicationForm";
import FunnelShell from "@/components/FunnelShell";
import { Card } from "@/components/ui";
import { DECISION_TIMING, INVESTOR_TYPES, PARTICIPATION_INTEREST } from "@/config/investor";

export const metadata: Metadata = { title: "Apply for a call with Michael" };

type SP = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

/**
 * Investor application. GHL emails after the webinar can link here with merge fields to prefill step 1:
 *   /apply?first_name={{contact.first_name}}&last_name={{contact.last_name}}&email={{contact.email}}&phone={{contact.phone}}&utm_source=webinar
 */
export default async function ApplyPage({ searchParams }: { searchParams: SP }) {
  const q = await searchParams;
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
      title="Apply for a call with Michael"
      intro={
        <p>
          A few short questions so CEO Michael Gegelman can make the most of your time together. It takes about three
          minutes.
        </p>
      }
    >
      <Card>
        <ApplicationForm
          prefill={prefill}
          investorTypes={INVESTOR_TYPES}
          participation={PARTICIPATION_INTEREST}
          timing={DECISION_TIMING}
        />
      </Card>
    </FunnelShell>
  );
}
