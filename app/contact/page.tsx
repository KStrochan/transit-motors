import type { Metadata } from "next";
import Image from "next/image";
import { submitLead } from "@/app/actions";
import { LeadForm } from "@/components/LeadForm";
import { photos } from "@/content/home";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/metadata";
import { unsplash } from "@/lib/unsplash";

export const metadata: Metadata = buildMetadata(site, {
  title: "Contact",
  description: "Tell us which car you want and get a shortlist from US and European auctions within 48 hours.",
  path: "/contact",
});

type Props = { searchParams: Promise<{ estimate?: string }> };

export default async function ContactPage({ searchParams }: Props) {
  const { estimate } = await searchParams;
  return (
    <main id="main" className="pt-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-20 sm:px-6 lg:grid-cols-2">
        <div className="grid content-start gap-6">
          <h1 className="font-display text-5xl font-extrabold italic tracking-tight sm:text-6xl">Let&apos;s find your car</h1>
          <p className="text-lg text-muted">
            Model, budget, colour, deal-breakers. We reply with a shortlist and landed prices within 48 hours, free and
            without obligation.
          </p>
          <dl className="grid gap-4 border-l-4 border-accent pl-5">
            <div>
              <dt className="text-sm text-muted">Call or message</dt>
              <dd>
                <a href={`tel:${site.contact.phone.replace(/[^+\d]/g, "")}`} className="font-display text-2xl font-bold">
                  {site.contact.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Office</dt>
              <dd>{site.contact.address}</dd>
              <dd className="text-muted">{site.contact.hours}</dd>
            </div>
          </dl>
          <Image
            src={unsplash(photos.interior, 1200)}
            alt="Modern car interior with the steering wheel and dashboard"
            width={1200}
            height={800}
            sizes="(min-width: 1024px) 600px, 100vw"
            className="aspect-[3/2] h-auto w-full bg-surface object-cover"
          />
        </div>
        <div className="border border-border bg-surface p-6 sm:p-8">
          <LeadForm action={submitLead} defaultMessage={estimate} submitLabel="Get a shortlist" />
        </div>
      </div>
    </main>
  );
}
