import axios from "axios";

export default function useOcrService() {

    const ocrApi = process.env.REACT_APP_OCR_API


    const callOcrService = async (url) => {
        let final_url = ocrApi
        let searchResult = await axios.post(final_url,  url,  {headers: { 'Content-Type': 'text/plain' }})
        let searchData = Object.values(searchResult.data)
        return searchData
    }

    return {
        callOcrService
    }

}