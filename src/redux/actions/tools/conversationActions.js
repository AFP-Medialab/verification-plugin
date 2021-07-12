export const setConversationInput = (url) => {
    return {
        type: "SET_CONVERSATION_INPUT",
        payload: {
            url: url,
        }
    }
};

export const setConversation = (conversation) => {
    return {
        type: "SET_CONVERSATION_ROOT",
        payload: {
            conversation: conversation,
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

export const setStance = (stance) => {
    return {
        type: "SET_CONVERSATION_STANCE",
        payload: {
            stance: stance,
        }
    }
}

export const setTweet = (tweet) => {
    console.log("inside setConversationTweet: "+tweet);
    return {
        type: "SET_CONVERSATION_TWEET",
        payload: {
            tweet: tweet,
        }
    }
}