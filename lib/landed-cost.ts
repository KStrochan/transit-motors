export type Origin = "us" | "eu";
export type Engine = "petrol" | "diesel" | "hybrid" | "electric";

export type LandedCostInput = {
  price: number;
  origin: Origin;
  engine: Engine;
  engineLitres: number;
};

export type CostLine = { label: string; amount: number };

export type LandedCost = {
  lines: CostLine[];
  total: number;
  weeks: string;
};

/** Demo rates for the website estimate. They are not tied to any country's customs rules. */
const ORIGIN = {
  us: { feeRate: 0.06, minFee: 400, inland: 650, freight: 1450, weeks: "6 to 8" },
  eu: { feeRate: 0.03, minFee: 300, inland: 450, freight: 900, weeks: "2 to 3" },
} as const;

const DUTY: Record<Engine, number> = { petrol: 0.1, diesel: 0.1, hybrid: 0.05, electric: 0 };
const TAX_RATE = 0.2;
const INSURANCE_RATE = 0.015;
const SERVICE_FEE = 900;
const SURCHARGE_PER_LITRE = 400;

export function landedCost(input: LandedCostInput): LandedCost {
  const price = Math.max(0, Number.isFinite(input.price) ? input.price : 0);
  const o = ORIGIN[input.origin];
  const fee = Math.round(Math.max(price * o.feeRate, o.minFee));
  const insurance = Math.round(price * INSURANCE_RATE);
  const shipping = o.inland + o.freight;
  const duty = Math.round((price + shipping) * DUTY[input.engine]);
  const tax = Math.round((price + shipping + duty) * TAX_RATE);
  const litresOver = input.engine === "electric" ? 0 : Math.max(0, input.engineLitres - 3);
  const surcharge = Math.round(litresOver * SURCHARGE_PER_LITRE);

  const lines: CostLine[] = [
    { label: "Car price", amount: price },
    { label: "Auction fee", amount: fee },
    { label: "Inland transport", amount: o.inland },
    { label: "Ocean freight", amount: o.freight },
    { label: "Insurance", amount: insurance },
    { label: "Import duty", amount: duty },
    { label: "Import tax", amount: tax },
    ...(surcharge > 0 ? [{ label: "Large engine surcharge", amount: surcharge }] : []),
    { label: "Our service", amount: SERVICE_FEE },
  ];

  return { lines, total: lines.reduce((sum, l) => sum + l.amount, 0), weeks: o.weeks };
}

export function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}
