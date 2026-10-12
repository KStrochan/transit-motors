import type { Metadata } from "next";
import { CostCalculator } from "@/components/site/CostCalculator";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata(site, {
  title: "Landed cost calculator",
  description: "See every cost of importing a used car from the US or Europe: fees, shipping, insurance, duty and tax.",
  path: "/calculator",
});

export default function CalculatorPage() {
  return (
    <main id="main">
      <section className="slant-bottom bg-surface pb-24 pt-36">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6">
          <h1 className="font-display text-5xl font-extrabold italic tracking-tight sm:text-6xl">Landed cost calculator</h1>
          <p className="max-w-2xl text-lg text-muted">
            Enter the price of the car you found. The total includes everything up to the moment you get the keys.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <CostCalculator />
      </section>
    </main>
  );
}
