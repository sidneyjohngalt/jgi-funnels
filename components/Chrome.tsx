import Image from "next/image";
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
    </footer>
  );
}
