import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import NewsList from "./NewsList";

const mockNewsItems = [
  {
    id: "1",
    image: "https://example.com/news1.jpg",
    title: "News Title 1",
    description: "Description of news 1",
    date: "March 4, 2025",
    url: "https://example.com/news1",
  },
  {
    id: "2",
    image: "https://example.com/news2.jpg",
    title: "News Title 2",
    description: "Description of news 2",
    date: "March 5, 2025",
    url: "https://example.com/news2",
  },
];

describe("NewsList Component", () => {
  test("displays loading state when isLoading is true", () => {
    render(<NewsList isLoading={true} items={[]} />);
    expect(screen.getByText(/LOADING.../i)).toBeInTheDocument();
  });

  test("displays empty state when no items are provided", () => {
    render(<NewsList isLoading={false} items={[]} />);
    expect(screen.getByText(/EMPTY/i)).toBeInTheDocument();
  });

  test("renders news items when provided", () => {
    render(<NewsList isLoading={false} items={mockNewsItems} />);
    expect(screen.getByText(mockNewsItems[0].title)).toBeInTheDocument();
    expect(screen.getByText(mockNewsItems[1].title)).toBeInTheDocument();
  });
});
