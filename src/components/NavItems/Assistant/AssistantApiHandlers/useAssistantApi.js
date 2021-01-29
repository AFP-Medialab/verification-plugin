import axios from "axios";

export default function useAssistantApi() {

    const assistantEndpoint = process.env.REACT_APP_ASSISTANT_URL

    const callAssistantScraper = async (urlType, userInput) => {
        try {
            let scrapeResult = await axios
                .get(assistantEndpoint  + "scrape/" +  urlType +  "?url=" + encodeURIComponent(userInput))
            if (scrapeResult.data.status === "success") {
                return scrapeResult.data
            }
        }
        catch (error) {
            if(error.response) {throw new Error(error.response.data.message)}
            else{
                throw new Error("assistant_error")
            }
        }
    }

    const callNamedEntityService = async (text) => {

        const namedEntityResult = await axios.post(
            assistantEndpoint + "gcloud/named-entity",
            {content: text}
        )

        return namedEntityResult.data
    }

    const callAssistantTranslator = async (lang, text) => {
        try {
            let translationResult = await axios
                .get(assistantEndpoint + "translate/"  + lang +  "?text=" + encodeURIComponent(text))
            if (translationResult.data.status === "success") {
                return translationResult.data
            }
        }
        catch (error) {
            if(error.response) {throw new Error(error.response.data.message)}
            else{
                throw new Error("assistant_error")
            }
        }
    }

    const callSourceCredibilityService = async (urlList) => {
        if (urlList.length === 0) return null

        let urls = urlList.join(" ")

        const result = await axios.post(
            assistantEndpoint + "gcloud/source-credibility",
            {text: urls})

        return result.data
    }

    const callHyperpartisanService = async (text) => {
        const result = await axios.post(
            assistantEndpoint + "gcloud/hyperpartisan",
            {text: text})

        return result.data
    }

    const callOcrService = async (urlList) => {
        let urls = urlList.join(" ")

        const result = await axios.post(
            assistantEndpoint + "gcloud/ocr",
            {text: urls, data_type: "url"}
        )

        return result.data
    }

    const callOcrB64Service = async (b64Img) => {
        b64Img = b64Img.replace("data:image/png;base64,", "")

        const result = await axios.post(
            assistantEndpoint + "gcloud/ocr",
            {text: b64Img, data_type:"upload"}
            )

        return result.data
    }

    return {
        callAssistantScraper,
        callSourceCredibilityService,
        callNamedEntityService,
        callAssistantTranslator,
        callHyperpartisanService,
        callOcrService,
        callOcrB64Service
    }
}