import axios from "axios";

export default function useGateCloudApi() {

    const sourceCredEndpoint = process.env.REACT_APP_SOURCE_CREDIBILITY_URL;
    const hyperpartisanEndpoint = process.env.REACT_APP_HP_API;
    const ocrEndpoint = process.env.REACT_APP_OCR_API

    const unencoded_token = process.env.REACT_APP_SOURCE_CREDIBILITY_KEY;
    const unencoded_pw = process.env.REACT_APP_SOURCE_CREDIBILITY_PW;

    let unencoded_auth = unencoded_token + ":" + unencoded_pw
    let key = btoa(encodeURI(unencoded_auth))
    let headers = {'Authorization': 'Basic ' + key, 'Content-Type': 'text/plain; charset=utf-8'}

    const callSourceCredibilityService = async (urlList) => {
        if (urlList.length === 0) return null

        let urls = urlList.join(" ")

        const result = await axios.post(
            sourceCredEndpoint,
            {text: urls},
            {headers: headers})

        return result.data
    }

    const callHyperpartisanService = async (text) => {
        const result = await axios.post(
            hyperpartisanEndpoint,
            {text: text},
            {headers: headers})

        return result.data
    }

    const callOcrService = async (urlList) => {
        let urls = urlList.join(" ")

        const result = await axios.post(
            ocrEndpoint,
            {text: urls},
            {headers: headers})

        return result.data
    }

    const callOcrB64Service = async (b64Img) => {
        b64Img = b64Img.replace("data:image/png;base64,", "")

        const result = await axios.post(
            ocrEndpoint, b64Img, {headers: headers})

        return result.data
    }

    return {
        callSourceCredibilityService,
        callHyperpartisanService,
        callOcrService,
        callOcrB64Service
    }

}