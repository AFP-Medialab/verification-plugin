export const setConversationInput = (url) => {
    return {
        type: "SET_CONVERSATION_INPUT",
        payload: {
            url: url,
        }
    }
};

export const setConversationID = (id_str) => {
    console.log("inside setConversationTweet: "+id_str);
    return {
        type: "SET_CONVERSATION_ID",
        payload: {
            id_str: id_str,
        }
    }
}

export const setHashtagCloud = (cloud) => {
    return {
        type: "SET_CONVERSATION_CLOUD",
        payload: {
            cloud: cloud,
        }
    }
}

export const setURLTable = (urls) => {
    return {
        type: "SET_CONVERSATION_URLS",
        payload: {
            urls: urls,
        }
    }
}

export const setTweetID = (id_str) => {
    console.log("inside setConversationTweet: "+id_str);
    return {
        type: "SET_CONVERSATION_TWEET",
        payload: {
            tweet_id: id_str,
        }
    }
}