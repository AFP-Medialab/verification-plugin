import dayjs from "dayjs";

/**
 * Builds the search URL for the CIMPLE search API.
 * @param {string} baseUrl - The base URL
 * @param {object} formValues
 * @param {string} formValues.text - Free text search
 * @param {dayjs.Dayjs|null} formValues.fromDate
 * @param {dayjs.Dayjs|null} formValues.toDate
 * @param {Object.<string, Array<{code: string, title: string}>>} formValues.selectedFilters - keyed by filter name
 * @returns {string} The full URL to call the CIMPLE search API with the given parameters
 */
export const createUrl = (
  baseUrl,
  { text, fromDate, toDate, selectedFilters },
) => {
  const params = new URLSearchParams();
  if (text) params.set("q", text);
  if (fromDate && dayjs(fromDate).isValid())
    params.set("from", dayjs(fromDate).format("YYYY-MM-DD"));
  if (toDate && dayjs(toDate).isValid())
    params.set("to", dayjs(toDate).format("YYYY-MM-DD"));
  Object.entries(selectedFilters).forEach(([key, values]) => {
    values.forEach((v) => params.append(`${key}[]`, v.code));
  });
  return `${baseUrl}/search?${params.toString()}`;
};

/**
 * Converts a filter value code (possibly a URI) to a clean i18n key suffix.
 * For URIs, extracts the last path segment. For plain strings, replaces
 * non-alphanumeric characters with underscores.
 * @param {string} code
 * @returns {string}
 */
export const toFilterValueKey = (code) => {
  if (!code) return "";
  try {
    const url = new URL(code);
    return (url.pathname.split("/").filter(Boolean).pop() ?? "").replace(
      /[^a-zA-Z0-9]/g,
      "_",
    );
  } catch {
    return code.replace(/[^a-zA-Z0-9]/g, "_");
  }
};

/**
 * Given a CIMPLE review URI, returns the corresponding explorer link.
 * @param {string} uri - The CIMPLE review URI (e.g. "http://data.cimple.eu/reviews/123")
 * @returns {string} The corresponding explorer link (e.g. "https://explorer.cimple.eu/reviews/123")
 */
export const getExplorerLink = (uri) => {
  if (!uri) return "#";
  return uri.replace(
    "http://data.cimple.eu/",
    "https://explorer.cimple.eu/reviews/",
  );
};
