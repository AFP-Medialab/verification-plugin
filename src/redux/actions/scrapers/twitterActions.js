export const TWITTER_REQUEST_LOADING = "TWITTER_REQUEST_LOADING";
export const TWEET_RECEIVED = "TWEET_RECEIVED";
export const TWITTER_RESET = "TWITTER_RESET";
export const TWITTER_SET_INPUT = "TWITTER_SET_INPUT";

export function twitterSetUrl(url){
    return {
        type: TWITTER_SET_INPUT,
        payload: url
    }
}

export function twitterRequestLoadingAction(loading = true) {
    return {
        type: TWITTER_REQUEST_LOADING,
        payload: loading
    };
}

export function tweetReceivedAction(tweet) {
    return {
        type: TWEET_RECEIVED,
        payload: tweet
    };
};

export function twitterResetAction() {
    return {
        type: TWITTER_RESET,
    };
};
