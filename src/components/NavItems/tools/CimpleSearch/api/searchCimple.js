import axios from "axios";

import { createUrl } from "../utils/cimpleUtils";

/**
 * Searches the CIMPLE API with the given parameters.
 * @param {object} params
 * @param {string} params.text - Free text search
 * @param {dayjs.Dayjs|null} params.fromDate
 * @param {dayjs.Dayjs|null} params.toDate
 * @param {Object.<string, Array<{code: string, title: string}>>} params.selectedFilters
 * @returns {Promise<Array>} The search results
 */
export const searchCimple = async ({
  text,
  fromDate,
  toDate,
  selectedFilters,
}) => {
  const baseUrl = import.meta.env.VITE_CIMPLE_API;
  const url = createUrl(baseUrl, { text, fromDate, toDate, selectedFilters });
  const res = await axios.get(url);
  return res.data;
};
