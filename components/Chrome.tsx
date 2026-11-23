import Image from "next/image";
import { ghlIsLive } from "@/lib/ghl";
import s from "./chrome.module.css";

export function SiteHeader({ minimal }: { minimal?: boolean }) {
  return (
    <header className={s.header}>
      <div className={s.headerInner}>
        <span className={s.brand}>
          <Image src="https://s3.amazonaws.com/webflow-prod-assets/6ace6cba9e3d2ce35f9649e8/6af494b5ec5271f2e876f9d8_jgi-wordmark-gold-2026.webp" alt="John Galt Institute" width={180} height={49} priority />
        </span>
        {!minimal ? (
          <span className={s.headerTag}>Venture Studio</span>
        ) : null}
      </div>
    </header>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className={s.footer}>
      <div className={s.footerInner}>
        <Image src="https://s3.amazonaws.com/webflow-prod-assets/6ace6cba9e3d2ce35f9649e8/6af494b5ec5271f2e876f9d8_jgi-wordmark-gold-2026.webp" alt="John Galt Institute" width={150} height={41} />
        <p className={s.footerLine}>John Galt Institute, Inc. · Charlotte, North Carolina</p>
        <p className={s.footerSmall}>
          John Galt Institute, Inc. is not a law firm and does not provide legal, tax or investment advice. Nothing on
          this page is an offer to sell, or a solicitation of an offer to buy, any security. Participation is available
          only through the private application process and definitive agreements.
        </p>
        <p className={s.footerSmall}>
          © {year} John Galt Institute, Inc. ·{" "}
          <a href="https://www.johngaltinstitute.com" rel="noopener">
            johngaltinstitute.com
          </a>
        </p>
      </div>
      <PreviewNav />
    </footer>
  );
}

/** Preview only: links to every step, because the webinar sits between the pages and nothing is connected yet. */
function PreviewNav() {
  if (ghlIsLive()) return null;
  const links: [string, string][] = [
    ["/", "1. Registration"],
    ["/registered", "2. Registered"],
    ["/replay", "3. Replay"],
    ["/api/session/reset?to=/apply", "4. Apply and book (fresh)"],
    ["/nda", "5. NDA"],
    ["/api/session/demo?nda=signed", "6. Confirmation (NDA signed)"],
    ["/api/session/demo?nda=skipped", "6. Confirmation (NDA skipped)"],
    ["/apply/thank-you", "Not qualified"],
  ];
  return (
    <nav aria-label="Preview pages" style={{ maxWidth: 760, margin: "40px auto 0", padding: "16px 0 0", borderTop: "1px solid rgba(246,241,231,0.2)", textAlign: "center", fontSize: "0.95rem" }}>
      <p style={{ margin: "0 0 8px", color: "#f0dc9b" }}>Preview only: jump to any page in the funnel</p>
      <p style={{ margin: 0, display: "flex", flexWrap: "wrap", gap: "8px 18px", justifyContent: "center" }}>
        {links.map(([href, label]) => (
          <a key={href} href={href} style={{ color: "#f6f1e7" }}>
            {label}
          </a>
        ))}
      </p>
      <p style={{ margin: "8px 0 0", color: "rgba(246,241,231,0.7)", fontSize: "0.85rem" }}>
        The NDA page opens after you pick a time in the application. The confirmation links use a test person.
      </p>
    </nav>
  );
}
