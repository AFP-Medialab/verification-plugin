import assistantSaga from "./assistantSaga";
import ocrSaga from "./ocrSaga";
import { all, fork } from "redux-saga/effects";

export default function* rootSaga() {
  yield all([fork(assistantSaga), fork(ocrSaga)]);
}
