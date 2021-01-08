import {
    cleanAssistantState,
    setAssistantLoading,
    setDbkfImageMatchDetails,
    setDbkfTextMatchDetails,
    setDbkfVideoMatchDetails,
    setHpDetails,
    setInputSourceCredDetails,
    setInputUrl,
    setMtDetails,
    setNeDetails,
    setProcessUrl,
    setProcessUrlActions,
    setScrapedData,
    setSingleMediaPresent
} from "../actions/tools/assistantActions";
import {setError} from "../actions/errorActions";

import {all, call, fork, put, select, takeLatest} from 'redux-saga/effects'
import useAssistantApi from "../../components/NavItems/Assistant/AssistantApiHandlers/useAssistantApi";
import useGateCloudApi from "../../components/NavItems/Assistant/AssistantApiHandlers/useGateCloudApi";
import useDBKFApi from "../../components/NavItems/Assistant/AssistantApiHandlers/useDBKFApi";
import {
    CONTENT_TYPE,
    KNOWN_LINK_PATTERNS,
    KNOWN_LINKS,
    matchPattern,
    selectCorrectActions,
    TYPE_PATTERNS
} from "../../components/NavItems/Assistant/AssistantRuleBook";


const dbkfAPI = useDBKFApi()
const gateCloudApi = useGateCloudApi()
const assistantApi = useAssistantApi()


function* getAssistantScrapeSaga() {
    yield takeLatest("SUBMIT_INPUT_URL", handleInputUrl)
}

function* getMediaListSaga() {
    yield takeLatest("SET_SCRAPED_DATA", handleMediaLists)
}

function* getMediaActionSaga() {
    yield takeLatest("SET_PROCESS_URL", handleActionCall)
}

function* getMediaSimilaritySaga() {
    yield takeLatest(["SET_PROCESS_URL", "CLEAN_STATE"], handleSimilaritySearch)
}

function* getDbkfTextMatchSaga() {
    yield takeLatest(["SET_SCRAPED_DATA", "CLEAN_STATE"], handleDbkfTextSearch)
}

function* getHyperpartisanSaga() {
    yield takeLatest(["SET_SCRAPED_DATA", "CLEAN_STATE"], handleHyperpartisanCall)
}


function* getSourceCredSaga() {
    yield takeLatest(["SET_INPUT_URL", "CLEAN_STATE"], handleSourceCredibility)
}

function* getNamedEntitySaga() {
    yield takeLatest(["SET_SCRAPED_DATA", "CLEAN_STATE"], handleNamedEntitySaga)
}

function* getTranslationSaga() {
    yield takeLatest(["RUN_TRANSLATION", "CLEAN_STATE"], handleTranslateSaga)
}

function* handleMediaLists() {

    const imageList = yield select(state => state.assistant.imageList);
    const videoList = yield select(state => state.assistant.videoList);

    try {
        if (imageList.length === 1 && videoList.length === 0) {
            yield put(setProcessUrl(imageList[0], CONTENT_TYPE.IMAGE))
            yield put(setSingleMediaPresent(true))

        } else if (videoList.length === 1 && imageList.length === 0) {
            yield put(setProcessUrl(videoList[0], CONTENT_TYPE.VIDEO))
            yield put(setSingleMediaPresent(true))
        }
    } catch (error) {
        yield put(setError("Error handling media lists"))
    }
}


function* handleActionCall() {
    const inputUrl = yield select((state) => state.assistant.inputUrl)
    const processUrl = yield select((state) => state.assistant.processUrl)
    const contentType = yield select(state => state.assistant.processUrlType);

    if (processUrl !== null) {
        try {
            let knownInputLink = yield call(matchPattern, inputUrl, KNOWN_LINK_PATTERNS);
            let knownProcessLink = yield call(matchPattern, processUrl, KNOWN_LINK_PATTERNS);
            let actions = yield call(selectCorrectActions, contentType, knownInputLink, knownProcessLink, processUrl);

            yield put(setProcessUrlActions(contentType, actions))
        } catch (error) {
            yield put(setError("Error deciding which actions can be taken against given media"))
        }
    }
}

function* similaritySearch(searchEndpoint, stateStorageFunction) {
    yield put(stateStorageFunction(null, true, false, false))

    try {
        let result = yield call(searchEndpoint)
        if (result[1].length !== 0) {
            yield put(stateStorageFunction(result[1], false, true, false))
        } else {
            yield put(stateStorageFunction(null, false, true, false))
        }
    } catch (error) {
        yield put(stateStorageFunction(null, false, false, true))
    }
}

