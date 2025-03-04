import useClickOutside from "@/hooks/useClickOutside";
import React, { useState, useRef } from "react";

interface DropdownProps {
  disabled?: boolean;
  selectedOption: string;
  label?: string;
  options: string[];
  onSelect: (value: string) => unknown;
  onEndReached?: () => void;
  isLoadingOptions?: boolean;
  clearSelectedOption?: boolean;
}

const Dropdown: React.FunctionComponent<DropdownProps> = ({
  selectedOption,
  options,
  onSelect,
  onEndReached,
  isLoadingOptions,
  label,
  disabled,
  clearSelectedOption,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useClickOutside(listRef, () => setIsOpen(false));

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  const handleScroll = () => {
    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (scrollTop + clientHeight >= scrollHeight && onEndReached) {
        onEndReached();
      }
    }
  };

  return (
    <div className="relative min-h-[42px] min-w-48 mx-w-64" ref={dropdownRef}>
      <button
        className="cursor-pointer p-2 w-full min-h-[42px] h-full border border-gray-300 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-blue-600"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
      >
        {label && <span className="font-bold mr-1">{label}: </span>}
        {selectedOption || <span className="text-gray-600">Select Option</span>}
      </button>
      {isOpen && (
        <ul
          ref={listRef}
          onScroll={handleScroll}
          className="absolute left-0 w-full mt-1 min-h-[40px] max-h-48 overflow-y-auto border border-gray-300 bg-white rounded-lg shadow-lg z-1"
        >
          {selectedOption && clearSelectedOption && (
            <li
              onClick={() => handleSelect("")}
              className="p-2 hover:bg-gray-200 cursor-pointer font-bold"
            >
              {"Clear Selected"}
            </li>
          )}
          {options.map((option, index) => (
            <li
              key={index}
              onClick={() => handleSelect(option)}
              className="p-2 hover:bg-gray-200 cursor-pointer"
            >
              {option}
            </li>
          ))}
          {isLoadingOptions && (
            <p className="text-gray-500 text-sm p-2">Loading...</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
