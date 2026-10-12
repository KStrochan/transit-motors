"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { formatUsd, landedCost, type Engine, type LandedCostInput, type Origin } from "@/lib/landed-cost";

const ORIGINS: { value: Origin; label: string }[] = [
  { value: "us", label: "United States" },
  { value: "eu", label: "Europe" },
];
const ENGINES: { value: Engine; label: string }[] = [
  { value: "petrol", label: "Petrol" },
  { value: "diesel", label: "Diesel" },
  { value: "hybrid", label: "Hybrid" },
  { value: "electric", label: "Electric" },
];

function Toggle<T extends string>({ legend, name, options, value, onChange }: { legend: string; name: string; options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.value} className="cursor-pointer border border-border px-4 py-2 text-sm font-semibold has-[:checked]:border-accent has-[:checked]:bg-accent has-[:checked]:text-white has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2">
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="sr-only" />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function CostCalculator() {
  const [input, setInput] = useState<LandedCostInput>({ price: 25000, origin: "us", engine: "petrol", engineLitres: 2 });
  const priceId = useId();
  const litresId = useId();
  const result = landedCost(input);
  const set = <K extends keyof LandedCostInput>(key: K, value: LandedCostInput[K]) => setInput((p) => ({ ...p, [key]: value }));
  const summary = `Landed cost estimate: ${formatUsd(input.price)} car from ${input.origin === "us" ? "the US" : "Europe"}, ${input.engine}${input.engine === "electric" ? "" : ` ${input.engineLitres} L`}. Total ${formatUsd(result.total)}, ${result.weeks} weeks.`;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
      <form className="grid content-start gap-8" onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-2">
          <label htmlFor={priceId} className="text-sm font-semibold">
            Car price at auction or dealer
          </label>
          <div className="flex items-center border border-border bg-surface focus-within:border-fg">
            <span className="pl-4 text-muted">$</span>
            <input
              id={priceId}
              type="number"
              inputMode="numeric"
              min={0}
              step={500}
              value={input.price}
              onChange={(e) => set("price", Number(e.target.value))}
              className="w-full bg-transparent px-3 py-3 font-display text-2xl font-bold tabular-nums outline-none"
            />
          </div>
        </div>
        <Toggle legend="Buying from" name="origin" options={ORIGINS} value={input.origin} onChange={(v) => set("origin", v)} />
        <Toggle legend="Engine" name="engine" options={ENGINES} value={input.engine} onChange={(v) => set("engine", v)} />
        {input.engine !== "electric" ? (
          <div className="grid gap-2">
            <label htmlFor={litresId} className="text-sm font-semibold">
              Engine size, litres
            </label>
            <input
              id={litresId}
              type="range"
              min={1}
              max={6.5}
              step={0.1}
              value={input.engineLitres}
              onChange={(e) => set("engineLitres", Number(e.target.value))}
              className="accent-[var(--accent)]"
            />
            <output htmlFor={litresId} className="font-display text-xl font-bold tabular-nums">
              {input.engineLitres.toFixed(1)} L
            </output>
          </div>
        ) : null}
      </form>

      <div aria-live="polite" className="border border-border bg-surface">
        <div className="flex items-baseline justify-between gap-4 border-b border-border p-6">
          <div>
            <p className="text-sm text-muted">Landed price</p>
            <p className="font-display text-5xl font-extrabold italic tabular-nums">{formatUsd(result.total)}</p>
          </div>
          <p className="text-right text-sm text-muted">
            Delivery
            <span className="block font-display text-xl font-bold text-fg">{result.weeks} weeks</span>
          </p>
        </div>
        <table className="w-full text-sm">
          <caption className="sr-only">Cost breakdown</caption>
          <tbody>
            {result.lines.map((line) => (
              <tr key={line.label} className="border-b border-border last:border-b-0">
                <th scope="row" className="px-6 py-3 text-left font-normal text-muted">
                  {line.label}
                </th>
                <td className="px-6 py-3 text-right font-semibold tabular-nums">{formatUsd(line.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="grid gap-3 border-t border-border p-6">
          <Link href={`/contact?estimate=${encodeURIComponent(summary)}`} className="btn-slant justify-self-start">
            Find me this car
          </Link>
          <p className="text-xs text-muted">
            A demo estimate with sample rates, not tied to any country&apos;s customs rules. We confirm exact costs before
            bidding.
          </p>
        </div>
      </div>
    </div>
  );
}
