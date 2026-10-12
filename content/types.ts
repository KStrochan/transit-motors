export type PhotoCredit = {
  author: string;
  url: string;
};

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  locale: "en";
  routes: string[];
  photoCredits: PhotoCredit[];
};
