import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "./Modal";

describe("Modal Component", () => {
  test("renders modal with title when open", () => {
    render(
      <Modal title="Test Modal" isOpen={true} onClose={jest.fn()}>
        <p>Modal Content</p>
      </Modal>
    );
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  test("does not render when isOpen is false", () => {
    render(
      <Modal title="Test Modal" isOpen={false} onClose={jest.fn()}>
        <p>Modal Content</p>
      </Modal>
    );
    expect(screen.queryByText("Test Modal")).not.toBeInTheDocument();
  });

  test("calls onClose when close button is clicked", () => {
    const onCloseMock = jest.fn();
    render(
      <Modal title="Test Modal" isOpen={true} onClose={onCloseMock}>
        <p>Modal Content</p>
      </Modal>
    );
    fireEvent.click(screen.getByText("x"));
    expect(onCloseMock).toHaveBeenCalled();
  });

  test("applies custom container class when provided", () => {
    render(
      <Modal
        title="Test Modal"
        isOpen={true}
        onClose={jest.fn()}
        containerClassName="custom-class"
      >
        <p>Modal Content</p>
      </Modal>
    );
  });
});
