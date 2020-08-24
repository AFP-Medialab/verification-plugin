import axios from "axios";

export default function useDBKFApi() {

    const dbkfAPI = process.env.REACT_APP_DBKF_API;

    const callSearchApi = async (query) => {
        let searchResult = await axios.get(dbkfAPI  + "/claims?&q=" + query)
        let searchData = Object.values(searchResult.data)
        return searchData
    }

    return {
        callSearchApi
    }

}