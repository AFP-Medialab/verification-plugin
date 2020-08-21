import axios from "axios";

export default function useDBKFApi() {

    const dbkfAPI = process.env.REACT_APP_DBKF_API;

    const callSearchApi = async (query) => {
        try {
            let searchResult = await axios.get(dbkfAPI  + "/claims?&q=" + query)
            let searchData = Object.values(searchResult.data)
            return searchData
        }
        catch (error) {
            //todo: graceful handling please
            console.log(error)
        }
    }

    return {
        callSearchApi
    }

}