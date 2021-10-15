import {all, call, fork, put, select, takeLatest} from "redux-saga/effects";
import { setConversation, setHashtagCloud, setTweet, setStance, setTweetID, setFlashMessage } from "../actions/tools/conversationActions";
import ConversationAPI from "../../components/NavItems/tools/Conversation/ConversationAPI";

const conversationApi = ConversationAPI()

function* getConversationURLSaga() {
    yield takeLatest(["SET_CONVERSATION_INPUT"], handleConversationURL)
}

function* getConversationTweetSaga() {
    yield takeLatest(["SET_CONVERSATION_TWEET_ID"], handleConversationTweetID)
}

function* getConversationExplorterSaga() {
    yield takeLatest(["SET_CONVERSATION_TWEET", "SET_CONVERSATION_FILTER", "SET_CONVERSATION_RESTRICTION"], handConversationExplorer)
}

function* handConversationExplorer(action) {

    const id_str = yield select(state => state.conversation.id_str)
    const filter = yield select(state => state.conversation.filter)
    const restrict = yield select(state => state.conversation.restriction)

     // now we get the conversation object from the backend (this is essentially
    // a summary of the direct replies to the tweet)
    let conversation = yield call(conversationApi.getConversation, id_str, filter, restrict)

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

    if (!tweetURL) {
        yield put(setFlashMessage("error", "Please enter a URL which points to a single Tweet", false));
        return;
    }

    if (tweetURL.match(/^[0-9]+$/)) {
        yield put(setTweetID(tweetURL))
        return;

    }

    // use a regex to grab the status ID from the URL, and hence
    // do some validation of the URL
    const data = tweetURL.match(/twitter\.com\/.*\/status(?:es)?\/([^/?]+)/)

    if (data == null) {
        // if the regex didn't match then the URL isn't to a tweet so we
        // stop and report an error message of some kind
        // TODO how do I get the translations into here
        console.log("not a twitter URL");
        yield put(setFlashMessage("error", "Please enter a URL which points to a single Tweet", false));
        
        return;
    }

    // Get the status ID which is all we really need to get the rest of the info
    const id_str = data[1];

    yield put(setTweetID(id_str, tweetURL))
}

function* handleConversationTweetID(action) {

    const id_str = yield select(state => state.conversation.id_str)

    // get the tweet from the elasticsearch index via the backend
    let tweet = yield call(conversationApi.getTweet, id_str)

    if (tweet.flashMessage) {
        // set the falsh message but don't assume this is a fatal error
        yield put(setFlashMessage(tweet.flashType, tweet.flashMessage, tweet.flashRefresh));
    }

    if (!tweet.id) {
        // only stop processing if we don't have a tweet
        return;
    }

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
        stance.labels.push(entry)
        stance.values.push(tweet.stance[entry])

        if (entry === "comment")
		    stance.marker.colors.push("rgb(3, 155, 229)");
		else if (entry === "support")
            stance.marker.colors.push("rgb(124, 179, 66)");
		else if (entry === "deny")
            stance.marker.colors.push("rgb(229, 57, 53)");
		else
            stance.marker.colors.push("rgb(255, 179, 0)");
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