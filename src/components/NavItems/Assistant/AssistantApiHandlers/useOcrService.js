import axios from "axios";

export default function useOcrService() {

    const ocrApi = process.env.REACT_APP_OCR_API
    const unencoded_token = process.env.REACT_APP_SOURCE_CREDIBILITY_KEY
    const unencoded_pw = process.env.REACT_APP_SOURCE_CREDIBILITY_PW

    const callOcrService = async (urlList) => {
        let unencoded_auth = unencoded_token + ":" + unencoded_pw
        let key = btoa(encodeURI(unencoded_auth))
        let headers = {'Authorization': 'Basic ' + key, 'Content-Type': 'text/plain'}
        let urls = urlList.join(" ")

        const result = await axios.post(
            ocrApi,
            {text: urls},
            {headers: headers})

        return result.data

    }

    return {
        callOcrService
    }

}