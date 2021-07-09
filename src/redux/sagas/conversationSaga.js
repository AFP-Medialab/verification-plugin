import {all, call, fork, put, select, takeLatest} from "redux-saga/effects";
import { setConversationID, setHashtagCloud } from "../actions/tools/conversationActions";
import ConversationAPI from "../../components/NavItems/tools/Conversation/ConversationAPI";

const conversationApi = ConversationAPI()

function* getConversationSaga() {
    yield takeLatest(["SET_CONVERSATION_INPUT"], handleConversationCall)
}

function* handleConversationCall(action) {

    console.log(action);


    console.log("inside the conversation saga handle call")

    const tweetURL = yield select(state => state.conversation.url)

    const id_str = tweetURL.substring(tweetURL.lastIndexOf("/")+1)

    console.log(id_str)

    let tweet = yield call(conversationApi.getTweet, id_str)

    //console.log(tweet)

    let conversation = yield call(conversationApi.getConversation, tweet.conversation_id)

    yield put(setConversationID(conversation.root.id))

    const cloud = [];

    Object.keys(conversation.hashtags).forEach(hashtag => {
        console.log(hashtag +" ==> " + conversation.hashtags[hashtag])
        cloud.push({text: hashtag, value: conversation.hashtags[hashtag]})
    })

    console.log(cloud)

    yield put(setHashtagCloud(cloud))
}

export default function* conversationSaga() {
    yield all([
        fork(getConversationSaga),
    ])
}