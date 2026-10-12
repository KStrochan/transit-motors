import { describe, expect, test } from "vitest";
import { unsplash } from "@/lib/unsplash";

describe("unsplash", () => {
  test("builds a sized, cropped image url", () => {
    expect(unsplash("1700124113583-81aa99ea2aa2", 800)).toBe(
      "https://images.unsplash.com/photo-1700124113583-81aa99ea2aa2?auto=format&fit=crop&w=800&q=80",
    );
  });

  test("defaults to 1600px wide", () => {
    expect(unsplash("abc")).toContain("w=1600");
  });
});
