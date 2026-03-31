import { useMutation } from "@tanstack/react-query";

import { searchCimple } from "../api/searchCimple";

/**
 * React hook that provides a mutation for searching the CIMPLE API.
 * @returns {Object} Mutation object with mutate, mutateAsync, data, error, isPending, etc.
 */
export const useCimpleSearch = () => {
  return useMutation({
    mutationFn: searchCimple,
  });
};
