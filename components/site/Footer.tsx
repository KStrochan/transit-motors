import Link from "next/link";
import { PhotoCredits } from "@/components/PhotoCredits";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="slant-top bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-10 pt-24 sm:px-6 md:grid-cols-4">
        <div className="grid content-start gap-3 md:col-span-2">
          <p className="font-display text-2xl font-bold italic">{site.name}</p>
          <p className="max-w-md text-sm text-muted">{site.description}</p>
        </div>
        <div className="grid content-start gap-2 text-sm">
          <p className="font-semibold">Office</p>
          <p className="text-muted">{site.contact.address}</p>
          <p className="text-muted">{site.contact.hours}</p>
          <a href={`tel:${site.contact.phone.replace(/[^+\d]/g, "")}`}>{site.contact.phone}</a>
        </div>
        <nav aria-label="Footer" className="grid content-start gap-2 text-sm">
          <p className="font-semibold">Pages</p>
          {site.nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-fg">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 px-4 py-5 text-xs text-muted sm:px-6">
          <p>
            &copy; {new Date().getFullYear()} {site.name}. Demo project by{" "}
            <a href="https://github.com/KStrochan">Konstantyn Strochan</a>; the company, cars and reviews are fictional.
          </p>
          <PhotoCredits credits={site.photoCredits} />
        </div>
      </div>
    </footer>
  );
}
