import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "@/components/Pagination/Pagination";

describe("Pagination Component", () => {
  it("renders pagination with correct page info", () => {
    render(
      <Pagination currentPage={2} totalPages={5} onPageChange={jest.fn()} />
    );

    expect(screen.getByText("Page 2 of 5")).toBeInTheDocument();
  });

  it("disables 'Previous' button on the first page", () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={jest.fn()} />
    );

    expect(screen.getByText("Previous")).toBeDisabled();
  });

  it("disables 'Next' button on the last page", () => {
    render(
      <Pagination currentPage={5} totalPages={5} onPageChange={jest.fn()} />
    );

    expect(screen.getByText("Next")).toBeDisabled();
  });

  it("calls onPageChange with the correct value when clicking 'Previous'", () => {
    const mockOnPageChange = jest.fn();
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    fireEvent.click(screen.getByText("Previous"));

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageChange with the correct value when clicking 'Next'", () => {
    const mockOnPageChange = jest.fn();
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    fireEvent.click(screen.getByText("Next"));

    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });
});
