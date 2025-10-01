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

  const baseUrl = process.env.REACT_APP_SEMANTIC_SEARCH_URL;

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

  const response = await axios.post(baseUrl, data, { params: params });

  if (!response.data || !response.data.fact_checks) {
    //TODO: Error handling
    return [];
  }

  // Transform response data into SemanticSearchResult objects
  const resArr = [];
  for (const searchResult of response.data.fact_checks) {
    const semanticSearchResult = {
      id: searchResult.id,
      claimTranslated: searchResult.claim_en,
      titleTranslated: searchResult.title_en,
      claimOriginalLanguage: searchResult.claim,
      titleOriginalLanguage: searchResult.title,
      rating: searchResult.rating,
      date: searchResult.published_at,
      website: searchResult.source_name,
      language: searchResult.source_language,
      similarityScore: searchResult.score,
      articleUrl: searchResult.url,
      domainUrl: searchResult.source_name,
      imageUrl: searchResult.image_url,
    };
    resArr.push(semanticSearchResult);
  }

  return resArr;
};
