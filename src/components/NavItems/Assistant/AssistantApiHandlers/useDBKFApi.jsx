import axios from "axios";

export default function DBKFApi() {
  const dbkfAPI = import.meta.env.VITE_DBKF_SEARCH_API;

  function cleanQuery(query) {
    // Remove the non-alphanumeric suffixes, since the TextSimilarityEndpoint doesn't seem to like them
    while (query.length > 0 && !/[a-zA-Z0-9]/.test(query[query.length - 1])) {
      query = query.slice(0, -1);
    }
    return query;
  }

  const callTextSimilarityEndpoint = async (query) => {
    /* if (... probably "when") this breaks: encodeURIComponent encodes line breaks, nbsp etc. according to utf-8
            https://www.w3schools.com/tags/ref_urlencode.ASP. but this call can't seem to handle any "space" except %20.
            even %20%20 breaks it. >1 space/newlines/breaks etc. removed on server side for the time being.  */
    let finalUri =
      dbkfAPI +
      "/documents?&limit=5&orderBy=score&q=" +
      encodeURIComponent(
        cleanQuery(query.replace(/["\\/\n|\-\[\]\(\)]/g, " ")),
      );
    let searchResult = await axios.get(finalUri);
    if (searchResult && searchResult.data) {
      return searchResult.data.documents;
    }
    return [];
  };

  return {
    callTextSimilarityEndpoint,
  };
}
