import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useNews from "./useNews";

// Mock dependencies
jest.mock("react-toastify", () => ({
  toast: { error: jest.fn() },
}));

const mockFetchNews = jest.fn().mockResolvedValue({
  news: [{ title: "News 1" }, { title: "News 2" }],
  pagination: { page: 1, total: 2, limit: 10 },
});

const mockFetchCategories = jest.fn().mockResolvedValue({
  categories: ["Tech", "Health"],
  pagination: { page: 1, total: 1 },
});

// Mock news sources with fetch functions
jest.mock("@/constants", () => ({
  newsSources: [
    {
      key: "tech",
      label: "Tech",
      features: {
        fetchNews: jest.fn(() => mockFetchNews()),
        fetchCategories: jest.fn(() => mockFetchCategories()),
      },
    },
  ],
}));

const createWrapper = () => {
  const queryClient = new QueryClient();
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
};

describe("useNews Hook", () => {
  it("fetches categories correctly", async () => {
    const { result } = renderHook(() => useNews({}), {
      wrapper: createWrapper(),
    });

    await waitFor(() =>
      expect(result.current.categories.items).toEqual(["Tech", "Health"])
    );
    expect(result.current.categories.isLoading).toBe(false);
  });

  it("fetches news correctly", async () => {
    const { result } = renderHook(() => useNews({}), {
      wrapper: createWrapper(),
    });

    await waitFor(() =>
      expect(result.current.news.items).toEqual([
        { title: "News 1" },
        { title: "News 2" },
      ])
    );
    expect(result.current.news.page).toBe(1);
    expect(result.current.news.total).toBe(2);
    expect(result.current.news.isLoading).toBe(false);
  });

  it("handles errors correctly", async () => {
    // Make the mock return a rejected promise
    mockFetchNews.mockImplementationOnce(() =>
      Promise.reject(new Error("Network error"))
    );

    // Render hook
    renderHook(() => useNews({}), { wrapper: createWrapper() });

    // Wait for error handling to trigger
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Error loading news, please try again"
      );
    });
  });

  it("handles errors correctly", async () => {
    // Ensure the mock function throws an error
    mockFetchNews.mockImplementationOnce(() =>
      Promise.reject(new Error("Network error"))
    );

    const { rerender } = renderHook(() => useNews({}), {
      wrapper: createWrapper(),
    });

    // Force a re-render to ensure error handling is triggered
    rerender();

    // Wait for the error to be processed
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Error loading news, please try again"
      );
    });
  });
});
