import React, { useState } from "react";

interface DateRangeProps {
  onDateChange: (dateRange: [string, string]) => unknown;
}

const DateRange: React.FunctionComponent<DateRangeProps> = ({
  onDateChange,
}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
    onDateChange([e.target.value, endDate]);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
    onDateChange([startDate, e.target.value]);
  };

  return (
    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
      <input
        type="date"
        value={startDate}
        onChange={handleStartDateChange}
        className="p-2 w-1/2 border-r border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        role="textbox"
      />
      <input
        type="date"
        value={endDate}
        onChange={handleEndDateChange}
        className="p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        role="textbox"
      />
    </div>
  );
};

export default DateRange;
