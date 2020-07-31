import axios from "axios";

export default function useAssistantApi() {

    const assistantScrapeUrl = process.env.REACT_APP_ASSISTANT_URL;

    const callAssistantScraper = async (urlType, userInput) => {
        try {
            let scrapeResult = await axios.get(assistantScrapeUrl  + urlType +  "/" + userInput)
            if (scrapeResult.data.status === "success") {
                return scrapeResult.data
            }
            else {throw new Error(scrapeResult.data.message)}
        }
        catch (error) {
            if (!(error.isAxiosError)) {
                throw new Error(error.message)
            }
            else{
                throw new Error("An unexpected assistant error has occurred. If the problem persists, contact support.")
            }
        }
    }

    return {
        callAssistantScraper
    }

}