/**
 * Creates a compressed string with the start and end of the string to reduce visual load in the UI.
 * @param {string} str
 * @param {?number} maxSize
 * @returns {string} The substring of the first 65 characters and the last 5
 */
export const prettifyLargeString = (str, maxSize) => {
  let maxLength = maxSize ?? 65;
  return str && str.length > maxLength
    ? `${str.slice(0, maxLength)} ... ${str.slice(str.length - 5, str.length)}`
    : str;
};
