import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Free live briefing with CEO Michael Gegelman | John Galt Institute",
    template: "%s | John Galt Institute",
  },
  description:
    "Help build the infrastructure for the $124 trillion wealth transfer. A free live briefing with CEO Michael Gegelman on the problem, the platform built to fix it, and how to take a seat in the Venture Studio.",
  icons: { icon: "https://s3.amazonaws.com/webflow-prod-assets/6ace6cba9e3d2ce35f9649e8/6af494b5ec5271f2e876f9e9_jgi-galt-icon-512.png", apple: "https://s3.amazonaws.com/webflow-prod-assets/6ace6cba9e3d2ce35f9649e8/6af494b5ec5271f2e876f9e9_jgi-galt-icon-512.png" },
  // Preview builds must not be indexed. Flip when the production domain is approved.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#1C1B19",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
