import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import NewsItem from "./NewsItem";

const mockNewsItem = {
  id: "1",
  image: "https://example.com/news.jpg",
  title: "Breaking News",
  description: "This is a short news description.",
  date: "March 4, 2025",
  url: "https://example.com/news",
};

describe("NewsItem Component", () => {
  test("renders news title, date, description, and link", () => {
    render(<NewsItem {...mockNewsItem} />);
    expect(screen.getByText(mockNewsItem.title)).toBeInTheDocument();
    expect(screen.getByText(mockNewsItem.date)).toBeInTheDocument();
    expect(screen.getByText(mockNewsItem.description)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /read more/i })).toHaveAttribute(
      "href",
      mockNewsItem.url
    );
  });

  test("renders fallback image when no image is provided", () => {
    render(<NewsItem {...mockNewsItem} image={undefined} />);
    const image = screen.getByRole("img", { name: mockNewsItem.title });
    expect(image).toHaveAttribute(
      "src",
      expect.stringContaining("next-blog-starter.vercel.app")
    );
  });

  test("does not render description if it's not provided", () => {
    render(<NewsItem {...mockNewsItem} description={undefined} />);
    expect(
      screen.queryByText(mockNewsItem.description)
    ).not.toBeInTheDocument();
  });
});