function* handleSimilaritySearch(action) {
    if (action.type === "CLEAN_STATE") return

    const processUrl = yield select((state) => state.assistant.processUrl)
    const contentType = yield select(state => state.assistant.processUrlType);

    if (contentType === CONTENT_TYPE.IMAGE) {
        yield call(similaritySearch,
            () => dbkfAPI.callImageSimilarityEndpoint(processUrl),
            (result, loading, done, fail) => setDbkfImageMatchDetails(result, loading, done, fail)
        )
    } else if (contentType === CONTENT_TYPE.VIDEO) {
        yield call(similaritySearch,
            () => dbkfAPI.callVideoSimilarityEndpoint(processUrl),
            (result, loading, done, fail) => setDbkfVideoMatchDetails(result, loading, done, fail)
        )
    }
}

function* handleSourceCredibility(action) {
    if (action.type === "CLEAN_STATE") return

    try {
        const inputUrl = yield select((state) => state.assistant.inputUrl)
        const result = yield call(gateCloudApi.callSourceCredibilityService, [inputUrl])
        yield put(setInputSourceCredDetails(result, false, true, false))
    } catch (error) {
        yield put(setInputSourceCredDetails(null, false, false, true))
    }
}

function* handleDbkfTextSearch(action) {
    if (action.type === "CLEAN_STATE") return

    try {
        const text = yield select((state) => state.assistant.urlText)
        if (text !== null) {
            let textToUse = text.length > 500 ? text.substring(0, 500) : text
            textToUse = textToUse.replace(/[/"()’\\]/g, "")
            const result = yield call(dbkfAPI.callTextSimilarityEndpoint, textToUse)
            yield put(setDbkfTextMatchDetails(result, false, true, false))
        }
    } catch (error) {
        yield put(setDbkfTextMatchDetails(null, false, false, true))
    }
}

function* handleHyperpartisanCall(action) {
    if (action.type === "CLEAN_STATE") return

    try {
        const text = yield select((state) => state.assistant.urlText)
        const lang = yield select((state) => state.assistant.textLang)

        if (text !== null && lang === "en") {
            yield put(setHpDetails(null, true, false, false))

            const result = yield call(gateCloudApi.callHyperpartisanService, text)

            let hpProb = result.entities.hyperpartisan[0].hyperpartisan_probability
            hpProb = parseFloat(hpProb).toFixed(2) > 0.50 ? parseFloat(hpProb).toFixed(2) : null

            yield put(setHpDetails(hpProb, false, true, false))
        }
    } catch (error) {
        yield put(setHpDetails(null, false, false, true))
    }
}

function* handleNamedEntitySaga(action) {
    if (action.type === "CLEAN_STATE") return

    try {
        const text = yield select((state) => state.assistant.urlText)
        if (text !== null) {
            yield put(setNeDetails(null, null, true, false, false))

            const result = yield call(assistantApi.callNamedEntityService, text)
            let entities = []
            Object.entries(result.response.annotations).forEach(entity => {
                entity[1].forEach(instance => {
                    entities.push({"word": instance.features.string, "category": entity[0]})
                })
            })

            if (entities.length === 0) {
                yield put(setNeDetails(null, null, false, true, false))
            } else {
                let wordCloudList = buildWordCloudList(entities)
                let categoryList = buildCategoryList(wordCloudList)
                yield put(setNeDetails(categoryList, wordCloudList, false, true, false))
            }
        }
    } catch (error) {
        yield put(setNeDetails(null, null, false, false, true))
    }
}

function* handleTranslateSaga(action) {
    if (action.type === "CLEAN_STATE") return

    try {
        let lang = action.payload.lang
        let text = action.payload.text

        yield put(setMtDetails(null, true, false, false))
        const result = yield call(assistantApi.callAssistantTranslator, lang, text)
        yield put(setMtDetails(result, false, true, false))
    } catch (error) {
        yield put(setMtDetails(null, false, false, true))
    }


}


function * handleInputUrl(action) {

    let inputUrl = action.payload.inputUrl

    try {
        yield put(cleanAssistantState())
        yield put(setAssistantLoading(true))

        let urlType = matchPattern(inputUrl, KNOWN_LINK_PATTERNS)
        let contentType = matchPattern(inputUrl, TYPE_PATTERNS)

        let scrapeResult = null

        if (decideWhetherToScrape(urlType, contentType, inputUrl)) {
            scrapeResult = yield call(assistantApi.callAssistantScraper, urlType, inputUrl)
        }

        let filteredSR = setAssistantResults(urlType, contentType, inputUrl, scrapeResult)

        yield put(setInputUrl(inputUrl))
        yield put(setScrapedData(filteredSR.urlText, filteredSR.textLang, filteredSR.linkList, filteredSR.imageList, filteredSR.videoList))
        yield put(setAssistantLoading(false))
    } catch (error) {
        yield put(setAssistantLoading(false))
        yield put(setError(error.message));
    }

}

const removeUrlsFromText = (text) => {
    if (text !== null) {
        let urlRegex = new RegExp("(http(s)?://.)?(www\\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_+.~#?&//=]*)", "g");
        return text.replace(urlRegex, "")
    }
    return text
}


const buildWordCloudList = (entities) => {
    return entities.reduce((accumulator, currentWord) => {
        accumulator.filter(wordObj => wordObj.text === currentWord["word"]).length ?
            accumulator.filter(wordObj => wordObj.text === currentWord["word"])[0].value += 1 :
            accumulator.push({"text": currentWord["word"], "category": currentWord["category"], "value": 1})

        return accumulator
    }, [])
}

const buildCategoryList = (wordCloudList) => {
    // group by category
    return wordCloudList.reduce((accumulator, currentWord) => {
        accumulator.filter(wordObj => wordObj.category === currentWord["category"]).length ?
            accumulator.filter(wordObj => wordObj.category === currentWord["category"])[0].words.push(currentWord['text']) :
            accumulator.push({"category": currentWord["category"], "words": [currentWord["text"]]})

        return accumulator
    }, [])
}


const decideWhetherToScrape = (urlType, contentType) => {
    switch (urlType) {
        case KNOWN_LINKS.YOUTUBE:
        case KNOWN_LINKS.LIVELEAK:
        case KNOWN_LINKS.VIMEO:
        case KNOWN_LINKS.DAILYMOTION:
            return false;
        case KNOWN_LINKS.TIKTOK:
        case KNOWN_LINKS.INSTAGRAM:
        case KNOWN_LINKS.FACEBOOK:
        case KNOWN_LINKS.TWITTER:
            return true;
        case KNOWN_LINKS.MISC:
            if (contentType === null) {
                return true
            }
            return false;
        default:
            throw new Error("please_give_a_correct_link");
    }
}

const setAssistantResults = (urlType, contentType, userInput, scrapeResult) => {
    let videoList = []
    let imageList = []
    let linkList = []
    let urlText = null
    let textLang = null

    switch (urlType) {
        case KNOWN_LINKS.YOUTUBE:
        case KNOWN_LINKS.LIVELEAK:
        case KNOWN_LINKS.VIMEO:
        case KNOWN_LINKS.DAILYMOTION:
            videoList = [userInput];
            break;
        case KNOWN_LINKS.TIKTOK:
            videoList = [scrapeResult.videos]
            break;
        case KNOWN_LINKS.INSTAGRAM:
            if (scrapeResult.videos.length === 1) {
                videoList = [scrapeResult.videos[0]]
            } else {
                imageList = [scrapeResult.images[1]]
            }
            break;
        case KNOWN_LINKS.FACEBOOK:
            if (scrapeResult.videos.length === 0) {
                imageList = scrapeResult.images
                imageList = imageList.filter(imageUrl => imageUrl.includes("//scontent") && !(imageUrl.includes("/cp0/")));
            } else {
                videoList = scrapeResult.videos;
            }
            break;
        case KNOWN_LINKS.TWITTER:
            if (scrapeResult.images.length > 0) {
                imageList = scrapeResult.images
            }
            if (scrapeResult.videos.length > 0) {
                videoList = scrapeResult.videos
            }
            break;
        case KNOWN_LINKS.MISC:
            if (contentType) {
                CONTENT_TYPE.IMAGE ? imageList = [userInput] : videoList = [userInput]
            } else {
                imageList = scrapeResult.images
                videoList = scrapeResult.videos
            }
            break;
        default:
            break;
    }

    if (scrapeResult) {
        urlText = removeUrlsFromText(scrapeResult.text)
        textLang = scrapeResult.lang
        linkList = scrapeResult.links
    }

    return {
        urlText: urlText,
        textLang: textLang,
        videoList: videoList,
        imageList: imageList,
        linkList: linkList,

    };
}

export default function* assistantSaga() {
    yield all([
        fork(getDbkfTextMatchSaga),
        fork(getSourceCredSaga),
        fork(getMediaActionSaga),
        fork(getMediaSimilaritySaga),
        fork(getMediaListSaga),
        fork(getHyperpartisanSaga),
        fork(getNamedEntitySaga),
        fork(getTranslationSaga),
        fork(getAssistantScrapeSaga)
    ])
}
