import axios from "axios";
import isEqual from "lodash/isEqual";
import uniqWith from "lodash/uniqWith";
import uniqBy from "lodash/uniqBy";
import orderBy from "lodash/orderBy";

export default function useGateCloudApi() {

    const sourceCredEndpoint = process.env.REACT_APP_SOURCE_CREDIBILITY_URL;
    const hyperpartisanEndpoint = process.env.REACT_APP_HP_API;
    const ocrEndpoint = process.env.REACT_APP_OCR_API

    const unencoded_token = process.env.REACT_APP_SOURCE_CREDIBILITY_KEY;
    const unencoded_pw = process.env.REACT_APP_SOURCE_CREDIBILITY_PW;

    let unencoded_auth = unencoded_token + ":" + unencoded_pw
    let key = btoa(encodeURI(unencoded_auth))
    let headers = {'Authorization': 'Basic ' + key, 'Content-Type': 'text/plain; charset=utf-8'}


    const filterSourceCredibility = (sourceCredibility) => {
        sourceCredibility = sourceCredibility.data

        if(sourceCredibility.entities.DomainCredibility===undefined) {
            return null
        }

        let domainCredibility = sourceCredibility.entities.DomainCredibility
        domainCredibility.forEach(dc => {
            delete dc["indices"]
            delete dc["credibility-resolved-url"]
        })
        sourceCredibility.entities.DomainCredibility = uniqWith(domainCredibility, isEqual)

        sourceCredibility.entities.URL = uniqBy(sourceCredibility.entities.URL, 'url')
        sourceCredibility.entities.URL = orderBy(sourceCredibility.entities.URL, 'credibility-score', 'asc');

        return sourceCredibility
    }

    const callSourceCredibilityService = (urlList) => {
        if (urlList.length === 0 ) return null

        let urls = urlList.join(" ")

        return axios.post(
            sourceCredEndpoint,
            {text: urls},
            {headers: headers})
         .then(result => filterSourceCredibility(result))
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