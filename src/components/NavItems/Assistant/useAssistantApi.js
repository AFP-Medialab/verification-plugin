import axios from "axios";

export default function useAssistantApi() {

    const assistantScrapeUrl = process.env.REACT_APP_ASSISTANT_URL;

    const callAssistantScraper = async (urlType, userInput) => {
        let scrapeResult = await axios.get(assistantScrapeUrl + urlType + "/" + userInput)
        return scrapeResult.data
    }

    return {
        callAssistantScraper
    }

}