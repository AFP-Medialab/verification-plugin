import axios from "axios";

export default function ConversationAPI() {

    const getTweet = async (id) => {
        let json = await axios.get("http://localhost:7000/tweet?id="+id)

        // TODO add error handling

        return json.data
    }

    const getConversation = async (id) => {
        let json = await axios.get("http://localhost:7000/conversation?id="+id)

        // TODO add error handling

        return json.data
    }

    return {
        getTweet,
        getConversation
    }
}