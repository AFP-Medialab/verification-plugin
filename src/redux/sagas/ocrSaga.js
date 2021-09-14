import {all, call, fork, put, select, takeLatest} from "redux-saga/effects";
import {setOcrErrorKey, setOcrResult} from "../actions/tools/ocrActions";
import assistantApiCalls from "../../components/NavItems/Assistant/AssistantApiHandlers/useAssistantApi";

const assistantApi = assistantApiCalls()

function* getImageOcrSaga() {
    yield takeLatest(["SET_OCR_INPUT", "CLEAN_OCR"], handleOcrCall)
}

function* handleOcrCall(action) {
    if (action.type === "CLEAN_STATE") return

    const inputUrl = yield select(state => state.ocr.url);
    const b64Encoding =  yield select(state => state.ocr.b64Image);

    try {
        yield put(setOcrResult(true, false, false, null))
        let ocrResult = []

        if (b64Encoding) {
            let image = b64Encoding.substr(22)
            let decoded_image = atob(image)
            checkImageSize(decoded_image)
            ocrResult = yield call(assistantApi.callOcrService,  decoded_image, "upload")
        }
        else{
            ocrResult = yield call(assistantApi.callOcrService, inputUrl, "url")
        }
        yield put(setOcrResult(false, false, true, ocrResult))
    } catch (error) {
        console.log(error)
        if(error.message==="ocr_too_big"){
            yield put (setOcrErrorKey("ocr_too_big"))
        } else if (error.message==="Network Error") {
            yield put (setOcrErrorKey("service_error"))
        }
        yield put(setOcrResult(false, true, false, null))
    }
}

function checkImageSize (decoded_image) {
    if(decoded_image.length > 4000000){
        throw  Error("ocr_too_big")
    }
}

export default function* ocrSaga() {
    yield all([
        fork(getImageOcrSaga),
    ])
}