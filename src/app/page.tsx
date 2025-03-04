"use client";

import NewsList from "@/components/NewsList/NewsList";
import ActionsBar from "@/components/ActionsBar";
import { useEffect, useState } from "react";
import Pagination from "./components/Pagination/Pagination";
import { localStorageKeys } from "./constants";
import usePreferencesConfig from "./hooks/usePreferencesConfig";
import { StoredPreferences } from "./components/NewsPreferences/NewsPreferences";
import { toast } from "react-toastify";
import useNews from "./hooks/useNews";

export default function Home() {
  const [storedPreferences, setStoredPreference] = useState<StoredPreferences>(
    {}
  );
  const preferencesConfig = usePreferencesConfig();
  const {
    sourceOptions,
    selectedSource,
    news,
    selectedCategory,
    setSelectedSource,
    categories,
    setSearchQuery,
    setSelectedCategory,
    updatePage,
    updateDateRange,
  } = useNews(storedPreferences);

  useEffect(() => {
    // set preferences on mount
    const persistedPreferences = localStorage.getItem(
      localStorageKeys.USER_PREFERENCES
    );
    if (persistedPreferences) {
      const deserializedPrefences = JSON.parse(
        persistedPreferences
      ) as StoredPreferences;
      setStoredPreference(deserializedPrefences);
    }
  }, []);
  useEffect(() => {
    // update persisted user preferences
    localStorage.setItem(
      localStorageKeys.USER_PREFERENCES,
      JSON.stringify(storedPreferences)
    );
  }, [storedPreferences]);

  return (
    <div className="container m-auto p-4">
      <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight">
        News.
      </h1>

      <div className="my-12">
        <ActionsBar
          sources={sourceOptions}
          onSelectSource={setSelectedSource}
          categories={categories.items}
          onSelectCategories={setSelectedCategory}
          onSearch={setSearchQuery}
          preferenceConfig={preferencesConfig}
          storedPreferences={storedPreferences}
          onSavePreferences={(preferences) => {
            setStoredPreference(preferences);
            toast.info("Saved preferences");
          }}
          selectedCategory={selectedCategory}
          selectedSource={selectedSource}
          onDateRangeUpdate={updateDateRange}
        />
      </div>

      <div className="my-8">
        <NewsList items={news.items} isLoading={news.isLoading} />
      </div>
      <div className="my-4">
        <Pagination
          currentPage={news.page}
          totalPages={news.total}
          onPageChange={updatePage}
        />
      </div>
    </div>
  );
}
