import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Accordion from "./Accordion";

describe("Accordion Component", () => {
  test("renders the title correctly", () => {
    render(
      <Accordion title="Test Title" isOpen={false} onToggle={jest.fn()} />
    );
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  test("calls onToggle when clicked", () => {
    const onToggleMock = jest.fn();
    render(
      <Accordion title="Click Me" isOpen={false} onToggle={onToggleMock} />
    );

    fireEvent.click(screen.getByText("Click Me"));
    expect(onToggleMock).toHaveBeenCalledTimes(1);
  });

  test("displays children when isOpen is true", () => {
    render(
      <Accordion title="Open" isOpen={true} onToggle={jest.fn()}>
        <p>Accordion Content</p>
      </Accordion>
    );

    expect(screen.getByText("Accordion Content")).toBeInTheDocument();
  });

  test("does not display children when isOpen is false", () => {
    render(
      <Accordion title="Closed" isOpen={false} onToggle={jest.fn()}>
        <p>Hidden Content</p>
      </Accordion>
    );

    expect(screen.queryByText("Hidden Content")).not.toBeInTheDocument();
  });
});
