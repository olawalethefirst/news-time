import useClickOutside from "@/hooks/useClickOutside";
import React, { useState, useMemo, useRef } from "react";

interface MultiSelectDropdownProps {
  placeholder?: string;
  initialSelectedOptions?: string[];
  options: string[];
  onSelect: (options: string[]) => unknown;
  isLoadingOptions?: boolean;
  onSearchInput?: (searchInput: string) => unknown;
  maxSelection?: number;
  disabled?: boolean;
  onOptionEndReached?: () => unknown;
}
const MultiSelectDropdown: React.FunctionComponent<
  MultiSelectDropdownProps
> = ({
  placeholder = "Search or add new...",
  options,
  onSelect,
  isLoadingOptions,
  onSearchInput,
  maxSelection,
  disabled,
  onOptionEndReached,
  initialSelectedOptions
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(initialSelectedOptions || []);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const filteredOptions = useMemo(() => {
    return options.filter((option) => !selectedOptions.includes(option));
  }, [selectedOptions, options]);

  const dropdownRef = useRef(null);
  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleSelect = (option: string) => {
    if (!selectedOptions.includes(option)) {
      if (maxSelection && selectedOptions.length >= maxSelection) {
        return;
      }

      const updatedSelection = [...selectedOptions, option];
      setSelectedOptions(updatedSelection);
      onSelect(updatedSelection);
    }
  };

  const handleRemove = (option: string) => {
    const updatedSelection = selectedOptions.filter((item) => item !== option);
    setSelectedOptions(updatedSelection);
    onSelect(updatedSelection);
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onSearchInput?.(e.target.value);
  };

  const handleAddCustomOption = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim()) {
      e.preventDefault();
      if (!selectedOptions.includes(search)) {
        handleSelect(search);
      }
      setSearch("");
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLUListElement, UIEvent>) => {
    if (
      onOptionEndReached &&
      e.target instanceof HTMLElement &&
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight
    ) {
      onOptionEndReached();
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className={`p-2 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          disabled ? "opacity-[0.5]" : ""
        }`}
        onClick={() => !disabled && setIsOpen((opened) => !opened)}
      >
        {selectedOptions.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedOptions.map((option, index) => (
              <span
                key={index}
                className="bg-blue-500 text-white text-sm px-2 py-1 rounded flex items-center"
              >
                {option}
                <button
                  className="ml-2 text-xs text-white hover:text-gray-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(option);
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : (
          placeholder
        )}
      </div>
      {isOpen && (
        <div className="absolute w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-2 z-10">
          <input
            type="text"
            value={search}
            onChange={handleSearchInput}
            onKeyDown={handleAddCustomOption}
            placeholder={placeholder}
            className="w-full p-2 border-b border-gray-300 focus:outline-none"
          />

          {isLoadingOptions ? (
            <p className="text-gray-500 text-sm p-2">Loading...</p>
          ) : (
            <ul className="max-h-48 overflow-y-auto" onScroll={handleScroll}>
              {filteredOptions.map((option, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
