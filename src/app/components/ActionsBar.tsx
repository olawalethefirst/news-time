"use client";
import React, { useState } from "react";
import SearchBar from "@/components/SearchBar/SearchBar";
import Dropdown from "@/components/Dropdown/Dropdown";
import DateRange from "@/components/DateRange/DateRange";
import NewsPreferences, {
  DataSource,
  StoredPreferences,
} from "./NewsPreferences/NewsPreferences";

interface ActionsBarProps {
  sources: string[];
  selectedSource: string;
  onSelectSource: (source: string) => unknown;
  categories: string[] | null;
  selectedCategory: string;
  onSelectCategories?: (author: string) => unknown;
  onEndOfCategoriesReached?: () => unknown;
  onSearch: (seachParam: string) => unknown;
  preferenceConfig: DataSource[];
  storedPreferences: StoredPreferences;
  onSavePreferences: (string: StoredPreferences) => unknown;
  onDateRangeUpdate: (param: [string, string]) => unknown;
}
const ActionsBar = ({
  sources,
  selectedSource,
  onSelectSource,
  categories,
  selectedCategory,
  onSelectCategories = () => {},
  onEndOfCategoriesReached,
  onSearch,
  preferenceConfig,
  storedPreferences,
  onSavePreferences,
  onDateRangeUpdate,
}: ActionsBarProps) => {
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);

  return (
    <>
      <div>
        <button
          type="submit"
          className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={() => setShowPreferencesModal(true)}
        >
          Personalize
        </button>
        <div className="mt-4">
          <SearchBar onSearch={onSearch} />
        </div>
        <div className="flex gap-4 justify-between flex-col md:flex-row ">
          <Dropdown
            options={sources}
            onSelect={onSelectSource}
            label="Model"
            selectedOption={selectedSource}
          />
          <DateRange onDateChange={onDateRangeUpdate} />
          <Dropdown
            options={categories || []}
            onSelect={onSelectCategories}
            onEndReached={onEndOfCategoriesReached}
            label="Categories"
            disabled={!categories}
            selectedOption={selectedCategory}
            clearSelectedOption
          />
        </div>
      </div>

      <NewsPreferences
        isOpen={showPreferencesModal}
        onClose={() => setShowPreferencesModal(false)}
        onSave={onSavePreferences}
        sourcesConfig={preferenceConfig}
        storedPreferences={storedPreferences}
      />
    </>
  );
};
export default ActionsBar;
