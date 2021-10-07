import {all, call, fork, put, select, takeLatest} from "redux-saga/effects";
import {setOcrErrorKey, setOcrResult, setOcrScripts} from "../actions/tools/ocrActions";
import assistantApiCalls from "../../components/NavItems/Assistant/AssistantApiHandlers/useAssistantApi";

const assistantApi = assistantApiCalls()

function* getOcrLoadScriptsSaga() {
    yield takeLatest(["SET_OCR_INPUT", "CLEAN_OCR"], handleOcrCall)
}

function* getImageOcrSaga() {
    yield takeLatest(["OCR_LOAD_SCRIPTS"], loadOcrScripts)
}

function* handleOcrCall(action) {
    if (action.type === "CLEAN_STATE") return

    const inputUrl = yield select(state => state.ocr.url);
    const binaryImage =  yield select(state => state.ocr.binaryImage);
    const script =  yield select(state => state.ocr.selectedScript);
    const uploadMode = "upload"
    const urlMode = "url"
    let fullText =""

    try {
        yield put(setOcrResult(true, false, false, null))
        let ocrResult = []

        if (binaryImage) {
            ocrResult = yield call(assistantApi.callOcrService, binaryImage, script, uploadMode)
        }
        else{
            ocrResult = yield call(assistantApi.callOcrService, inputUrl, script, urlMode)
        }

        if(ocrResult.bounding_boxes) {
            ocrResult.bounding_boxes.forEach((value, key) => {
                fullText = fullText + " " + value.text
            })
        }

        yield put(setOcrResult(false, false, true, ocrResult, fullText))
    } catch (error) {
        console.log(error)
        if (error.message==="Network Error") {
            yield put (setOcrErrorKey("service_error"))
        }
        yield put(setOcrResult(false, true, false, null))
    }
}

function* loadOcrScripts () {
    try {
        let script_result = yield call(assistantApi.callOcrScriptService)
        yield put (setOcrScripts( script_result))
    }
    catch(error){
        console.log(error)
    }
}

export default function* ocrSaga() {
    yield all([
        fork(getImageOcrSaga),
        fork(getOcrLoadScriptsSaga),
    ])
}