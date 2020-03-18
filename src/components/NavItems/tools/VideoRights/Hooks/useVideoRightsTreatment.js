import {useEffect} from "react";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {setVideoRightsResult, setVideoRightsLoading} from "../../../../../redux/actions/tools/videoRightsActions"
import {setError} from "../../../../../redux/actions/errorActions"
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/VideoRights.tsv";

const useVideoRightsTreatment = (url) => {
    const dispatch = useDispatch();
    const keyword = useLoadLanguage("components/NavItems/tools/VideoRights.tsv", tsv);


    useEffect(() => {
        const handleError = (error) => {
            if (keyword(error) !== "")
                dispatch(setError((keyword(error))));
            else
                dispatch(setError(keyword("keyframes_error_default")));
            dispatch(setVideoRightsLoading(false));
        };

        const addTermsAndUsers = (result) => {
            axios.get(result._links.reuseTerms.href)
                .then(terms => {
                    result.terms = terms.data._embedded.defaultReuseTerms;
                        axios.get(result._links.user.href)
                            .then(user => {
                                result.user = user.data;
                                dispatch(setVideoRightsResult(url, result, false, false));
                            })
                            .catch(handleError)
                    }
                )
                .catch(handleError)
        };

        let kind = "";
        if (url && url !== "" && url !== undefined) {
            let api_url = "https://rights-api.invid.udl.cat/";
            if (url.startsWith("https://www.youtube.com/"))
                kind = "youTubeVideos";
            else if (url.startsWith("https://www.facebook.com/"))
                kind = "facebookVideos";
            else if (url.startsWith("https://twitter.com/"))
                kind = "twitterVideos";
            else {
                handleError("table_error_unavailable");
                return;
            }
            api_url += kind;

            dispatch(setVideoRightsLoading(true));
            axios.post(api_url, {"url": url}, {headers: {ContentType: 'application/json'}})
                .then(response => {
                    let result = response.data;
                    result.kind = kind;
                    result.RIGHTS_APP = api_url;
                    addTermsAndUsers(result);
                })
                .catch(errors => {
                    handleError(errors)
                });
        }
    }, [url]);
};
export default useVideoRightsTreatment