import { describe, expect, test } from "vitest";
import sitemap from "@/app/sitemap";
import { site } from "@/content/site";

describe("sitemap", () => {
  test("lists every route as an absolute url", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toEqual(site.routes.map((route) => new URL(route, site.url).toString()));
    for (const url of urls) {
      expect(url.startsWith("https://")).toBe(true);
    }
  });
});
