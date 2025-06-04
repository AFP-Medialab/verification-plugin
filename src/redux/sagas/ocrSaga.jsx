import _ from "lodash";
import { all, call, fork, put, select, takeLatest } from "redux-saga/effects";

import assistantApiCalls from "../../components/NavItems/Assistant/AssistantApiHandlers/useAssistantApi";
import {
  setOcrErrorKey,
  setOcrResult,
  setOcrScripts,
  setReprocessLoading,
  setReprocessOpen,
  setSelectedScript,
} from "../actions/tools/ocrActions";

const assistantApi = assistantApiCalls();

function* getOcrLoadScriptsSaga() {
  yield takeLatest(["SET_OCR_INPUT", "CLEAN_OCR"], handleOcrCall);
}

function* getImageOcrSaga() {
  yield takeLatest(["OCR_LOAD_SCRIPTS"], loadOcrScripts);
}

function* getOcrReprocessSaga() {
  yield takeLatest("OCR_REPROCESS", handleReprocessCall);
}

function* handleOcrCall(action) {
  if (action.type === "CLEAN_STATE") return;

  const inputUrl = yield select((state) => state.ocr.url);
  const binaryImage = yield select((state) => state.ocr.binaryImage);
  const script = yield select((state) => state.ocr.selectedScript);
  const uploadMode = "upload";
  const urlMode = "url";
  let fullText = "";

  try {
    yield put(
      setOcrResult({ loading: true, fail: false, done: false, result: null }),
    );
    let ocrResult = [];

    if (binaryImage) {
      ocrResult = yield call(
        assistantApi.callOcrService,
        binaryImage,
        script,
        uploadMode,
      );
    } else {
      ocrResult = yield call(
        assistantApi.callOcrService,
        inputUrl,
        script,
        urlMode,
      );
    }

    if (ocrResult.bounding_boxes) {
      ocrResult.bounding_boxes.forEach((value) => {
        fullText = fullText + " " + value.text;
      });
    }

    yield put(setOcrResult(false, false, true, ocrResult, fullText));
  } catch (error) {
    console.log("Error", error);
    //if (error.message==="Network Error") {
    yield put(setOcrErrorKey("service_error"));
    //}
    yield put(setOcrResult(false, true, false, null));
  }
}

function* handleReprocessCall(action) {
  const inputUrl = yield select((state) => state.ocr.url);
  const binaryImage = yield select((state) => state.ocr.binaryImage);
  const script = yield select((state) => state.ocr.selectedScript);
  const uploadMode = "upload";
  const urlMode = "url";
  let fullText = "";

  let boxToChange = action.payload.boundingBox;
  let resultToEdit = yield select((state) => state.ocr.result);
  let newResult = {};

  try {
    yield put(setReprocessLoading(true));

    if (binaryImage) {
      newResult = yield call(
        assistantApi.callOcrService,
        binaryImage,
        script,
        uploadMode,
      );
    } else {
      newResult = yield call(
        assistantApi.callOcrService,
        inputUrl,
        script,
        urlMode,
      );
    }

    if (newResult && newResult.bounding_boxes) {
      // find the result you're replacing in both the old and new result set
      let oldIndex = resultToEdit.bounding_boxes.findIndex((bbox) =>
        _.isEqual(bbox.bounding_box, boxToChange),
      );
      let newIndex = newResult.bounding_boxes.findIndex((bbox) =>
        _.isEqual(bbox.bounding_box, boxToChange),
      );
      // replace only the bounding box which needed changing with the result from the new response
      resultToEdit.bounding_boxes[oldIndex] =
        newResult.bounding_boxes[newIndex];

      //replace the relevant part in the full text
      resultToEdit.bounding_boxes.forEach((value, key) => {
        if (key !== oldIndex) {
          fullText = fullText + " " + value.text;
        } else {
          fullText = fullText + " " + newResult.bounding_boxes[newIndex].text;
        }
      });
    }

    // and set the state to hold the new result
    yield put(setOcrResult(false, false, true, resultToEdit, fullText));
    yield put(setReprocessLoading(false));
    yield put(setSelectedScript("loop"));
    yield put(setReprocessOpen(false));
  } catch (error) {
    console.log(error);
    if (error.message === "Network Error") {
      yield put(setOcrErrorKey("service_error"));
    }
    yield put(setOcrResult(false, true, false, resultToEdit));
  }
}

function* loadOcrScripts() {
  try {
    let script_result = yield call(assistantApi.callOcrScriptService);
    yield put(setOcrScripts(script_result));
  } catch (error) {
    console.log(error);
  }
}

export default function* ocrSaga() {
  yield all([
    fork(getImageOcrSaga),
    fork(getOcrLoadScriptsSaga),
    fork(getOcrReprocessSaga),
  ]);
}
