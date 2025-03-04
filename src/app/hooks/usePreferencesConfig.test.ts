import { renderHook, act } from "@testing-library/react";
import usePreferencesConfig from "@/hooks/usePreferencesConfig";
import { newsSources } from "@/constants";

// Mock newsSources for predictable testing
jest.mock("@/constants", () => ({
  newsSources: [
    {
      key: "source1",
      label: "Source One",
      features: {
        fetchCategories: jest
          .fn()
          .mockResolvedValue({ categories: ["Tech", "Health"] }),
        fetchAuthors: jest
          .fn()
          .mockResolvedValue({ authors: ["Alice", "Bob"] }),
      },
    },
  ],
}));

describe("usePreferencesConfig Hook", () => {
  it("initializes sourcesConfig correctly", () => {
    const { result } = renderHook(() => usePreferencesConfig());

    expect(result.current).toHaveLength(newsSources.length);
    expect(result.current[0]).toMatchObject({
      key: "source1",
      label: "Source One",
      features: {
        categories: { options: [], loading: false },
        authors: { options: [], loading: false },
      },
    });
  });

  it("fetches categories and updates state", async () => {
    const { result } = renderHook(() => usePreferencesConfig());

    const { fetch } = result.current[0].features.categories!;

    await act(async () => {
      await fetch();
    });

    expect(result.current[0].features.categories?.options).toEqual([
      "Tech",
      "Health",
    ]);
    expect(result.current[0].features.categories?.loading).toBe(false);
  });

  it("fetches authors and updates state", async () => {
    const { result } = renderHook(() => usePreferencesConfig());

    const { fetch } = result.current[0].features.authors!;

    await act(async () => {
      await fetch();
    });

    expect(result.current[0].features.authors?.options).toEqual([
      "Alice",
      "Bob",
    ]);
    expect(result.current[0].features.authors?.loading).toBe(false);
  });

  it("toggles loading states correctly", async () => {
    const { result } = renderHook(() => usePreferencesConfig());

    const { fetch } = result.current[0].features.categories!;

    act(() => {
      fetch();
    });

    expect(result.current[0].features.categories?.loading).toBe(true);

    await act(async () => {
      await fetch();
    });

    expect(result.current[0].features.categories?.loading).toBe(false);
  });
});
