import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { PhotoCredits } from "@/components/PhotoCredits";
import { site } from "@/content/site";
import { buildRootMetadata } from "@/lib/metadata";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = buildRootMetadata(site);

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
        <footer className="mx-auto max-w-3xl px-4 py-10">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} {site.name}
          </p>
          <PhotoCredits credits={site.photoCredits} />
        </footer>
      </body>
    </html>
  );
}
