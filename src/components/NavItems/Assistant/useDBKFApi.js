import axios from "axios";

export default function useDBKFApi() {

    const dbkfAPI = process.env.REACT_APP_DBKF_API;
    const similarityAPI = process.env.REACT_APP_SIMILARITY_API

    const callSearchApi = async (query) => {
        query = query.replace(/[/"()’\\]/g, "")
        let searchResult = await axios.get(dbkfAPI  + "/claims?limit=5&q=" + query)
        let searchData = Object.values(searchResult.data)
        return searchData
    }

    const callSimilarityApi = async (url) => {
        let final_url = similarityAPI + encodeURIComponent(url)
        let searchResult = await axios.get(final_url)
        let searchData = Object.values(searchResult.data)
        return searchData
    }

    return {
        callSearchApi,
        callSimilarityApi
    }

}