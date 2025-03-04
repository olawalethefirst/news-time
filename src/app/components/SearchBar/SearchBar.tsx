"use client";

import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (searchQuery: string) => unknown;
}

const SearchBar: React.FunctionComponent<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearchEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSearchEvent} className="mb-4 flex items-center gap-2">
      <input
        type="text"
        placeholder="Search news..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
      <button
        type="submit"
        className="px-4 py-2 border-1 cursor-pointer border-blue-600 text-blue-600 rounded-lg hover: hover:text-blue-700 transition"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
