/**
 * @fileoverview Type definitions for Semantic Search API
 */

/**
 * Individual fact check result from the API
 * @typedef {Object} FactCheckItem
 * @property {number} id - Unique identifier for the fact check
 * @property {number} score - Similarity score (0-1)
 * @property {string} claim - Original claim text
 * @property {string} claim_en - English translation of the claim
 * @property {string} title - Original title
 * @property {string} title_en - English translation of the title
 * @property {string} url - URL to the fact check article
 * @property {string} published_at - Publication date in ISO format
 * @property {string} source_language - Language code of the source
 * @property {string} source_name - Name of the source website
 * @property {string|null} search_method - Search method used (can be null)
 * @property {string} image_url - URL to associated image
 * @property {string} rating - Rating/classification of the fact check
 */

/**
 * API response structure for semantic search
 * @typedef {Object} SemanticSearchApiResponse
 * @property {FactCheckItem[]} fact_checks - Array of fact check results
 * @property {number} total - Total number of available results
 */

/**
 * Processed fact check result for the UI
 * @typedef {Object} SemanticSearchResult
 * @property {number} id - Unique identifier for the fact check
 * @property {string} claimTranslated - English translation of the claim
 * @property {string} titleTranslated - English translation of the title
 * @property {string} claimOriginalLanguage - Original claim text
 * @property {string} titleOriginalLanguage - Original title
 * @property {string} rating - Rating/classification of the fact check
 * @property {string} date - Publication date
 * @property {string} website - Source website name
 * @property {string} language - Source language code
 * @property {number} similarityScore - Similarity score (0-1)
 * @property {string} articleUrl - URL to the fact check article
 * @property {string} domainUrl - Domain/source name
 * @property {string} imageUrl - URL to associated image
 */

/**
 * Options for the retrieveFactChecks function
 * @typedef {Object} RetrieveFactChecksOptions
 * @property {Array} [languageFilter=[]] - Array of language filter objects
 * @property {Object|null} [dateFrom=null] - Date from filter (dayjs object)
 * @property {Object|null} [dateTo=null] - Date to filter (dayjs object)
 * @property {string} currentLang - Current language for localization
 * @property {Object} languageDictionary - Language dictionary for localization
 * @property {Function} getAllLanguageKeysForLocalizedLanguage - Helper function to get language keys
 */
