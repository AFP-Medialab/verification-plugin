import axios from "axios";

export default function assistantApiCalls() {

    const assistantEndpoint = process.env.REACT_APP_ASSISTANT_URL

    const callTiktokScraper = async (url) => {
        try{
            let video_id = url.match(/(?<=\/video\/)\d+/)
            let account_id = url.match(/(?<=www.tiktok.com\/).*?(?=\/video\/)/)

            let result = await axios.get("https://www.tiktok.com/node/share/video/" + account_id + "/" + video_id)

            let scrapeResult = {}
            scrapeResult.videos = [result.data.itemInfo.itemStruct.video.downloadAddr]
            scrapeResult.text = result.data.itemInfo.itemStruct.desc
            scrapeResult.lang = result.data.seoProps.predictedLanguage
            scrapeResult.images = []
            scrapeResult.links = []

            return scrapeResult
        }
        catch (error){
            console.log(error)
            throw new Error("assistant_error")
        }
    }

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

    const callOcrService = async (data, script, mode) => {
        const result = await axios.post(
            assistantEndpoint + "gcloud/ocr",
            {text: data, script: script, data_type: mode}
        )

        return result.data
    }

    const callOcrScriptService = async () => {
        const result = await axios.get(assistantEndpoint + "gcloud/ocr-scripts")
        return result.data
    }

    return {
        callAssistantScraper,
        callTiktokScraper,
        callSourceCredibilityService,
        callNamedEntityService,
        callAssistantTranslator,
        callHyperpartisanService,
        callOcrService,
        callOcrScriptService
    }
}

