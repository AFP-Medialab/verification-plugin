import {all, call, fork, put, select, takeLatest} from "redux-saga/effects";
import { setConversation, setHashtagCloud, setTweet, setStance } from "../actions/tools/conversationActions";
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

    yield put(setTweet(tweet))

    //console.log(tweet)

    let conversation = yield call(conversationApi.getConversation, tweet.conversation_id)

    yield put(setConversation(conversation))


    const stance = [];

    Object.keys(conversation.stance).forEach(entry => {
        console.log(entry +" ==> " + conversation.stance[entry])
        stance.push({x: entry, y: conversation.stance[entry]})
    })

    yield put(setStance(stance))

    const cloud = [];

    Object.keys(conversation.hashtags).forEach(hashtag => {
        cloud.push({text: "#"+hashtag, value: conversation.hashtags[hashtag]})
    })

    console.log(cloud)

    yield put(setHashtagCloud(cloud))
}

export default function* conversationSaga() {
    yield all([
        fork(getConversationSaga),
    ])
}