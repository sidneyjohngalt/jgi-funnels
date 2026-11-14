import type { Metadata } from "next";
import { redirect } from "next/navigation";
import FunnelShell from "@/components/FunnelShell";
import SlotPicker from "@/components/SlotPicker";
import { Card } from "@/components/ui";
import { BOOKING } from "@/config/investor";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Book your call with Michael" };
export const dynamic = "force-dynamic";

export default async function BookPage() {
  const s = await getSession();
  if (!s || s.step === "started" || s.step === "applied") redirect("/apply");
  if (s.step === "not-qualified") redirect("/apply/thank-you");

  return (
    <FunnelShell
      step={1}
      eyebrow="Your application is approved"
      title={<>Thank you, {s.firstName}. Let&apos;s find a time.</>}
      intro={
        <>
          <p>
            Book your first call with CEO Michael Gegelman. Times open from {BOOKING.minHoursAhead / 24} days to one
            week ahead.
          </p>
          <p>
            Please pick a time that leaves you room to go through the resources first. After you book, you will get a
            page of films and documents to explore before you talk.
          </p>
        </>
      }
    >
      <Card>
        <SlotPicker />
      </Card>
    </FunnelShell>
  );
}
