import Link from "next/link";
import { site } from "@/content/site";

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3 text-fg no-underline">
          <span aria-hidden="true" className="h-6 w-9 -skew-x-[20deg] bg-accent" />
          <span className="font-display text-xl font-bold italic tracking-tight">{site.name}</span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {site.nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-semibold text-fg no-underline hover:text-[var(--link)]">
              {item.label}
            </Link>
          ))}
          <a href={`tel:${site.contact.phone.replace(/[^+\d]/g, "")}`} className="btn-slant">
            {site.contact.phone}
          </a>
        </nav>
        <details className="relative lg:hidden">
          <summary className="cursor-pointer list-none border border-fg/40 px-3 py-1.5 text-sm font-semibold">Menu</summary>
          <nav aria-label="Mobile" className="absolute right-0 mt-2 grid w-60 gap-1 border border-border bg-surface p-2 shadow-2xl">
            {site.nav.map((item) => (
              <Link key={item.href} href={item.href} className="px-3 py-2 text-fg no-underline hover:bg-bg">
                {item.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
