import { describe, expect, test } from "vitest";
import { site } from "@/content/site";

describe("site config", () => {
  test("loads through the @/ alias", () => {
    expect(site.locale).toBe("en");
  });
});
