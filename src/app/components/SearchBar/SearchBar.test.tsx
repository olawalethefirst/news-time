import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "@/components/SearchBar/SearchBar";

describe("SearchBar Component", () => {
  it("renders input and button correctly", () => {
    render(<SearchBar onSearch={jest.fn()} />);

    expect(screen.getByPlaceholderText("Search news...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("updates input value on change", () => {
    render(<SearchBar onSearch={jest.fn()} />);
    const input = screen.getByPlaceholderText(
      "Search news..."
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "React" } });

    expect(input.value).toBe("React");
  });

  it("calls onSearch with the correct query when submitted", () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText(
      "Search news..."
    ) as HTMLInputElement;
    const button = screen.getByRole("button", { name: /search/i });

    fireEvent.change(input, { target: { value: "React Testing" } });
    fireEvent.click(button);

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith("React Testing");
  });
});
