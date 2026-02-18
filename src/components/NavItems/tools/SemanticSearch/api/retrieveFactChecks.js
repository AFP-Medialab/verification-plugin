import axios from "axios";
import dayjs from "dayjs";

/**
 * Retrieves the first 1000 fact checks for the chosen query string and parameters
 * @param {string} searchString - The text to search for
 * @param {string} searchMethod - The search method to use
 * @param {RetrieveFactChecksOptions} options - Additional search options
 * @returns {Promise<SemanticSearchResult[]>} Promise that resolves to array of SemanticSearchResult objects
 */
export const retrieveFactChecks = async (
  searchString,
  searchMethod,
  options = {},
) => {
  if (typeof searchString !== "string") {
    throw new Error(
      "[retrieveFactChecks] Error: Invalid type for parameter searchString",
    );
  }

  if (typeof searchMethod !== "string") {
    throw new Error(
      "[retrieveFactChecks] Error: Invalid type for parameter searchMethod",
    );
  }

  const {
    languageFilter = [],
    dateFrom = null,
    dateTo = null,
    currentLang,
    languageDictionary,
    getAllLanguageKeysForLocalizedLanguage,
  } = options;

  const baseUrl = import.meta.env.VITE_SEMANTIC_SEARCH_URL;

  if (!baseUrl) {
    throw new Error(
      "[retrieveFactChecks] Error: REACT_APP_SEMANTIC_SEARCH_URL environment variable is not configured",
    );
  }

  const params = new URLSearchParams();

  params.append("search_method", searchMethod);
  params.append("time_decay", "true");
  params.append("limit", "100");

  for (const language of languageFilter) {
    const duplicateLanguageKeys = getAllLanguageKeysForLocalizedLanguage(
      language.title,
      currentLang,
      languageDictionary,
    );

    for (const key of duplicateLanguageKeys) {
      params.append("language", key);
    }
  }

  dateFrom &&
    dayjs(dateFrom).isValid() &&
    params.append("published_date_from", dayjs(dateFrom).format("YYYY-MM-DD"));

  dateTo &&
    dayjs(dateTo).isValid() &&
    params.append("published_date_to", dayjs(dateTo).format("YYYY-MM-DD"));

  const data = {
    text: searchString,
  };

  let response;
  try {
    response = await axios.post(baseUrl, data, { params: params });
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      throw new Error(
        "[retrieveFactChecks] Error: Request timeout - the server took too long to respond",
      );
    }
    if (error.response?.status === 429) {
      throw new Error(
        "[retrieveFactChecks] Error: Rate limit exceeded - too many requests",
      );
    }
    if (error.response?.status === 500) {
      throw new Error(
        "[retrieveFactChecks] Error: Server error - the semantic search service is temporarily unavailable",
      );
    }
    if (error.response?.status === 403) {
      throw new Error(
        "[retrieveFactChecks] Error: Access forbidden - invalid API credentials",
      );
    }
    // Re-throw the original error with additional context
    throw new Error(
      `[retrieveFactChecks] Error: Network request failed - ${error.message}`,
    );
  }

  if (!response.data) {
    throw new Error(
      "[retrieveFactChecks] Error: Invalid API response - no data received",
    );
  }

  if (!response.data.fact_checks) {
    throw new Error(
      "[retrieveFactChecks] Error: Invalid API response - no fact_checks data",
    );
  }

  if (!Array.isArray(response.data.fact_checks)) {
    throw new Error(
      "[retrieveFactChecks] Error: Invalid API response - fact_checks is not an array",
    );
  }

  // Transform response data into SemanticSearchResult objects
  const resArr = [];
  for (let i = 0; i < response.data.fact_checks.length; i++) {
    const searchResult = response.data.fact_checks[i];

    try {
      // Validate required fields
      if (!searchResult || typeof searchResult !== "object") {
        console.warn(
          `[retrieveFactChecks] Warning: Skipping invalid fact check item at index ${i}`,
        );
        continue;
      }

      const semanticSearchResult = {
        id: searchResult.id || null,
        claimTranslated: searchResult.claim_en || "",
        titleTranslated: searchResult.title_en || "",
        claimOriginalLanguage: searchResult.claim || "",
        titleOriginalLanguage: searchResult.title || "",
        rating: searchResult.rating || "",
        date: searchResult.published_at || "",
        website: searchResult.source_name || "",
        language: searchResult.source_language || "",
        similarityScore: searchResult.score || 0,
        articleUrl: searchResult.url || "",
        domainUrl: searchResult.source_name || "",
        imageUrl: searchResult.image_url || "",
      };
      resArr.push(semanticSearchResult);
    } catch (transformError) {
      console.warn(
        `[retrieveFactChecks] Warning: Failed to transform fact check item at index ${i}:`,
        transformError,
      );
      // Continue processing other items instead of failing completely
      continue;
    }
  }

  if (resArr.length === 0 && response.data.fact_checks.length > 0) {
    throw new Error(
      "[retrieveFactChecks] Error: All fact check items were invalid or could not be processed",
    );
  }

  return resArr;
};
