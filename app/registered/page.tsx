import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/Chrome";
import RawEmbed from "@/components/RawEmbed";
import { Card, Eyebrow, Lead, Placeholder, Section } from "@/components/ui";
import Video from "@/components/Video";
import { MEDIA, WEBINARKIT } from "@/content/investor";
import p from "./registered.module.css";

export const metadata: Metadata = { title: "You are registered" };

/**
 * WebinarKit custom thank you page. Set the event's thank you page URL in WebinarKit to /registered.
 * The thank you embed shows the session time and sends people to the watch room when it starts.
 */
export default function Registered() {
  const ty = WEBINARKIT.thankYou;
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Section tone="dark" width="narrow" labelledBy="reg-title">
          <div className={p.head}>
            <Eyebrow>You are registered</Eyebrow>
            <h1 id="reg-title" className={p.title}>
              Your seat is saved.
            </h1>
            <Lead muted>
              Your confirmation email is on its way with your private link. Keep this page open if the briefing starts
              soon: it will take you straight in.
            </Lead>
          </div>
          <Card>
            {ty ? (
              <RawEmbed html={ty.html} script={ty.script} />
            ) : (
              <Placeholder
                title="Session time and countdown"
                note="The thank you embed goes here. It shows the time you chose and opens the watch room when the briefing starts."
                minHeight={180}
              />
            )}
          </Card>
        </Section>

        <Section tone="ivory" width="narrow" labelledBy="before-title">
          <h2 id="before-title">Before the briefing</h2>
          <ol className={p.list}>
            <li>
              <strong>Find your email.</strong> It has your private link. If it is not in your inbox in a few minutes,
              check your spam or promotions folder.
            </li>
            <li>
              <strong>Put it in your calendar.</strong> Use the button in your confirmation email so the link is there
              when you need it.
            </li>
            <li>
              <strong>Bring your questions.</strong> Jot them down as they come to you, so none get lost.
            </li>
          </ol>
        </Section>

        <Section tone="raised" labelledBy="tour2-title">
          <div className={p.tour}>
            <div>
              <Eyebrow>While you wait</Eyebrow>
              <h2 id="tour2-title">See the app for yourself</h2>
              <p className={p.muted}>A short tour of version 4.0 of Estate Transformation.</p>
            </div>
            <Video src={MEDIA.appTour.src} poster={MEDIA.appTour.poster} title="Estate Transformation app tour" />
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
