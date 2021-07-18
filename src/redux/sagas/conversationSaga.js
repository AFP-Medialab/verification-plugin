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
    
    // get the language to use in the UI
    const lang = yield select(state => state.language);

    // get the HTML used to display the tweet
    tweet.html = yield call(conversationApi.getTweetHTML, tweet, lang)

    const tweetURL = "https:twitter.com/"+tweet.user.screen_name+"/status/"+id_str;
    
    // store the tweet object into the state
    yield put(setTweet(tweet, tweetURL))

    // now we get the conversation object from the backend (this is essentially
    // a summary of the direct replies to the tweet)
    let conversation = yield call(conversationApi.getConversation, id_str)

    // store the conversation object into the state
    yield put(setConversation(conversation))

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
    Object.keys(conversation.stance).forEach(entry => {
        console.log(entry +" ==> " + conversation.stance[entry])
        stance.labels.push(entry)
        stance.values.push(conversation.stance[entry])

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

export default function* conversationSaga() {
    yield all([
        fork(getConversationURLSaga),
        fork(getConversationTweetSaga),

    ])
}