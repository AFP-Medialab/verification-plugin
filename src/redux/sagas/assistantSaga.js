import {
    setDbkfImageMatchDetails,
    setDbkfTextMatchDetails, setDbkfVideoMatchDetails, setHpDetails,
    setInputSourceCredDetails, setOcrDetails, setProcessUrl,
    setProcessUrlActions, setSingleMediaPresent
} from "../actions/tools/assistantActions";
import {setError} from "../actions/errorActions";

import {put, takeLatest, all, call, select, fork} from 'redux-saga/effects'
import useGateCloudApi from "../../components/NavItems/Assistant/AssistantApiHandlers/useGateCloudApi";
import useDBKFApi from "../../components/NavItems/Assistant/AssistantApiHandlers/useDBKFApi";
import {
    CONTENT_TYPE,
    KNOWN_LINK_PATTERNS,
    matchPattern,
    selectCorrectActions
} from "../../components/NavItems/Assistant/AssistantRuleBook";


const dbkfAPI = useDBKFApi()
const gateCloudApi = useGateCloudApi()


function * getMediaListSaga() {
    yield takeLatest("SET_SCRAPED_DATA", handleMediaLists)
}

function * getMediaActionSaga() {
    yield takeLatest("SET_PROCESS_URL", handleActionCall)
}

function * getImageOcrSaga() {
    yield takeLatest(["SET_PROCESS_URL", "CLEAN_STATE"], handleOcrCall)
}

function * getMediaSimilaritySaga() {
    yield takeLatest(["SET_PROCESS_URL", "CLEAN_STATE"], handleSimilaritySearch)
}

function * getDbkfTextMatchSaga() {
    yield takeLatest(["SET_SCRAPED_DATA", "CLEAN_STATE"], handleDbkfTextSearch)
}

function * getHyperpartisanSaga() {
    yield takeLatest(["SET_SCRAPED_DATA", "CLEAN_STATE"], handleHyperpartisanCall)
}


function * getSourceCredSaga() {
    yield takeLatest(["SET_INPUT_URL", "CLEAN_STATE"], handleSourceCredibility)
}

function * handleMediaLists() {

    const imageList = yield select(state => state.assistant.imageList);
    const videoList = yield select(state => state.assistant.videoList);

    try {
        if (imageList.length === 1 && videoList.length === 0) {
            yield put(setProcessUrl(imageList[0], CONTENT_TYPE.IMAGE, false, false))
            yield put(setSingleMediaPresent(true))

        } else if (videoList.length === 1 && imageList.length === 0) {
            yield put(setProcessUrl(videoList[0], CONTENT_TYPE.VIDEO, false, false))
            yield put(setSingleMediaPresent(true))
        }
    }
    catch(error){
        yield put(setError("Error handling media lists"))
    }
}


function * handleActionCall() {
    const inputUrl = yield select((state) => state.assistant.inputUrl)
    const processUrl = yield select((state) => state.assistant.processUrl)
    const contentType = yield select(state => state.assistant.processUrlType);

    if (processUrl !== null) {
        try {
            let knownInputLink = yield call(matchPattern, inputUrl, KNOWN_LINK_PATTERNS);
            let knownProcessLink = yield call(matchPattern, processUrl, KNOWN_LINK_PATTERNS);
            let actions = yield call(selectCorrectActions, contentType, knownInputLink, knownProcessLink, processUrl);

            yield put(setProcessUrlActions(actions))
        }
        catch(error){
            yield put(setError("Error deciding which actions can be taken against given media"))
        }
    }
}

function * similaritySearch (searchEndpoint, stateStorageFunction) {
    yield put (stateStorageFunction(null, true, false))

    let result = yield call(searchEndpoint)
    if (result[1].length!== 0) {
        yield put(stateStorageFunction(result[1], false, true))}
    else {
        yield put(stateStorageFunction(null, false, true))
    }
}

function * handleSimilaritySearch(action) {
    if(action.type === "CLEAN_STATE") return

    const processUrl = yield select((state) => state.assistant.processUrl)
    const contentType = yield select(state => state.assistant.processUrlType);

    if (contentType === CONTENT_TYPE.IMAGE) {
        yield call (similaritySearch,
            () => dbkfAPI.callImageSimilarityEndpoint(processUrl),
            (result, loading, done) => setDbkfImageMatchDetails(result, loading, done)
        )
    }
    else if (contentType === CONTENT_TYPE.VIDEO) {
        yield call (similaritySearch,
            () => dbkfAPI.callVideoSimilarityEndpoint(processUrl),
            (result, loading, done) => setDbkfVideoMatchDetails(result, loading, done)
        )
    }
}


function * handleOcrCall(action) {
    if(action.type === "CLEAN_STATE") return

    const processUrl = yield select(state => state.assistant.processUrl);
    const contentType = yield select(state => state.assistant.processUrlType);

    try {
        if (contentType === CONTENT_TYPE.IMAGE) {
            yield put(setOcrDetails(null, true, false))
            let ocrResult = yield call(gateCloudApi.callOcrService, [processUrl])
            let ocrText = ocrResult.entities.URL[0].ocr_text
            ocrText === "" ?
                yield put(setOcrDetails(null, false, true)) :
                yield put(setOcrDetails(ocrText, false, true))

        }
    }
    catch(error){
        yield put(setError("ocr_error"))
    }
}


function * handleSourceCredibility(action) {
    if(action.type === "CLEAN_STATE") return

    try {
        const inputUrl = yield select((state)=>state.assistant.inputUrl)
        const result = yield call(gateCloudApi.callSourceCredibilityService, [inputUrl])
        yield put(setInputSourceCredDetails(result, false, true))
    }

    catch(error){
        yield put(setError("source cred error"))
    }
}

function * handleDbkfTextSearch(action) {
    if(action.type === "CLEAN_STATE") return

    try {
        const text = yield select((state)=>state.assistant.urlText)
        if (text !== null) {
            let textToUse = text.length > 500 ? text.substring(0, 500) : text
            textToUse = textToUse.replace(/[/"()’\\]/g, "")
            const result = yield call(dbkfAPI.callTextSimilarityEndpoint, textToUse)
            yield put(setDbkfTextMatchDetails(result,false,true))
        }
    }
    catch (error){
        yield put(setError("dbkf_error"))
    }
}

function * handleHyperpartisanCall(action) {
    if(action.type === "CLEAN_STATE") return

    try {
        const text = yield select((state)=>state.assistant.urlText)
        if (text !== null) {
            yield put(setHpDetails(null,true,false))
            let textToUse = text.length > 500 ? text.substring(0, 500) : text

            const result = yield call(gateCloudApi.callHyperpartisanService, text)

            let hpProb = result.entities.hyperpartisan[0].hyperpartisan_probability
            hpProb = parseFloat(hpProb).toFixed(2) > 0.80 ? parseFloat(hpProb).toFixed(2) : null

            yield put(setHpDetails(hpProb,false,true))
        }
    }
    catch (error) {
        yield put(setHpDetails(null,false,true))
        yield put(setError("hyperpartisan_error"))
    }
}


export default function * rootSaga(){
    yield all([
        fork(getDbkfTextMatchSaga),
        fork(getSourceCredSaga),
        fork(getMediaActionSaga),
        fork(getImageOcrSaga),
        fork(getMediaSimilaritySaga),
        fork(getMediaListSaga),
        fork(getHyperpartisanSaga)
    ])
}
