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
        type: "SET_CONVERSATION_TWEET",
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