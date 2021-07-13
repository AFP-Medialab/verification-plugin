import axios from "axios";

export default function ConversationAPI() {

    /**
     * Retrieves a JSON object respresenting an individual tweet from
     * the backend. This includes some summary information derived
     * from direct replies to this tweet. This information isn't currently
     * used but could drive further visualizations
     * @param {*} id the ID of the tweet we are interested in
     * @returns a JSON object representing the requested tweet
     */
    const getTweet = async (id) => {
        let json = await axios.get("http://localhost:7000/tweet?id="+id)

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
    const getConversation = async (id) => {
        let json = await axios.get("http://localhost:7000/conversation?id="+id)

        // TODO add error handling

        return json.data
    }

    /**
     * Generates a HTML fragment used to display the given tweet. This is
     * normally generated usng the official Twitter oEmbed endpoint, but
     * if we hit an error or request a deleted tweet then we generate HTML
     * ourselves so that there is something to display in the UI.
     * @param {*} tweet a JSON object representing a tweet (usually a response
     *                  from a call to getTweet)
     * @param {*} lang the language to use for the UI elements of the rendered
     *                 tweet. This doesn;t effect the text of the tweet itself
     * @returns a HTML fragment to embed in the UI to render the given tweet
     */
    const getTweetHTML = async (tweet, lang) => {

        // for options we centre the tweet, hide the conversation, enable do-not-track,
        // and set the UI language so the tweet sits nicely in the page
        // TODO can we get the link colour from somewhere, if so then we can pass this
        // via the link_color option
        let json = await axios.get("https://publish.twitter.com/oembed?align=center&hide_thread=true&dnt=true&lang="+lang+"&url="+encodeURIComponent("https://twitter.com/"+tweet.user.screen_name+"/status/"+tweet.id))

        // TODO better error handling and generation of
        // fake twitter HTML for deleted tweets

        // Can we use react-twitter-embed with a callback function
        // https://saurabhnemade.github.io/react-twitter-embed/?path=/story/twitter-tweet-embed--tweet-with-media-embed-with-text-placeholder
        // The loading of tweets using that is much nicer but not sure
        // how to handle deleted tweets. The callback looks as if it's passed
        // the HTML element that's just been added so maybe we can inspect that
        // and then replace the content if the tweet has been deleted.

        if (json.status === 200)
            return json.data.html;
        else
            return "tweet not available";
    }

    return {
        getTweet,
        getConversation,
        getTweetHTML
    }
}