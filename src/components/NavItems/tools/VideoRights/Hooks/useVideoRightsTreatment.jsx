import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  setVideoRightsResult,
  setVideoRightsLoading,
} from "../../../../../redux/actions/tools/videoRightsActions";
import { setError } from "redux/reducers/errorReducer";

const useVideoRightsTreatment = (url, keyword) => {
  const dispatch = useDispatch();
  const video_url = process.env.REACT_APP_VIDEORIGHT_API;

  useEffect(() => {
    const handleError = () => {
      dispatch(setError(keyword("keyframes_error_default")));
      dispatch(setVideoRightsLoading(false));
    };

    const addTermsAndUsers = (result) => {
      let href = result._links.reuseTerms.href;
      href = href.replace("https://rights-api.invid.udl.cat/", video_url);
      let href_user = result._links.user.href;
      href_user = href_user.replace(
        "https://rights-api.invid.udl.cat/",
        video_url,
      );
      axios
        .get(href)
        .then((terms) => {
          result.terms = terms.data._embedded.defaultReuseTerms;
          axios
            .get(href_user)
            .then((user) => {
              result.user = user.data;
              dispatch(setVideoRightsResult(url, result, false, false));
            })
            .catch(handleError);
        })
        .catch(handleError);
    };

    let kind = "";
    if (url && url !== "" && url !== undefined) {
      //let api_url = "https://rights-api.invid.udl.cat/";
      let api_url = video_url;
      if (url.startsWith("https://www.youtube.com/")) kind = "youTubeVideos";
      else if (url.startsWith("https://www.facebook.com/"))
        kind = "facebookVideos";
      else if (url.startsWith("https://twitter.com/")) kind = "twitterVideos";
      else {
        handleError("table_error_unavailable");
        return;
      }
      api_url += kind;
      axios
        .post(
          api_url,
          { url: url },
          { headers: { ContentType: "application/json" } },
        )
        .then((response) => {
          let result = response.data;
          result.kind = kind;
          result.RIGHTS_APP = api_url;
          addTermsAndUsers(result);
        })
        .catch(() => {
          handleError();
        });
    }
  }, [url]);
};
export default useVideoRightsTreatment;
