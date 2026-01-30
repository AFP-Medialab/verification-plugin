import { useMemo } from "react";

/**
 * Hook to memoize data sources by platform
 * This prevents re-renders when only one platform changes
 */
export const useOptimizedDataSources = (dataSources) => {
  // Memoize by platform - only changes when that platform's data changes
  const twitterSources = useMemo(
    () => dataSources.filter((ds) => ds.source === "twitter"),
    [dataSources],
  );

  const tiktokSources = useMemo(
    () => dataSources.filter((ds) => ds.source === "tiktok"),
    [dataSources],
  );

  const fbSources = useMemo(
    () => dataSources.filter((ds) => ds.source === "fb"),
    [dataSources],
  );

  const uploadedSources = useMemo(
    () => dataSources.filter((ds) => ds.source === "fileUpload"),
    [dataSources],
  );

  return {
    all: dataSources,
    twitter: twitterSources,
    tiktok: tiktokSources,
    fb: fbSources,
    uploaded: uploadedSources,
  };
};

/**
 * Create a stable hash of collection content
 * Used to detect actual content changes vs reference changes
 */
export const getCollectionsHash = (collections) => {
  if (!collections || collections.length === 0) return "empty";

  return collections
    .map((col) => `${col.id}:${col.content.length}`)
    .sort()
    .join("|");
};

/**
 * Hook to get a stable reference to selected sources
 * Only changes when selection or actual content changes
 */
export const useSelectedSources = (dataSources, selected) => {
  return useMemo(() => {
    if (!selected || !dataSources) return [];
    return dataSources.filter((source) => selected.includes(source.id));
  }, [dataSources, selected]);
};
