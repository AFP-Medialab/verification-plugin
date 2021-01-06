import axios from "axios";

export default function useAssistantApi() {

    const assistantScrapeUrl = process.env.REACT_APP_ASSISTANT_URL
    const elgEndpoint = process.env.REACT_APP_SPACY

    const callAssistantScraper = async (urlType, userInput) => {
        try {
            let scrapeResult = await axios
                .get(assistantScrapeUrl  + "scrape/" +  urlType +  "?url=" + encodeURIComponent(userInput))
            if (scrapeResult.data.status === "success") {
                return scrapeResult.data
            }
        }
        catch (error) {
            if(error.response) {throw new Error(error.response.data.message)}
            else{
                throw new Error("An unexpected assistant error has occurred. If the problem persists, contact support.")
            }
        }
    }

    const callNamedEntityService = async (text) => {

        const namedEntityResult = await axios.post(
            elgEndpoint,
            {'content': text},
            {headers: {'Content-Type': 'text/plain; charset=UTF-8'}}
        )

        return namedEntityResult.data
    }

    const callAssistantTranslator = async (lang, text) => {
        try {
            let translationResult = await axios
                .get(assistantScrapeUrl + "translate/"  + lang +  "?text=" + encodeURIComponent(text))
            if (translationResult.data.status === "success") {
                return translationResult.data
            }
        }
        catch (error) {
            if(error.response) {throw new Error(error.response.data.message)}
            else{
                throw new Error("An unexpected assistant error has occurred. If the problem persists, contact support.")
            }
        }
    }

    return {
        callAssistantScraper,
        callNamedEntityService,
        callAssistantTranslator
    }

}