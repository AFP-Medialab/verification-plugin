import axios from "axios";

export default function DBKFApi() {
  const dbkfAPI = process.env.REACT_APP_DBKF_SEARCH_API;
  const similarityAPI = process.env.REACT_APP_DBKF_SIMILARITY_API;

  const callTextSimilarityEndpoint = async (query) => {
    /* if (... probably "when") this breaks: encodeURIComponent encodes line breaks, nbsp etc. according to utf-8
        https://www.w3schools.com/tags/ref_urlencode.ASP. but this call can't seem to handle any "space" except %20.
        even %20%20 breaks it. >1 space/newlines/breaks etc. removed on server side for the time being.  */
    let finalUri =
      dbkfAPI + "/claims?&limit=5&orderBy=score&q=" + encodeURIComponent(query);
    let searchResult = await axios.get(finalUri);
    let searchData = Object.values(searchResult.data);
    return searchData;
  };

  const callVideoSimilarityEndpoint = async (url) => {
    let final_url =
      similarityAPI +
      "/similarVideos?&collection_id=similarity&url=" +
      encodeURIComponent(url);
    let searchResult = await axios.get(final_url);
    let searchData = searchResult.data;
    return searchData;
  };

  const callImageSimilarityEndpoint = async (url) => {
    let final_url =
      similarityAPI +
      "/similarImages?&collection_id=similarity&url=" +
      encodeURIComponent(url);
    let searchResult = await axios.get(final_url);
    let searchData = searchResult.data;
    return searchData;
  };

  return {
    callTextSimilarityEndpoint,
    callImageSimilarityEndpoint,
    callVideoSimilarityEndpoint,
  };
}
