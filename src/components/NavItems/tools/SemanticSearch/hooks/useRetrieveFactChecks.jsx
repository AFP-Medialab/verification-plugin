import { useMutation } from "@tanstack/react-query";

import { retrieveFactChecks } from "../api";

/**
 * @typedef {import('../typedefs.js').SemanticSearchResult} SemanticSearchResult
 * @typedef {import('../typedefs.js').RetrieveFactChecksOptions} RetrieveFactChecksOptions
 */

/**
 * React hook that provides a mutation for retrieving fact checks.
 *
 * @returns {Object} Mutation object with mutate, mutateAsync, data, error, isPending, etc.
 */
export const useRetrieveFactChecks = () => {
  return useMutation({
    mutationFn: async ({ searchString, searchMethod, options }) => {
      return await retrieveFactChecks(searchString, searchMethod, options);
    },
  });
};
