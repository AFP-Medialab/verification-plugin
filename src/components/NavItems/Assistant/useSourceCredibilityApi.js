import axios from "axios";
import isEqual from "lodash/isEqual";
import uniqWith from "lodash/uniqWith";
import uniqBy from "lodash/uniqBy";

export default function useSourceCredibilityApi() {

    const sourceCredibilityUrl = process.env.REACT_APP_SOURCE_CREDIBILITY_URL;
    const unencoded_token = process.env.REACT_APP_SOURCE_CREDIBILITY_KEY;
    const unencoded_pw = process.env.REACT_APP_SOURCE_CREDIBILITY_PW;


    const filterSourceCredibility = (sourceCredibility) => {
        sourceCredibility = sourceCredibility.data
        if(sourceCredibility.entities.DomainCredibility!==undefined) {
            let domainCredibility = sourceCredibility.entities.DomainCredibility
            domainCredibility.forEach(dc => {
                delete dc["indices"]
                delete dc["credibility-resolved-url"]
            })
            sourceCredibility.entities.DomainCredibility = uniqWith(domainCredibility, isEqual)
        }
        sourceCredibility.entities.URL = uniqBy(sourceCredibility.entities.URL, 'url')
        return sourceCredibility
    }

    const callSourceCredibility = async (urlList) => {
        if (urlList.length === 0 ) return null

        let unencoded_auth = unencoded_token + ":" + unencoded_pw
        let key = btoa(encodeURI(unencoded_auth))
        let headers = {'Authorization': 'Basic ' + key, 'Content-Type': 'text/plain'}
        let urls = urlList.join(" ")

        let sourceCredibility = await axios.post(
            sourceCredibilityUrl,
            {text: urls},
            {headers: headers})

        let filteredSCScores = filterSourceCredibility(sourceCredibility)
        return filteredSCScores
    }

    return {
        callSourceCredibility
    }

}