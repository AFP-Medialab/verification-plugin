import axios from "axios";

export default function useDBKFApi() {

    const dbkfAPI = process.env.REACT_APP_DBKF_SEARCH_API;
    const similarityAPI = process.env.REACT_APP_DBKF_SIMILARITY_API

    const callTextSimilarityEndpoint = async (query) => {
        let searchResult = await axios.get(dbkfAPI  + "/claims?&q=" + query)
        let searchData = Object.values(searchResult.data)
        return searchData
    }

    const callVideoSimilarityEndpoint = async ( url) => {
        let final_url = similarityAPI + "/similarVideos?&collection_id=similarity&url=" + encodeURIComponent(url)
        let searchResult = await axios.get(final_url)
        let searchData = Object.values(searchResult.data)
        return searchData
    }

    const callImageSimilarityEndpoint = async ( url) => {
        let final_url = similarityAPI + "/similarImages?&collection_id=similarity&url=" + encodeURIComponent(url)
        let searchResult = await axios.get(final_url)
        let searchData = Object.values(searchResult.data)
        return searchData
    }

    return {
        callTextSimilarityEndpoint,
        callImageSimilarityEndpoint,
        callVideoSimilarityEndpoint
    }

}