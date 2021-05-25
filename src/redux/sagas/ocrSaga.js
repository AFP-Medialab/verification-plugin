import {all, call, fork, put, select, takeLatest} from "redux-saga/effects";
import {setOcrErrorKey, setOcrResult} from "../actions/tools/ocrActions";
import useAssistantApi from "../../components/NavItems/Assistant/AssistantApiHandlers/useAssistantApi";

const assistantApi = useAssistantApi()

function* getImageOcrSaga() {
    yield takeLatest(["SET_OCR_INPUT", "CLEAN_OCR"], handleOcrCall)
}

function* handleOcrCall(action) {
    if (action.type === "CLEAN_STATE") return

    const inputUrl = yield select(state => state.ocr.url);
    const b64Encoding =  yield select(state => state.ocr.b64Image);
    let ocrText = null

    try {
        yield put(setOcrResult(true, false, false, null))

        if (b64Encoding) {
            checkImageSize(b64Encoding)
            let ocrResult = yield call(assistantApi.callOcrB64Service,  b64Encoding)
            ocrText = ocrResult.text
        }
        else{
            let ocrResult = yield call(assistantApi.callOcrService, [inputUrl])
            let ocrSuccess = ocrResult.entities.URL[0].ocr_ok
            if(!ocrSuccess) {
                throw new Error();
            }
            ocrText = ocrResult.entities.URL[0].ocr_text
        }

        ocrText === "" ?
            yield put(setOcrResult(false, false, true, "ocr_no_text")) :
            yield put(setOcrResult(false, false, true, ocrText))

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

function checkImageSize (b64Image) {
    let image=  b64Image.substr(22)
    let decoded_image = atob(image)
    if(decoded_image.length > 4000000){
        throw  Error("ocr_too_big")
    }
}

export default function* ocrSaga() {
    yield all([
        fork(getImageOcrSaga),
    ])
}