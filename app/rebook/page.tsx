import type { Metadata } from "next";
import { redirect } from "next/navigation";
import FunnelShell from "@/components/FunnelShell";
import SlotPicker from "@/components/SlotPicker";
import { BOOKING } from "@/config/investor";
import { currentCall } from "@/lib/appointment";
import { formatCallTime } from "@/lib/format";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Choose a new time" };
export const dynamic = "force-dynamic";

/**
 * Rebook step, reached from the personal rebook link (/r?t=...) or the confirmation page. Keeps the
 * application; the new time follows the same window (48 hours to 6 days). An active call is moved,
 * a cancelled one is booked again.
 */
export default async function RebookPage() {
  const s = await getSession();
  if (!s) redirect("/apply");
  if (["started", "applied"].includes(s.step)) redirect("/apply");
  if (s.step === "not-qualified") redirect("/apply/thank-you");

  const call = await currentCall(s);
  const tz = s.booking?.timezone || BOOKING.timezoneDefault;

  return (
    <FunnelShell
      step={0}
      eyebrow="Your call with Michael"
      title={
        <>
          Choose a <em>new time.</em>
        </>
      }
      intro={
        call.status === "booked" ? (
          <p>
            Your call is set for <strong>{formatCallTime(call.start, tz)}</strong>. Pick a new time below and we will
            move it. Your application and anything you have signed stay as they are.
          </p>
        ) : call.status === "cancelled" ? (
          <p>Your last call was cancelled. Pick a new time below. Your application stays as it is.</p>
        ) : (
          <p>Pick a time below. Your application stays as it is.</p>
        )
      }
    >
      <div className="panel">
        <p>
          Times run from {BOOKING.minHoursAhead} hours to {BOOKING.maxDaysAhead} days ahead, so you have room to go
          through your preparation page first. The call takes about {BOOKING.durationMinutes} minutes.
        </p>
        <SlotPicker />
      </div>
    </FunnelShell>
  );
}
