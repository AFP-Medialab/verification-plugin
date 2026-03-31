import { useQuery } from "@tanstack/react-query";

import { fetchFilters } from "../api/fetchFilters";

/**
 * React hook that fetches available CIMPLE filter options.
 * @returns {Object} Query object with data, isLoading, error, etc.
 */
export const useCimpleFilters = () => {
  return useQuery({
    queryKey: ["cimpleFilters"],
    queryFn: fetchFilters,
    staleTime: 5 * 60 * 1000,
  });
};
