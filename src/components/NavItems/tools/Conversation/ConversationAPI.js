import axios from "axios";

export default function ConversationAPI() {

    const endpoint = process.env.REACT_APP_CONVERSATION_API

    /**
     * Retrieves a JSON object respresenting an individual tweet from
     * the backend. This includes some summary information derived
     * from direct replies to this tweet. This information isn't currently
     * used but could drive further visualizations
     * @param {*} id the ID of the tweet we are interested in
     * @returns a JSON object representing the requested tweet
     */
    const getTweet = async (id) => {
        let json = await axios.get(endpoint+"/tweet?id="+id)

        // TODO add error handling

        return json.data
    }

    /**
     * Retrieves a JSON object representing the conversation from
     * the backend. This includes the summary info needed for a lot of
     * the visualizations.
     * @param {*} id the ID of the conversation we are interested in
     * @returns a JSON object representing the requested conversation
     */
    const getConversation = async (id, stance, restrict) => {
        let json = await axios.get(endpoint+"/conversation?id="+id+"&stance="+stance+"&restrict="+restrict)

        // TODO add error handling

        return json.data
    }

    return {
        getTweet,
        getConversation
    }
}