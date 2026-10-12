import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { PhotoCredits } from "@/components/PhotoCredits";

const credits = [
  { author: "Jane Doe", url: "https://unsplash.com/@janedoe" },
  { author: "Max Roe", url: "https://unsplash.com/@maxroe" },
];

describe("PhotoCredits", () => {
  test("renders each author as a link", () => {
    render(<PhotoCredits credits={credits} />);
    for (const credit of credits) {
      const link = screen.getByRole("link", { name: credit.author });
      expect(link).toHaveAttribute("href", credit.url);
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
    expect(screen.getByText(/unsplash/i)).toBeInTheDocument();
  });

  test("renders nothing when the list is empty", () => {
    const { container } = render(<PhotoCredits credits={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
