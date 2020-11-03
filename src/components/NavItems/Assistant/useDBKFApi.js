import axios from "axios";

export default function useDBKFApi() {

    const dbkfAPI = process.env.REACT_APP_DBKF_API;

    const callSearchApi = async (query) => {
        query = query.replace(/[/"()’\\]/g, "")
        let searchResult = await axios.get(dbkfAPI  + "/claims?limit=20&q=" + query)
        let searchData = Object.values(searchResult.data)
        return searchData
    }

    return {
        callSearchApi
    }

}