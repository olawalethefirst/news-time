import React, { FunctionComponent, useEffect, useState } from "react";
import Accordion from "@/components/Accordion/Accordion";
import MultiSelectDropdown from "../MultiSelectDropdown/MultiSelectDropdown";
import Modal from "../Modal/Modal";

const defaultSourceData = {
  enabled: true,
  categories: [],
  authors: [],
};

interface SourceData {
  enabled: boolean;
  categories: string[];
  authors: string[];
}
type SourcesData = Record<string, SourceData | undefined>;
export type StoredPreferences = Record<string, SourceData | undefined>;
export interface DataSource {
  key: string;
  label: string;
  features?: {
    categories?: {
      options?: string[];
      fetch?: () => unknown;
      search?: (parameter: string) => unknown;
      loading?: boolean;
    };
    authors?: {
      options?: string[];
      fetch?: () => unknown;
      search?: (parameter: string) => unknown;
      loading?: boolean;
    };
  };
}
interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => unknown;
  onSave: (data: StoredPreferences) => unknown;
  sourcesConfig: DataSource[];
  storedPreferences: StoredPreferences;
}
const NewsPreferences: FunctionComponent<PreferencesModalProps> = ({
  sourcesConfig,
  isOpen,
  onClose,
  onSave,
  storedPreferences = {},
}) => {
  const [sourcesData, setSourcesData] = useState<SourcesData>(() => {
    const sourcesData: Record<string, SourceData> = {};

    sourcesConfig.forEach((dataSource) => {
      sourcesData[dataSource.key] = {
        enabled:
          storedPreferences[dataSource.key]?.enabled ||
          defaultSourceData.enabled,
        categories:
          storedPreferences[dataSource.key]?.categories ||
          defaultSourceData.categories,
        authors:
          storedPreferences[dataSource.key]?.authors ||
          defaultSourceData.authors,
      };
    });

    return sourcesData;
  });
  const [openSource, setOpenSource] = useState<string | null>(null);

  const toggleAccordion = (sourceKey: string) => {
    if (sourcesData[sourceKey]?.enabled) {
      setOpenSource(openSource === sourceKey ? null : sourceKey);
    }
  };

  const toggleSource = (sourceKey: string) => {
    setSourcesData((prev) => {
      if (prev[sourceKey]) {
        const wasEnabled = prev[sourceKey]?.enabled;
        if (wasEnabled) {
          setOpenSource(null);
        } else {
          setOpenSource(sourceKey);
        }
        return {
          ...prev,
          [sourceKey]: { ...defaultSourceData, enabled: !wasEnabled },
        };
      }

      return prev;
    });
  };

  useEffect(
    () => {
      sourcesConfig.forEach((source) => {
        if (source.features?.categories?.fetch) {
          source.features?.categories.fetch();
        }
        if (source.features?.authors?.fetch) {
          source.features?.authors.fetch();
        }
      });
    },
    // fetch only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  useEffect(() => {
    if (!isOpen && Object.keys(storedPreferences).length > 0) {
      setSourcesData(storedPreferences);
    }
  }, [isOpen, storedPreferences]);

  return (
    <Modal
      title="Preferences"
      isOpen={isOpen}
      onClose={onClose}
      containerClassName="w-[300px]"
    >
      <div>
        <h3 className="font-semibold mb-2">News Sources</h3>
        {sourcesConfig.map(({ key, label, features }) => (
          <Accordion
            key={key}
            title={
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={sourcesData[key]?.enabled}
                  onChange={() => toggleSource(key)}
                />
                <span>{label}</span>
              </div>
            }
            isOpen={openSource === key}
            onToggle={() => toggleAccordion(key)}
          >
            {sourcesData[key]?.enabled && (
              <>
                <>
                  <h4 className="font-semibold mt-2">Categories</h4>
                  <MultiSelectDropdown
                    initialSelectedOptions={sourcesData[key]?.categories}
                    options={features?.categories?.options || []}
                    onSelect={(selected) => {
                      setSourcesData((prev) => ({
                        ...prev,
                        [key]: {
                          ...(prev[key] || defaultSourceData),
                          categories: selected,
                        },
                      }));
                    }}
                    maxSelection={5}
                    placeholder="Enter up to five options"
                    isLoadingOptions={features?.categories?.loading}
                    onSearchInput={features?.categories?.search}
                    disabled={!features?.categories}
                  />
                </>

                <>
                  <h4 className="font-semibold">Authors</h4>
                  <MultiSelectDropdown
                    initialSelectedOptions={sourcesData[key]?.authors}
                    options={features?.authors?.options || []}
                    onSelect={(selected) => {
                      setSourcesData((prev) => ({
                        ...prev,
                        [key]: {
                          ...(prev[key] || defaultSourceData),
                          authors: selected,
                        },
                      }));
                    }}
                    maxSelection={5}
                    placeholder="Enter up to five options"
                    onSearchInput={features?.authors?.search}
                    disabled={!features?.authors}
                    isLoadingOptions={features?.authors?.loading}
                  />
                </>
              </>
            )}
          </Accordion>
        ))}

        <button
          className="cursor-pointer mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={() => {
            onSave(sourcesData);
            onClose();
          }}
        >
          save
        </button>
      </div>
    </Modal>
  );
};

export default NewsPreferences;
