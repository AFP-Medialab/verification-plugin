import { useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  setKeyframesSimilarityLoading,
  setSimilarity,
} from "@/redux/reducers/tools/keyframesReducer";
import axios from "axios";

export const useVideoSimilarity = (url, keyword) => {
  const dispatch = useDispatch();
  const similarityAPI = import.meta.env.VITE_DBKF_SIMILARITY_API;
  useEffect(() => {
    const getData = (dbkfApiUrl) => {
      axios
        .get(dbkfApiUrl)
        .then((response) => {
          const resultData = [];

          Object.values(response.data).forEach((value) => {
            resultData.push(value);
          });

          dispatch(setSimilarity(resultData));
          dispatch(setKeyframesSimilarityLoading(false));
        })
        .catch((error) => {
          console.error(error);
          dispatch(setKeyframesSimilarityLoading(false));
        });
    };

    if (url) {
      dispatch(setKeyframesSimilarityLoading(true));
      getData(
        similarityAPI +
          "/similarVideos?collection_id=similarity&threshold_similarity=" +
          keyword("dbkf_threshold") +
          "&url=" +
          url,
      );
    }
  }, [url]);
};
