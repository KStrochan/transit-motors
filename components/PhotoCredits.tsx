import type { SiteConfig } from "@/content/types";

type PhotoCreditsProps = {
  credits: SiteConfig["photoCredits"];
};

export function PhotoCredits({ credits }: PhotoCreditsProps) {
  if (credits.length === 0) return null;

  return (
    <p className="photo-credits">
      Photos on{" "}
      <a href="https://unsplash.com" rel="noopener noreferrer" target="_blank">
        Unsplash
      </a>{" "}
      by{" "}
      {credits.map((credit, index) => (
        <span key={credit.url}>
          {index > 0 ? (index === credits.length - 1 ? " and " : ", ") : null}
          <a href={credit.url} rel="noopener noreferrer" target="_blank">
            {credit.author}
          </a>
        </span>
      ))}
      .
    </p>
  );
}
