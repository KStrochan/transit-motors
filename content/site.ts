import type { SiteConfig } from "./types";

export const site: SiteConfig = {
  name: "Transit Motors",
  description: "We find, inspect and ship used cars from the US and Europe, and hand them over ready to drive.",
  url: "https://transit-motors.vercel.app",
  locale: "en",
  routes: ["/", "/calculator", "/contact"],
  nav: [
    { href: "/#in-transit", label: "Cars in transit" },
    { href: "/#how-it-works", label: "How it works" },
    { href: "/calculator", label: "Cost calculator" },
    { href: "/contact", label: "Contact" },
  ],
  contact: {
    phone: "+1 (555) 019-4400",
    address: "Pier 7 Logistics Park, Bay Harbor",
    hours: "Every day 9:00 to 20:00",
  },
  photoCredits: [
    { author: "Elias Andres-Jose", url: "https://unsplash.com/@eliasandres" },
    { author: "Rafael Peier", url: "https://unsplash.com/@rafaelpeier" },
    { author: "Kate Ibragimova", url: "https://unsplash.com/@kateibragimova" },
    { author: "Nadja Thöner", url: "https://unsplash.com/@nadja_thoener" },
    { author: "Obi", url: "https://unsplash.com/@obionyeador" },
  ],
};
