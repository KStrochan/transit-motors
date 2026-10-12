export type PhotoCredit = {
  author: string;
  url: string;
};

export type NavLink = {
  href: string;
  label: string;
};

export type Contact = {
  phone: string;
  address: string;
  hours: string;
};

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  locale: "en";
  routes: string[];
  nav: NavLink[];
  contact: Contact;
  photoCredits: PhotoCredit[];
};
