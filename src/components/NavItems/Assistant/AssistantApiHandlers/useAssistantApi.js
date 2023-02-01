import axios from "axios";

export default function assistantApiCalls() {

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

    const callNamedEntityService = async (text, lang) => {

        const namedEntityResult = await axios.post(
            assistantEndpoint + "gcloud/named-entity",
            {content: text, lang: lang}
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

    const callOcrService = async (filename, data, script, mode) => {
        const result = await axios.post(
            // assistantEndpoint + "gcloud/ocr",
            "http://localhost:8025/process",//TODO: change this to assistantEndpoint + "gcloud/ocr" when the assistant is deployed
            {filename:filename, text: data, script: script, data_type: mode}
        )

        return result.data
    }

    const callOcrScriptService = async () => {
        const result = await axios.get(assistantEndpoint + "gcloud/ocr-scripts")
        return result.data
    }
    const callOcrFastextLanguagesService = async () => {
        const result = await axios.get("http://localhost:8025/fasttext_languages")
        return result.data
    }

    return {
        callAssistantScraper,
        callSourceCredibilityService,
        callNamedEntityService,
        callAssistantTranslator,
        callHyperpartisanService,
        callOcrService,
        callOcrScriptService,
        callOcrFastextLanguagesService
    }
}

