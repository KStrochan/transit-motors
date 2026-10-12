import { describe, expect, test } from "vitest";
import { landedCost, formatUsd } from "@/lib/landed-cost";

const base = { price: 20000, origin: "us", engine: "petrol", engineLitres: 2.0 } as const;

describe("landedCost", () => {
  test("adds fees, shipping, insurance, duty and tax to the car price", () => {
    const result = landedCost(base);
    const byLabel = Object.fromEntries(result.lines.map((l) => [l.label, l.amount]));
    expect(byLabel["Car price"]).toBe(20000);
    expect(byLabel["Auction fee"]).toBe(1200);
    expect(byLabel["Inland transport"]).toBe(650);
    expect(byLabel["Ocean freight"]).toBe(1450);
    expect(byLabel["Insurance"]).toBe(300);
    expect(byLabel["Import duty"]).toBe(2210);
    expect(byLabel["Import tax"]).toBe(4862);
    expect(byLabel["Our service"]).toBe(900);
    expect(result.total).toBe(31572);
  });

  test("electric cars pay no duty", () => {
    const result = landedCost({ ...base, engine: "electric" });
    expect(result.lines.find((l) => l.label === "Import duty")?.amount).toBe(0);
  });

  test("large engines pay a surcharge above 3 litres", () => {
    const result = landedCost({ ...base, engineLitres: 5 });
    expect(result.lines.find((l) => l.label === "Large engine surcharge")?.amount).toBe(800);
  });

  test("Europe is cheaper to ship and faster", () => {
    const us = landedCost(base);
    const eu = landedCost({ ...base, origin: "eu" });
    expect(eu.total).toBeLessThan(us.total);
    expect(eu.weeks).toBe("2 to 3");
    expect(us.weeks).toBe("6 to 8");
  });

  test("applies the minimum auction fee to cheap cars", () => {
    const result = landedCost({ ...base, price: 3000 });
    expect(result.lines.find((l) => l.label === "Auction fee")?.amount).toBe(400);
  });

  test("treats negative or missing prices as zero", () => {
    expect(landedCost({ ...base, price: -5 }).lines[0]?.amount).toBe(0);
  });
});

describe("formatUsd", () => {
  test("formats whole dollars", () => {
    expect(formatUsd(31988)).toBe("$31,988");
  });
});
