import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Dropdown from "./Dropdown";

describe("Dropdown Component", () => {
  test("renders button with default text when no option is selected", () => {
    render(<Dropdown selectedOption="" options={[]} onSelect={jest.fn()} />);
    expect(screen.getByText("Select Option")).toBeInTheDocument();
  });

  test("renders selected option when provided", () => {
    render(
      <Dropdown
        selectedOption="Option 1"
        options={["Option 1", "Option 2"]}
        onSelect={jest.fn()}
      />
    );
    expect(screen.getByText("Option 1")).toBeInTheDocument();
  });

  test("opens dropdown when clicked", () => {
    render(
      <Dropdown selectedOption="" options={["Option 1"]} onSelect={jest.fn()} />
    );
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("Option 1")).toBeInTheDocument();
  });

  test("calls onSelect when an option is clicked", () => {
    const onSelectMock = jest.fn();
    render(
      <Dropdown
        selectedOption=""
        options={["Option 1"]}
        onSelect={onSelectMock}
      />
    );

    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByText("Option 1"));

    expect(onSelectMock).toHaveBeenCalledWith("Option 1");
  });

  test("closes dropdown when an option is selected", () => {
    render(
      <Dropdown selectedOption="" options={["Option 1"]} onSelect={jest.fn()} />
    );

    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByText("Option 1"));

    expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
  });

  test("displays 'Clear Selected' when clearSelectedOption is true and an option is selected", () => {
    render(
      <Dropdown
        selectedOption="Option 1"
        options={["Option 1", "Option 2"]}
        onSelect={jest.fn()}
        clearSelectedOption={true}
      />
    );

    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("Clear Selected")).toBeInTheDocument();
  });

  test("calls onSelect with empty string when 'Clear Selected' is clicked", () => {
    const onSelectMock = jest.fn();
    render(
      <Dropdown
        selectedOption="Option 1"
        options={["Option 1", "Option 2"]}
        onSelect={onSelectMock}
        clearSelectedOption={true}
      />
    );

    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByText("Clear Selected"));

    expect(onSelectMock).toHaveBeenCalledWith("");
  });
});
