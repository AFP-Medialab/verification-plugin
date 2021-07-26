import {all, call, fork, put, select, takeLatest} from "redux-saga/effects";
import { setConversation, setHashtagCloud, setTweet, setStance, setTweetID } from "../actions/tools/conversationActions";
import ConversationAPI from "../../components/NavItems/tools/Conversation/ConversationAPI";

const conversationApi = ConversationAPI()

function* getConversationURLSaga() {
    yield takeLatest(["SET_CONVERSATION_INPUT"], handleConversationURL)
}

function* getConversationTweetSaga() {
    yield takeLatest(["SET_CONVERSATION_TWEET_ID"], handleConversationTweetID)
}

function* getConversationExplorterSaga() {
    yield takeLatest(["SET_CONVERSATION_TWEET", "SET_CONVERSATION_FILTER"], handConversationExplorer)
}

function* handConversationExplorer(action) {

    const id_str = yield select(state => state.conversation.id_str)
    const filter = yield select(state => state.conversation.filter)

     // now we get the conversation object from the backend (this is essentially
    // a summary of the direct replies to the tweet)
    let conversation = yield call(conversationApi.getConversation, id_str, filter)

    // store the conversation object into the state
    yield put(setConversation(conversation))

    // in a similar way the hashtag info isn't in the format needed for drawing
    // the word cloud either so again we'll set up the data structure...
    const cloud = [];

    // ... push the data into it and finally...
    Object.keys(conversation.hashtags).forEach(hashtag => {
        cloud.push({text: "#"+hashtag, value: conversation.hashtags[hashtag]})
    })

    // ... stick the object into the state ready for use
    yield put(setHashtagCloud(cloud))
}

function* handleConversationURL(action) {

    // get the URL of the tweet we have been given through the UI
    const tweetURL = yield select(state => state.conversation.url)

    // Get the status ID which is all we really need to get the rest of the info
    // TODO we should probably do some error handling at this point to check that
    //      the URL we have been given is actually a valid status URL
    const id_str = tweetURL.substring(tweetURL.lastIndexOf("/")+1)

    yield put(setTweetID(id_str))
}

function* handleConversationTweetID(action) {

    const id_str = yield select(state => state.conversation.id_str)

    // get the tweet from the elasticsearch index via the backend
    let tweet = yield call(conversationApi.getTweet, id_str)

    // work out the full URL for the tweet in case we started from the ID only
    // (i.e. navigating for an in_reply_to_status_id_str link etc.)
    const tweetURL = "https:twitter.com/"+tweet.user.screen_name+"/status/"+id_str;
    
    // store the tweet object into the state
    yield put(setTweet(tweet, tweetURL))

    // the stance info in the conversation object isn't exactly what we need in
    // order to generate the pie chart so let's setup the data object...
    const stance = {
        values: [],
        labels: [],
        type: "pie",
        textinfo: "label+percent",
        textposition: "outside",
        automargin: true,
        marker: {
            colors: []
        }
    };

    // and then push the info from the original structure into the right places
    Object.keys(tweet.stance).forEach(entry => {
        console.log(entry +" ==> " + tweet.stance[entry])
        stance.labels.push(entry)
        stance.values.push(tweet.stance[entry])

        if (entry === "comment")
		    stance.marker.colors.push("rgb(31, 119, 180)");
		else if (entry === "support")
            stance.marker.colors.push("rgb(44, 160, 44)");
		else if (entry === "deny")
            stance.marker.colors.push("rgb(214, 39, 40)");
		else
            stance.marker.colors.push("rgb(255, 127, 14)");
    })

    // and then put the built object into the state ready for use
    yield put(setStance(stance))
}

export default function* conversationSaga() {
    yield all([
        fork(getConversationURLSaga),
        fork(getConversationTweetSaga),
        fork(getConversationExplorterSaga),
    ])
}