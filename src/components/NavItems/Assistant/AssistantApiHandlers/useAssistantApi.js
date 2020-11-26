import axios from "axios";

export default function useAssistantApi() {

    const assistantScrapeUrl = process.env.REACT_APP_ASSISTANT_URL
    const elgEndpoint = process.env.REACT_APP_SPACY

    const callAssistantScraper = async (urlType, userInput) => {
        try {
            let scrapeResult = await axios
                .get(assistantScrapeUrl  + urlType +  "?url=" + encodeURIComponent(userInput))
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

        console.log("jh" + namedEntityResult)
        return namedEntityResult.data
    }

    return {
        callAssistantScraper,
        callNamedEntityService
    }

}