import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { submitLead } from "@/app/actions";
import { LeadForm } from "@/components/LeadForm";
import { TransitCard } from "@/components/site/TransitCard";
import { carsInTransit, faqs, photos, reviews, steps } from "@/content/home";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/metadata";
import { unsplash } from "@/lib/unsplash";

export const metadata: Metadata = buildMetadata(site, { path: "/" });

export default function HomePage() {
  return (
    <main id="main">
      <section className="slant-bottom relative isolate min-h-[42rem] overflow-hidden pb-32 pt-36 sm:min-h-[46rem]">
        <Image
          src={unsplash(photos.hero, 2000)}
          alt=""
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          className="-z-20 bg-surface object-cover object-[70%_center]"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-bg via-bg/85 to-bg/20" />
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6">
          <h1 className="max-w-3xl font-display text-5xl font-extrabold italic leading-[0.98] tracking-tight sm:text-7xl">
            Your next car is already on a ship.
          </h1>
          <p className="max-w-xl text-lg text-muted">
            We find used cars at auctions and dealers in the US and Europe, inspect them in person, ship them and hand
            them over registered. One price, agreed before we bid.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/calculator" className="btn-slant">
              Calculate the landed price
            </Link>
            <Link href="/#in-transit" className="btn-outline">
              See cars in transit
            </Link>
          </div>
          <dl className="mt-6 grid max-w-2xl grid-cols-3 gap-6 border-t border-fg/20 pt-6">
            <div>
              <dt className="text-xs text-muted">Cars delivered</dt>
              <dd className="font-display text-3xl font-bold">860+</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Average saving</dt>
              <dd className="font-display text-3xl font-bold">19%</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">From the US</dt>
              <dd className="font-display text-3xl font-bold">6–8 wk</dd>
            </div>
          </dl>
        </div>
      </section>

      <section id="in-transit" className="mx-auto max-w-7xl scroll-mt-8 px-4 py-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="grid gap-3">
            <h2 className="font-display text-4xl font-bold italic sm:text-5xl">Cars in transit</h2>
            <p className="max-w-xl text-muted">
              Bought for clients and on their way now. Prices include every cost up to the handover.
            </p>
          </div>
          <span aria-hidden="true" className="stripe hidden h-8 w-40 sm:block" />
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {carsInTransit.map((car) => (
            <TransitCard key={car.model} car={car} />
          ))}
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-8 bg-surface py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="grid content-start gap-6">
            <h2 className="font-display text-4xl font-bold italic sm:text-5xl">How it works</h2>
            <Image
              src={unsplash(photos.inspection, 1200)}
              alt="Mechanic in a grey uniform inspecting the engine bay of a car"
              width={1200}
              height={800}
              sizes="(min-width: 1024px) 560px, 100vw"
              className="aspect-[3/2] h-auto w-full bg-bg object-cover"
            />
            <Image
              src={unsplash(photos.carrier, 1200)}
              alt="Two cars loaded onto a car carrier truck"
              width={1200}
              height={800}
              sizes="(min-width: 1024px) 560px, 100vw"
              className="hidden aspect-[3/2] h-auto w-full bg-bg object-cover lg:block"
            />
          </div>
          <ol className="grid content-start">
            {steps.map((step, index) => (
              <li key={step.title} className="grid grid-cols-[3.5rem_1fr] gap-4 border-b border-border py-6 first:pt-0">
                <span aria-hidden="true" className="font-display text-4xl font-extrabold italic text-accent">
                  {index + 1}
                </span>
                <div className="grid gap-2">
                  <h3 className="font-display text-2xl font-bold">{step.title}</h3>
                  <p className="text-muted">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative isolate overflow-hidden">
        <Image
          src={unsplash(photos.ship, 2000)}
          alt=""
          fill
          sizes="100vw"
          className="-z-20 bg-surface object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-bg/80" />
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-24 sm:px-6 md:grid-cols-[1.4fr_1fr] md:items-center">
          <h2 className="font-display text-4xl font-bold italic sm:text-5xl">
            Know the full price before we bid, down to the customs line.
          </h2>
          <div className="grid gap-4">
            <p className="text-muted">
              The calculator splits the landed price into auction fee, shipping, insurance, duty, tax and our fee.
            </p>
            <Link href="/calculator" className="btn-slant justify-self-start">
              Open the calculator
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <h2 className="font-display text-4xl font-bold italic sm:text-5xl">From people who drive them</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {reviews.map((review) => (
            <figure key={review.name} className="grid content-between gap-6 border-l-4 border-accent bg-surface p-6">
              <blockquote className="text-lg leading-relaxed">“{review.text}”</blockquote>
              <figcaption className="text-sm">
                <span className="font-bold">{review.name}</span>
                <span className="text-muted">, {review.car}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 pb-24 sm:px-6 lg:grid-cols-2">
        <div className="grid content-start gap-6">
          <h2 className="font-display text-4xl font-bold italic sm:text-5xl">Questions</h2>
          <div className="divide-y divide-border border-y border-border">
            {faqs.map((faq) => (
              <details key={faq.q} className="group py-5">
                <summary className="flex cursor-pointer justify-between gap-4 font-semibold">
                  {faq.q}
                  <span aria-hidden="true" className="text-accent transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-muted">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
        <div id="contact" className="grid content-start gap-6 border border-border bg-surface p-6 sm:p-8">
          <h2 className="font-display text-3xl font-bold italic">Tell us what you are looking for</h2>
          <LeadForm action={submitLead} submitLabel="Get a shortlist" />
        </div>
      </section>
    </main>
  );
}
