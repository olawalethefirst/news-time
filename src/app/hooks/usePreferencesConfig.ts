import { newsSources } from "@/constants";
import { useCallback, useMemo, useState } from "react";

type ActionKey = "categories" | "authors";
type LoadingStates = Record<string, { categories: boolean; authors: boolean }>;
type SourceData = Record<
  string,
  {
    categories: string[];
    authors: string[];
  }
>;
type FeatureActions = {
  categories?: {
    fetch: () => unknown;
    search: (searchParam: string) => unknown;
  } | null;
  authors?: {
    fetch: () => unknown;
    search: (searchParam: string) => unknown;
  } | null;
};
interface FeatureConfig {
  key: string;
  label: string;
  features: {
    categories?: {
      fetch: () => unknown;
      search: (searchParam: string) => unknown;
      loading: boolean;
      options: string[];
    };
    authors?: {
      fetch: () => unknown;
      search: (searchParam: string) => unknown;
      loading: boolean;
      options: string[];
    };
  };
}

const usePreferencesConfig = () => {
  // associate source's data with sourceKey
  const [sourcesData, setSourcesData] = useState<SourceData>(() => {
    const loadingState: SourceData = {};
    newsSources.forEach((source) => {
      loadingState[source.key] = {
        categories: [],
        authors: [],
      };
    });

    return loadingState;
  });
  // associates source's loadingStates with sourceKey
  const [loadingSourceData, setLoadingSourceData] = useState<LoadingStates>(
    () => {
      const loadingState: LoadingStates = {};
      newsSources.forEach((source) => {
        loadingState[source.key] = {
          categories: false,
          authors: false,
        };
      });

      return loadingState;
    }
  );

  // to update data, use sourceKey, feature data type, and new state
  const updateSourcesData = useCallback(
    (sourceKey: string, actionKey: ActionKey, newState: string[]) => {
      setSourcesData((prev) => ({
        ...prev,
        [sourceKey]: {
          ...prev[sourceKey],
          [actionKey]: newState,
        },
      }));
    },
    []
  );
  // to update data, use sourceKey, feature data type, and loading state
  const updateLoadingSourceData = useCallback(
    (sourceKey: string, actionKey: ActionKey, newState: boolean) => {
      setLoadingSourceData((prev) => ({
        ...prev,
        [sourceKey]: {
          ...prev[sourceKey],
          [actionKey]: newState,
        },
      }));
    },
    []
  );

  // HOC extends data fetching action with loading & data states
  const withDataAction = useCallback(
    <
      T extends
        | ((param: string) => Promise<string[] | null>)
        | (() => Promise<string[] | null>)
    >(
      fetchData: T,
      sourceKey: string,
      actionKey: ActionKey
    ) => {
      return async (...args: Parameters<T>) => {
        updateLoadingSourceData(sourceKey, actionKey, true);
        try {
          // @ts-expect-error - the error is associated with typescript expecting a spread parameter to be of type tuple, however, the initialization of args through ...args ensures this
          const data = await fetchData(...args);
          updateSourcesData(sourceKey, actionKey, data || []);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          updateLoadingSourceData(sourceKey, actionKey, false);
        }
      };
    },
    [updateLoadingSourceData, updateSourcesData]
  );

  //creates consistent
  const sourceFeatureActions = useMemo(() => {
    const featureActions: Record<string, FeatureActions> = {};

    newsSources.forEach((source) => {
      const fetchCategories = source.features.fetchCategories;
      const fetchAuthors = source.features.fetchAuthors;

      featureActions[source.key] = {};

      if (fetchCategories) {
        featureActions[source.key].categories = {
          fetch: withDataAction(
            () => fetchCategories({}).then((data) => data.categories),
            source.key,
            "categories"
          ),
          search: withDataAction(
            (searchQuery) =>
              fetchCategories({ searchQuery }).then((data) => data.categories),
            source.key,
            "categories"
          ),
        };
      }
      if (fetchAuthors) {
        featureActions[source.key].authors = {
          fetch: withDataAction(
            () => fetchAuthors({}).then((data) => data.authors),
            source.key,
            "authors"
          ),
          search: withDataAction(
            (searchQuery) =>
              fetchAuthors({ searchQuery }).then((data) => data.authors),
            source.key,
            "authors"
          ),
        };
      }
    });

    return featureActions;
  }, [withDataAction]);

  const sourcesConfig = useMemo(() => {
    return newsSources.map(({ key, label }) => {
      const featureConfig: FeatureConfig = {
        key,
        label,
        features: {},
      };

      if (sourceFeatureActions[key].categories?.fetch) {
        featureConfig.features.categories = {
          fetch: sourceFeatureActions[key].categories.fetch,
          search: sourceFeatureActions[key].categories.search,
          options: sourcesData[key].categories,
          loading: loadingSourceData[key].categories,
        };
      }
      if (sourceFeatureActions[key].authors?.fetch) {
        featureConfig.features.authors = {
          fetch: sourceFeatureActions[key].authors.fetch,
          search: sourceFeatureActions[key].authors.search,
          options: sourcesData[key].authors,
          loading: loadingSourceData[key].authors,
        };
      }

      return featureConfig;
    });
  }, [sourceFeatureActions, sourcesData, loadingSourceData]);

  return sourcesConfig;
};

export default usePreferencesConfig;
