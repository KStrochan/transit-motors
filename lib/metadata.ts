import type { Metadata } from "next";
import type { SiteConfig } from "@/content/types";

type PageMeta = {
  title?: string;
  description?: string;
  path: string;
};

/** Defaults for the root layout. Canonical URLs are set per page, never here. */
export function buildRootMetadata(site: SiteConfig): Metadata {
  return {
    metadataBase: new URL(site.url),
    title: { default: site.name, template: `%s | ${site.name}` },
    description: site.description,
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: site.name,
      title: site.name,
      description: site.description,
    },
    twitter: { card: "summary_large_image" },
  };
}

/** Per-page metadata. Every page passes its own path so its canonical URL is its own. */
export function buildMetadata(site: SiteConfig, page: PageMeta): Metadata {
  const url = new URL(page.path, site.url).toString();
  const description = page.description ?? site.description;

  return {
    ...(page.title ? { title: page.title } : {}),
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: site.name,
      title: page.title ?? site.name,
      description,
      url,
    },
  };
}
