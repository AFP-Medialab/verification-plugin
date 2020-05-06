import _ from "lodash";
import bigInt from "big-integer";
import { useDispatch } from "react-redux";

//internal
import {setError} from "../../../redux/actions/errorActions";
import {tweetReceivedAction, twitterRequestLoadingAction, twitterResetAction, twitterSetUrl} from
        "../../../redux/actions/scrapers/twitterActions";
import tsv from "../../../LocalDictionary/components/Scrapers/Twitter.tsv";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import useAuthenticatedRequest from "../../Shared/Authentication/useAuthenticatedRequest";


export default function useTwitterApi() {

    const dispatch = useDispatch();
    const keyword = useLoadLanguage("components/Scrapers/Twitter.tsv", tsv);

    const authenticatedRequest = useAuthenticatedRequest();
    const ELK_URL = process.env.REACT_APP_ELK_URL;
    const TWINT_WRAPPER_URL = process.env.REACT_APP_TWINT_WRAPPER_URL;


    const createQuery = (user, tweetId) => {
        let previousTweet = bigInt(tweetId).minus(1);
        let query = `from:${user} max_id:${tweetId} since_id:${previousTweet}`
        return  {
            "keywordList": [query],
            "disableTimeRange":true }
    }

    const getQueryStatus =  (sessionId, tweetId) =>{
        let axiosConfig = {
            method: 'get',
            baseURL: TWINT_WRAPPER_URL,
            url: `/status/${sessionId}`
        };

        authenticatedRequest(axiosConfig).then(response => {
            switch (response.data.status) {
                case "Error":
                    dispatch(twitterRequestLoadingAction(false));
                    dispatch(setError(keyword("twitter_error")));
                    break;
                case "Done":
                    dispatch(twitterRequestLoadingAction(false));
                    getElkResult(tweetId)
                    break;
                case "Pending":
                case "Running":
                    setTimeout( () => getQueryStatus(sessionId, tweetId), 3000);
                default:
                    break;
            }
        })
    }

    const getElkResult = (tweetId) => {
      fetch(ELK_URL + '?q=id:' + tweetId)
        .then(response => response.json())
        .then(responseJson => {
            if(responseJson!=null &&  responseJson.hits.total.value == 1) {
                let tweet = responseJson.hits.hits[0];
                let finalTweet = {tweet:{}};
                finalTweet.tweetId = tweet._source.id;
                finalTweet.tweetUrl = tweet._source.link;
                finalTweet.tweetUser = tweet._source.username;
                finalTweet.tweetText = tweet._source.tweet;
                finalTweet.imageUrl = tweet._source.photos !=null ? tweet._source.photos[0] : null;
                finalTweet.videoUrl = tweet._source.video !=0 ? "https://twitter.com/i/videos/" + tweetId : null;
                finalTweet.linkUrl = tweet._source.urls !=null ? tweet._source.urls.toString() : null;
                finalTweet.tweetHashTags = tweet._source.hashtags.toString();
                dispatch(tweetReceivedAction(finalTweet));
            }
            else {
                dispatch(setError(keyword("twitter_no_tweet_found")));
            }
        })
    }


    const getTweet = (url) => {

        dispatch(twitterResetAction());

        if (_.isEmpty(url) ||  url.match("((https?:/{2})?(www.)?twitter.com/\\w{1,15}/status/\\d*)")==null) {
            dispatch(setError(keyword("twitter_invalid_url")));
            return;
        }

        dispatch(twitterRequestLoadingAction());
        dispatch(twitterSetUrl(url))

        let splitUrl = url.split("/");
        let user = splitUrl[3];
        let tweetId = splitUrl[5];

        let axiosConfig = {
            method: 'post',
            baseURL: TWINT_WRAPPER_URL,
            url: '/collect',
            data: createQuery(user, tweetId)
        };

        authenticatedRequest(axiosConfig)
            .then(response => {
                getQueryStatus(response.data.session, tweetId)
            })
            .catch(error => {
                dispatch(twitterRequestLoadingAction(false));
                dispatch(setError(error.message + keyword("twitter_log_in")))
            })
    }

    return {
        getTweet
    };
};

