import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import DateRange from "./DateRange";

describe("DateRange Component", () => {
  test("renders two date inputs", () => {
    render(<DateRange onDateChange={jest.fn()} />);

    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(2);
  });

  test("calls onDateChange when start date is changed", () => {
    const onDateChangeMock = jest.fn();
    render(<DateRange onDateChange={onDateChangeMock} />);

    const startDateInput = screen.getAllByRole("textbox")[0];
    fireEvent.change(startDateInput, { target: { value: "2025-03-04" } });

    expect(onDateChangeMock).toHaveBeenCalledWith(["2025-03-04", ""]);
  });

  test("calls onDateChange when end date is changed", () => {
    const onDateChangeMock = jest.fn();
    render(<DateRange onDateChange={onDateChangeMock} />);

    const endDateInput = screen.getAllByRole("textbox")[1];
    fireEvent.change(endDateInput, { target: { value: "2025-03-10" } });

    expect(onDateChangeMock).toHaveBeenCalledWith(["", "2025-03-10"]);
  });

  test("updates both start and end dates correctly", () => {
    const onDateChangeMock = jest.fn();
    render(<DateRange onDateChange={onDateChangeMock} />);

    const [startDateInput, endDateInput] = screen.getAllByRole("textbox");

    fireEvent.change(startDateInput, { target: { value: "2025-03-04" } });
    fireEvent.change(endDateInput, { target: { value: "2025-03-10" } });

    expect(onDateChangeMock).toHaveBeenCalledWith(["2025-03-04", ""]);
    expect(onDateChangeMock).toHaveBeenCalledWith(["2025-03-04", "2025-03-10"]);
  });
});
