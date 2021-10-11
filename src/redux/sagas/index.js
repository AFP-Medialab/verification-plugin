import assistantSaga from "./assistantSaga";
import ocrSaga from "./ocrSaga";
import conversationSaga from "./conversationSaga"

import {all, fork} from 'redux-saga/effects'

export default function* rootSaga() {
    yield all([
        fork(assistantSaga),
        fork(ocrSaga),
        fork(conversationSaga)
    ]);
}