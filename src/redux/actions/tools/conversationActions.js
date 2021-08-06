export const setConversationInput = (url) => {
    return {
        type: "SET_CONVERSATION_INPUT",
        payload: {
            url: url,
            loading: true
        }
    }
};

export const setTweetID = (id_str) => {
    return {
        type: "SET_CONVERSATION_TWEET_ID",
        payload: {
            id_str: id_str,
            loading: true
        }
    }
};

export const setConversationFilter = (filter) => {
    return {
        type: "SET_CONVERSATION_FILTER",
        payload: {
            filter: filter,
            cloud: null
        }
    }
};

export const setConversationRestriction = (restriction) => {
    return {
        type: "SET_CONVERSATION_RESTRICTION",
        payload: {
            restriction: restriction,
            cloud: null,
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
            loading: false
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

export const setTweet = (tweet, url) => {
    return {
        type: "SET_CONVERSATION_TWEET",
        payload: {
            tweet: tweet,
            url: url,
        }
    }
}

export const setFlashMessage = (type, message) => {
    return {
        type: "SET_CONVERSATION_FLASH",
        payload: {
            loading: false,
            flashType: type,
            flashMessage: message
        }
    }
}