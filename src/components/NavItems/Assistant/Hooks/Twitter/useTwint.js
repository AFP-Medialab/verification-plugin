import useAuthenticatedRequest from "../../../../Shared/Authentication/useAuthenticatedRequest";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/Twitter.tsv";
import {useDispatch} from "react-redux";
import bigInt from "big-integer";
import {
    cleanTwitterState,
    setTweetMedia,
    setTweetText,
    setTwitterLoading,
    setTwitterLoadingMessage, setTwitterUrl
} from "../../../../../redux/actions/twitterActions";

export default function  useTwint() {

    const ELK_URL = process.env.REACT_APP_ELK_URL;
    const TwintWrapperUrl = process.env.REACT_APP_TWINT_WRAPPER_URL;
    const keyword = useLoadLanguage("components/Twitter.tsv", tsv);
    const authenticatedRequest = useAuthenticatedRequest();
    const dispatch = useDispatch();


    const createQuery = (user, tweetId) => {
        const previousTweet = bigInt(tweetId).minus(1);
        const query = `from:${user} max_id:${tweetId} since_id:${previousTweet}`
        return  {
            "keywordList": [query],
            "disableTimeRange":true
        }
    }

    const getElkResult = (tweetId) => {
        fetch(ELK_URL + '?q=id:' + tweetId)
            .then(response => response.json())
            .then(data => {
                if (data!=null){
                    console.log(data);
                    dispatch(setTwitterLoading(false));
                    dispatch(setTwitterLoadingMessage(""));
                    processResult(tweetId, data)
                }
                else {
                    console.log("yeah, not found mate")
                }
            });
    }

    const processResult = (tweetId, result) => {
        if (result!=null && result.hits.total.value == 1) {
            dispatch(setTweetText(result.hits.hits[0]._source.tweet));

            if(result.hits.hits[0]._source.photos != null){
                dispatch(setTweetMedia(result.hits.hits[0]._source.photos[0]));
            }
            else if (result.hits.hits[0]._source.video == 1){
                dispatch(setTweetMedia("https://twitter.com/i/videos/" + tweetId));
            }
            else {
                dispatch(setTweetMedia(""));
            }
        }
    }

    const getResultUntilsDone = async (sessionId, tweetId) => {
        const axiosConfig = {
            method: 'get',
            baseURL: TwintWrapperUrl,
            url: `/status/${sessionId}`
        };
        await authenticatedRequest(axiosConfig)
            .then(async response => {
                if (response.data.status === "Error")
                    console.log("Error!!")
                else if (response.data.status === "Done") {
                    getElkResult(tweetId);
                }
                else if (response.data.status === "Pending" || response.data.status === "Running") {
                    dispatch(setTwitterLoading(true));
                    dispatch(setTwitterLoadingMessage("Please hold. Currently trying to retrieve tweet."));
                    setTimeout(() => getResultUntilsDone(sessionId, tweetId), 3000);
                }
            })
            .catch(e => console.log(e));
    };

    const runTwintQuery = (url) => {
        dispatch(setTwitterUrl(url));
        const result = url.split("/");
        const user = result[3];
        const tweetId = result[5];

        const axiosConfig = {
            method: 'post',
            baseURL: TwintWrapperUrl,
            url: '/collect',
            data: createQuery(user, tweetId)
        };
        authenticatedRequest(axiosConfig)
            .then(response => {
                getResultUntilsDone(response.data.session, tweetId)
                    .catch(error => {
                        console.log(error);
                    })});
    }


    return {
        runTwintQuery
    };
};
