import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  setKeyframesSimilarityLoading,
  setSimilarity,
} from "../../../../../redux/actions/tools/keyframesActions";

export const useVideoSimilarity = (url, keyword) => {
  const dispatch = useDispatch();
  const similarityAPI = process.env.REACT_APP_DBKF_SIMILARITY_API;
  useEffect(() => {
    const getData = (dbkfApiUrl) => {
      axios
        .get(dbkfApiUrl)
        .then((response) => {
          //console.log(response);
          var resultData = [];

          Object.values(response.data).forEach((value) => {
            resultData.push(value);
          });

          dispatch(setSimilarity(resultData));
          dispatch(setKeyframesSimilarityLoading(false));
        })
        .catch((error) => {
          //handleError("keyframes_error_VIDEO_SIMILARITY");
          //console.error(error);
          dispatch(setKeyframesSimilarityLoading(false));
        });
    };

    if (url === undefined || url === "") {
      return;
    } else {
      dispatch(setKeyframesSimilarityLoading(true));
      getData(
        //"https://weverify-demo.ontotext.com/similarity/similarVideos?collection_id=similarity&threshold_similarity=" +
        similarityAPI +
          "/similarVideos?collection_id=similarity&threshold_similarity=" +
          keyword("dbkf_threshold") +
          "&url=" +
          url,
      );
    }

    //postUrl("http://multimedia2.iti.gr/video_analysis/segmentation", jsonData);
  }, [url]);
};
