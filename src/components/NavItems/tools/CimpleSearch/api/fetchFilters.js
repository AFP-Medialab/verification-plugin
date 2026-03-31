import axios from "axios";

const FILTER_KEYS = [
  "entity",
  "veracity",
  "language",
  "organization",
  "conspiracyTheory",
  "politicalLeaning",
  "sentiment",
  "emotion",
  "graph",
];

/** Converts a filters API dict { code: label } to [{ code, title }] */
const toOptions = (obj) =>
  Object.entries(obj ?? {}).map(([code, title]) => ({ code, title }));

/**
 * Fetches the available filter options from the CIMPLE API.
 * @returns {Promise<Object.<string, Array<{code: string, title: string}>>>}
 */
export const fetchFilters = async () => {
  const baseUrl = import.meta.env.VITE_CIMPLE_API;

  const res = await axios.get(`${baseUrl}/filters`);

  const mapped = {};
  FILTER_KEYS.forEach((key) => {
    mapped[key] = toOptions(res.data[key]);
  });
  return mapped;
};

export { FILTER_KEYS };
