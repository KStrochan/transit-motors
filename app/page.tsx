import type { Metadata } from "next";
import Image from "next/image";
import { submitLead } from "@/app/actions";
import { LeadForm } from "@/components/LeadForm";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/metadata";
import placeholder from "@/public/placeholder.jpg";

export const metadata: Metadata = buildMetadata(site, { path: "/" });

export default function HomePage() {
  return (
    <main id="main" className="mx-auto grid max-w-3xl gap-12 px-4 py-16">
      <header className="grid gap-4">
        <h1 className="font-display text-4xl font-semibold tracking-tight">{site.name}</h1>
        <p className="text-lg text-muted">{site.description}</p>
      </header>

      <Image
        src={placeholder}
        alt="Grey grid used as a stand-in for the hero photo"
        width={1600}
        height={900}
        sizes="(min-width: 768px) 720px, 100vw"
        loading="eager"
        fetchPriority="high"
        className="h-auto w-full rounded-site"
      />

      <section aria-labelledby="contact-heading" className="grid gap-6">
        <h2 id="contact-heading" className="font-display text-2xl font-semibold">
          Get in touch
        </h2>
        <LeadForm action={submitLead} />
      </section>
    </main>
  );
}
