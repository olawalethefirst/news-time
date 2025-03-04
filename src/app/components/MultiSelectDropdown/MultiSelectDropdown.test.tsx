import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import MultiSelectDropdown from "./MultiSelectDropdown";

describe("MultiSelectDropdown Component", () => {
  test("renders placeholder when no option is selected", () => {
    render(
      <MultiSelectDropdown
        options={[]}
        onSelect={jest.fn()}
        placeholder="Select an option"
      />
    );
    expect(screen.getByText("Select an option")).toBeInTheDocument();
  });

  test("opens dropdown on click", () => {
    render(<MultiSelectDropdown options={["Option 1"]} onSelect={jest.fn()} />);
    fireEvent.click(screen.getByText("Search or add new..."));
    expect(screen.getByText("Option 1")).toBeInTheDocument();
  });

  test("selects an option and displays it", () => {
    const onSelectMock = jest.fn();
    render(
      <MultiSelectDropdown options={["Option 1"]} onSelect={onSelectMock} />
    );
    fireEvent.click(screen.getByText("Search or add new..."));
    fireEvent.click(screen.getByText("Option 1"));
    expect(onSelectMock).toHaveBeenCalledWith(["Option 1"]);
    expect(screen.getByText("Option 1")).toBeInTheDocument();
  });

  test("removes selected option on remove button click", () => {
    const onSelectMock = jest.fn();
    render(
      <MultiSelectDropdown
        options={["Option 1"]}
        onSelect={onSelectMock}
        initialSelectedOptions={["Option 1"]}
      />
    );
    fireEvent.click(screen.getByText("×"));
    expect(onSelectMock).toHaveBeenCalledWith([]);
  });

  test("adds a custom option when pressing Enter", () => {
    const onSelectMock = jest.fn();
    render(<MultiSelectDropdown options={[]} onSelect={onSelectMock} />);
    fireEvent.click(screen.getByText("Search or add new..."));
    const input = screen.getByPlaceholderText("Search or add new...");
    fireEvent.change(input, { target: { value: "New Option" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(onSelectMock).toHaveBeenCalledWith(["New Option"]);
  });
});
