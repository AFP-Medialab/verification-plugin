import useGateCloudApi from "../../components/NavItems/Assistant/AssistantApiHandlers/useGateCloudApi";
import {all, call, fork, put, select, takeLatest} from "redux-saga/effects";
import {setOcrResult} from "../actions/tools/ocrActions";

const gateCloudApi = useGateCloudApi()

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
            let ocrResult = yield call(gateCloudApi.callOcrB64Service,  b64Encoding)
            ocrText = ocrResult.text
        }
        else{
            let ocrResult = yield call(gateCloudApi.callOcrService, [inputUrl])
            let ocrSuccess = ocrResult.entities.URL[0].ocr_ok

            if(!ocrSuccess) {
                throw new Error();
            }

            ocrText = ocrResult.entities.URL[0].ocr_text
        }

        ocrText === "" ?
            yield put(setOcrResult(false, false, true, "No text has been found in the image.")) :
            yield put(setOcrResult(false, false, true, ocrText))

    } catch (error) {
        console.log(error)
        yield put(setOcrResult(false, true, false, null))
    }
}

export default function* ocrSaga() {
    yield all([
        fork(getImageOcrSaga),
    ])
}