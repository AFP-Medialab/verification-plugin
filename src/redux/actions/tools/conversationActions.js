export const setConversationInput = (url) => {
    return {
        type: "SET_CONVERSATION_INPUT",
        payload: {
            url: url,
        }
    }
};