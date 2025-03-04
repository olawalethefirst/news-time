import { newsSources } from "@/constants";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StoredPreferences } from "@/components/NewsPreferences/NewsPreferences";
import { NewsItemType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

const defaultNewsResponse = {
  news: [] as NewsItemType[],
  pagination: {
    page: 1,
    total: 1,
    limit: 10,
  },
};
const defaultCategoriesResponse = {
  categories: [] as string[],
  pagination: {
    page: 1,
    total: 1,
  },
};

export default function useNews(storedPreferences: StoredPreferences) {
  const sourceOptions = useMemo(() => {
    const filteredOptions =
      Object.keys(storedPreferences).length > 0
        ? newsSources.filter((source) => storedPreferences[source.key]?.enabled)
        : newsSources;

    return filteredOptions.map((source) => source.label);
  }, [storedPreferences]);
  const [selectedSource, setSelectedSource] = useState(sourceOptions[0]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedSourceKey = useMemo(() => {
    return newsSources.find((source) => source.label === selectedSource)?.key;
  }, [selectedSource]);

  const fetchNews = useMemo(() => {
    return (
      newsSources.find((source) => source.key === selectedSourceKey)?.features
        .fetchNews || (async () => defaultNewsResponse)
    );
  }, [selectedSourceKey]);
  const fetchCategories = useMemo(() => {
    return (
      newsSources.find((source) => source.key === selectedSourceKey)?.features
        .fetchCategories || (() => defaultCategoriesResponse)
    );
  }, [selectedSourceKey]);
  const { data: categoriesResponse, isFetching: loadingCategories } = useQuery({
    queryKey: [selectedSource, fetchCategories],
    queryFn: () => fetchCategories({}),
    initialData: defaultCategoriesResponse,
    throwOnError: false,
  });
  const categoryOptions = useMemo(() => {
    const existingPreferences =
      storedPreferences[selectedSourceKey ?? ""]?.categories || [];
    return existingPreferences.length > 0
      ? existingPreferences
      : categoriesResponse.categories;
  }, [selectedSourceKey, storedPreferences, categoriesResponse]);
  const {
    data: newsResponse,
    isFetching: loadingNews,
    error,
  } = useQuery({
    queryKey: [
      fetchNews,
      searchQuery,
      page,
      selectedSource,
      selectedCategory,
      fromDate,
      toDate,
    ],
    queryFn: () =>
      fetchNews({
        searchQuery,
        page,
        categories: selectedCategory ? [selectedCategory] : undefined,
        fromDate,
        toDate,
        authors: storedPreferences[selectedSourceKey ?? ""]?.authors || [],
      }),
    initialData: defaultNewsResponse,
    throwOnError: false,
  });

  const updatePage = useCallback((page: number) => {
    if (page > 0) {
      setPage(page);
    }
  }, []);
  const updateDateRange = useCallback(([from, to]: [string, string]) => {
    if (from && to) {
      setFromDate(from);
      setToDate(to);
    }
  }, []);

  useEffect(() => {
    setSelectedCategory("");
  }, [categoryOptions]);
  useEffect(() => {
    setSelectedSource(sourceOptions[0]);
  }, [sourceOptions]);
  useEffect(() => {
    updatePage(1);
  }, [
    selectedSource,
    searchQuery,
    selectedCategory,
    fromDate,
    toDate,
    updatePage,
  ]);
  useEffect(() => {
    if (error) toast.error("Error loading news, please try again");
  }, [error]);

  return {
    sourceOptions,
    selectedSource,
    setSelectedSource,
    news: {
      isLoading: loadingNews,
      items: newsResponse.news,
      page,
      total: newsResponse.pagination.total,
    },
    categories: {
      items: categoryOptions,
      isLoading: loadingCategories,
    },
    updatePage,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    updateDateRange,
  };
}
