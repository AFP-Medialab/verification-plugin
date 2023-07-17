/**
 * Creates a compressed string with the start and end of the string to reduce visual load in the UI.
 * @param {string} str
 * @returns {string} The substring of the first 65 characters and the last 5
 */
export const prettifyLargeString = (str) => {
  return str.length > 65
    ? `${str.slice(0, 65)} ... ${str.slice(str.length - 5, str.length)}`
    : str;
};
