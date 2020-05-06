import {TWITTER_REQUEST_LOADING, TWITTER_SET_INPUT, TWEET_RECEIVED, TWITTER_RESET} from "../../actions/scrapers/twitterActions.js";

const defaultState = {
    inputUrl: null,
    twitterRequestSent: false,
    twitterRequestLoading: false,
    twitterResultReceived: false,
    initialTweet: null,
    tweet: {
        tweetUrl: null,
        tweetId: null,
        tweetUser: null,
        tweetText: null,
        imageUrl: null,
        videoUrl: null,
        linkUrl: null,
        tweetHashTags: []
    }
};

function twitterReducer(state = defaultState, action) {
    switch (action.type) {

        case TWITTER_SET_INPUT:
            state.inputUrl = action.payload;
            break;

        case TWITTER_REQUEST_LOADING:
            state.twitterRequestLoading = action.payload;
            break;


        case TWEET_RECEIVED:
            state.twitterRequestLoading = false;
            state.twitterResultReceived = true;
            state.tweet = action.payload;
            break;

        case TWITTER_RESET:
            state = {
                inputUrl: null,
                twitterRequestSent: false,
                twitterRequestLoading: false,
                twitterResultReceived: false,
                initialTweet: null,
                tweet: {
                    tweetUrl: null,
                    tweetId: null,
                    tweetUser: null,
                    tweetText: null,
                    imageUrl: null,
                    videoUrl: null,
                    linkUrl: null,
                    tweetHashTags: []
                }}
            break;

        default:
            break;
    }
    return state;
};

export default twitterReducer;
