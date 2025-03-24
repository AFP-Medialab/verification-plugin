import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import useAuthenticatedRequest from "@Shared/Authentication/useAuthenticatedRequest";
import { isValidUrl } from "@Shared/Utils/URLUtils";
import axios from "axios";
import { setError } from "redux/reducers/errorReducer";

import {
  resetKeyframes,
  setKeyframesFeatures,
  setKeyframesLoading,
  setKeyframesResult,
} from "../../../../../redux/reducers/tools/keyframesReducer";

export const useKeyframeWrapper = (url, keyword) => {
  const dispatch = useDispatch();
  const keyframe_url = process.env.REACT_APP_KEYFRAME_API;

  useEffect(() => {
    let source = axios.CancelToken.source();

    let jsonData = {
      video_url: url,
      user_key: process.env.REACT_APP_KEYFRAME_TOKEN,
      overwrite: 0,
    };

    const handleError = (e) => {
      if (keyword(e) !== "") dispatch(setError(keyword(e)));
      else dispatch(setError(keyword("keyframes_error_default")));
      dispatch(setKeyframesLoading(false));
    };

    const lastGet = (itiUrl, video_id) => {
      axios
        .get(itiUrl)
        .then((response) => {
          dispatch(
            setKeyframesResult({
              url: url,
              result: response.data,
              notification: false,
              loading: false,
              video_id: video_id,
            }),
          );
        })
        .catch((error) => handleError(error));
    };

    const getUntil = (url, video_id) => {
      let data = null;
      const interval = setInterval(() => {
        if (data) {
          switch (data["status"]) {
            case "VIDEO_WAITING_IN_QUEUE":
            case "VIDEO_DOWNLOAD_STARTED":
            case "SUBSHOT_DETECTION_ANALYSIS_STARTED":
            case "VIDEO_SUBSHOT_SEGMENTATION_STARTED":
              axios
                .get(url, { cancelToken: source.token })
                .then((response) => {
                  data = response["data"];
                })
                .catch((errors) => {
                  //console.log("Errors ", errors)
                  handleError("keyframes_error_" + errors);
                });
              break;
            case "VIDEO_SUBSHOT_SEGMENTATION_COMPLETED":
            case "SUBSHOT_DETECTION_ANALYSIS_COMPLETED":
              lastGet(keyframe_url + "/result/" + video_id + "_json", video_id);
              clearInterval(interval);
              break;
            default:
              //console.log("default code ", data["status"])
              handleError("keyframes_error_" + data["status"]);
              clearInterval(interval);
              break;
          }
        } else {
          axios
            .get(url, { cancelToken: source.token })
            .then((response) => {
              data = response["data"];
            })
            .catch((errors) => {
              //console.log("Errors ", errors)
              handleError("keyframes_error_" + errors);
            });
        }
      }, 3000);
    };

    const postUrl = (multimediaUrl, data) => {
      axios
        .post(multimediaUrl, data, { cancelToken: source.token })
        .then((response) => {
          getUntil(
            keyframe_url + "/status/" + response.data.video_id,
            response.data.video_id,
          );
        })
        .catch((errors) => {
          const error_code = errors.code ? errors.code : "default";
          handleError("keyframes_error_" + error_code);
        });
    };

    if (url === undefined || url === "") return;
    dispatch(resetKeyframes());
    dispatch(setKeyframesLoading(true));
    postUrl(keyframe_url + "/subshot", jsonData);
    return () => {};
  }, [url]);
};

export const useProcessKeyframes = () => {
  const [status, setStatus] = useState(null);
  const [featureStatus, setFeatureStatus] = useState(null);

  const dispatch = useDispatch();

  const authenticatedRequest = useAuthenticatedRequest();

  // Step 1 Fallback: use old service to send the URL (to be deprecated)
  const sendUrlMutationOld = useMutation({
    mutationFn: async ({ url }) => {
      // Perform url validation
      if (!url || url === "" || !isValidUrl(url)) {
        throw new Error("Invalid URL");
      }

      setStatus("Sending URL...");

      const d = JSON.stringify({
        overwrite: 0,
        video_url: url,
      });

      const config = {
        method: "post",
        url: process.env.REACT_APP_KEYFRAME_API + "/subshot",
        headers: {
          "Content-Type": "application/json",
        },
        data: d,
      };

      console.log(config);

      const response = await axios(config);

      console.log(response);

      //job id validation
      if (
        !response.data ||
        !response.data.video_id ||
        typeof response.data.video_id !== "string" ||
        response.data.video_id === ""
      ) {
        throw new Error("Invalid KSE session");
      }

      return response.data.video_id;
    },
  });

  // Step 1: Send URL
  const sendUrlMutation = useMutation({
    mutationFn: async ({ url }) => {
      // Perform url validation
      if (!url || url === "" || !isValidUrl(url)) {
        throw new Error("Invalid URL");
      }

      setStatus("Sending URL...");

      const d = JSON.stringify({
        video: url,
      });

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: process.env.REACT_APP_KEYFRAME_API_2,
        headers: {
          "Content-Type": "application/json",
        },
        data: d,
      };
      const response = await authenticatedRequest(config);

      //job id validation
      if (
        !response.data ||
        !response.data.session ||
        typeof response.data.session !== "string" ||
        response.data.session === ""
      ) {
        throw new Error("Invalid KSE session");
      }

      return response.data.session;
    },
  });

  // Step 2: Polling for status (to be deprecated)
  const checkStatusMutationOld = useMutation({
    mutationFn: async (jobId) => {
      let currentStatus;

      do {
        const config = {
          method: "get",
          url: `${process.env.REACT_APP_KEYFRAME_API}/status/${jobId}`,
        };

        const response = await axios(config);

        if (!response.data.status) {
          throw new Error("KSE Job id not found");
        }

        currentStatus = response.data.status;

        setStatus(`Processing...`);

        if (currentStatus !== "SUBSHOT_DETECTION_ANALYSIS_COMPLETED") {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 3s before next check
        }
      } while (currentStatus !== "SUBSHOT_DETECTION_ANALYSIS_COMPLETED");

      return jobId;
    },
  });

  // Step 2: Polling for status
  const checkStatusMutation = useMutation({
    mutationFn: async (jobId) => {
      let currentStatus;

      do {
        const config = {
          method: "get",
          url: `${process.env.REACT_APP_KEYFRAME_API_2}/status/${jobId}`,
        };

        const response = await authenticatedRequest(config);

        if (!response.data.status) {
          throw new Error("KSE Job id not found");
        }

        currentStatus = response.data.status;

        const statusMessage =
          currentStatus.indexOf(":") !== -1
            ? currentStatus.substring(0, currentStatus.indexOf(":"))
            : currentStatus;
        const statusPercentage = currentStatus.split(":").pop();

        setStatus(`Processing... ${statusMessage} ${statusPercentage}%`);

        if (currentStatus !== "completed:::100") {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 3s before next check
        }
      } while (currentStatus !== "completed:::100");

      return jobId;
    },
  });

  // Step 3: Get Keyframes
  const fetchFeatureDataMutation = useMutation({
    mutationFn: async (jobId) => {
      setStatus("Retrieving features...");
      const config = {
        method: "get",
        url: `${process.env.REACT_APP_KEYFRAME_API_2}/keyframes_enhance/${jobId}`,
      };

      const response = await authenticatedRequest(config);
      let faces = /** @type {ImagesFeature[]} */ [];
      let texts = /** @type {ImagesFeature[]} */ [];

      for (const imageFeature of response.data.faces_groups) {
        const items = /** @type {ImageItem[]} */ [];

        for (const it of imageFeature.items) {
          items.push({
            frame: it.frame,
            frameTime: it.frame_time,
            imageUrl: it.item_url,
          });
        }

        const representative = /** @type {ImageRepresentative} */ {
          index: imageFeature.representative.item_index,
          imageUrl: imageFeature.representative.enhanced_url,
        };

        faces.push({
          items: items,
          representative: representative,
        });
      }

      for (const imageFeature of response.data.text_groups) {
        const items = /** @type {ImageItem[]} */ [];

        for (const it of imageFeature.items) {
          items.push({
            frame: it.frame,
            frameTime: it.frame_time,
            imageUrl: it.item_url,
          });
        }

        const representative = /** @type {ImageRepresentative} */ {
          index: imageFeature.representative.item_index,
          imageUrl: imageFeature.representative.enhanced_url,
        };

        texts.push({
          items: items,
          representative: representative,
        });
      }

      setFeatureStatus("Completed");

      return /** @type {KeyframesFeatures} */ {
        faces: faces,
        texts: texts,
      };
    },
    onSuccess: (data) => {
      dispatch(setKeyframesFeatures(data));
    },
  });

  /**
   * Old Keyframes call to deprecate soon
   */
  const fetchDataMutationOld = useMutation({
    mutationFn: async (jobId) => {
      const config = {
        method: "get",
        url: `${process.env.REACT_APP_KEYFRAME_API}/result/${jobId}_json`,
      };

      const response = await axios(config);
      console.log(response.data);

      setStatus("Completed");

      let shots = /** @type {Shot[]} */ [];

      for (const shot of response.data.shots) {
        shots.push({
          shotNumber: response.data.shots.indexOf(shot),
          beginFrame: shot.beginframe,
          beginTime: shot.begintime,
          endFrame: shot.endframe,
          endTime: shot.endtime,
        });
      }

      let subshots = /** @type {Subshot[]} */ [];

      for (const subshot of response.data.subshots) {
        subshots.push({
          subshotNumber: response.data.subshots.indexOf(subshot),
          beginFrame: null,
          beginTime: subshot.begintime,
          endFrame: subshot.endframe,
          endTime: subshot.endtime,
          shot: subshot.shot,
        });
      }

      let keyframes = /** @type {Keyframe[]} */ [];
      for (const kf of response.data.thumbnails) {
        keyframes.push({
          frame: null,
          keyframeTime: kf.time,
          keyframeUrl: kf.url,
          shot: null,
          subshot: null,
        });
      }

      let keyframesXtra = /** @type {Keyframe[]} */ [];
      for (const kf of response.data.subshots) {
        keyframesXtra.push({
          frame: kf.frame,
          keyframeTime: kf.keyframe_time,
          keyframeUrl: kf.keyframe_url,
          shot: kf.shot,
          subshot: kf.subshot,
        });
      }

      return /** @type {KeyframesData} */ {
        session:
          typeof response.data.session === "string"
            ? response.data.session
            : "",
        url: typeof response.data.url === "string" ? response.data.url : "",
        duration:
          typeof response.data.duration === "string"
            ? response.data.duration
            : "",
        framerate:
          typeof response.data.framerate === "number"
            ? response.data.framerate
            : 0,
        keyframes: keyframes,
        keyframesXtra: keyframesXtra,
        shots: shots,
        subshots: subshots,
        zipFileUrl:
          typeof response.data.keyframes_zip === "string"
            ? response.data.keyframes_zip
            : "",
      };
    },
    onSuccess: (data) => {
      dispatch(setKeyframesResult(data));
    },
  });

  const fetchDataMutation = useMutation({
    mutationFn: async (jobId) => {
      const config = {
        method: "get",
        url: `${process.env.REACT_APP_KEYFRAME_API_2}/result/${jobId}`,
      };

      const response = await authenticatedRequest(config);
      setStatus("Completed");

      let shots = /** @type {Shot[]} */ [];

      for (const shot of response.data.shots) {
        shots.push({
          shotNumber: response.data.shots.indexOf(shot),
          beginFrame: shot.beginframe,
          beginTime: shot.begintime,
          endFrame: shot.endframe,
          endTime: shot.endtime,
        });
      }

      let subshots = /** @type {Subshot[]} */ [];

      for (const subshot of response.data.subshots) {
        subshots.push({
          subshotNumber: response.data.subshots.indexOf(subshot),
          beginFrame: subshot.beginframe,
          beginTime: subshot.begintime,
          endFrame: subshot.endframe,
          endTime: subshot.endtime,
          shot: subshot.shot,
        });
      }

      let keyframes = /** @type {Keyframe[]} */ [];
      for (const kf of response.data.keyframes) {
        keyframes.push({
          frame: kf.frame,
          keyframeTime: kf.keyframe_time,
          keyframeUrl: kf.keyframe_url,
          shot: kf.shot,
          subshot: kf.subshot,
        });
      }

      let keyframesXtra = /** @type {Keyframe[]} */ [];
      for (const kf of response.data.keyframes_xtra) {
        keyframesXtra.push({
          frame: kf.frame,
          keyframeTime: kf.keyframe_time,
          keyframeUrl: kf.keyframe_url,
          shot: kf.shot,
          subshot: kf.subshot,
        });
      }

      return /** @type {KeyframesData} */ {
        session:
          typeof response.data.session === "string"
            ? response.data.session
            : "",
        url: typeof response.data.url === "string" ? response.data.url : "",
        duration:
          typeof response.data.duration === "string"
            ? response.data.duration
            : "",
        framerate:
          typeof response.data.framerate === "number"
            ? response.data.framerate
            : 0,
        keyframes: keyframes,
        keyframesXtra: keyframesXtra,
        shots: shots,
        subshots: subshots,
        zipFileUrl:
          typeof response.data.keyframes_zip === "string"
            ? response.data.keyframes_zip
            : "",
      };
    },
    onSuccess: (data) => {
      dispatch(setKeyframesResult(data));
    },
  });

  // Execute the whole process
  const executeProcess = async (url, role) => {
    try {
      let jobId;

      // Use the old service
      // if (
      //   !role.includes(ROLES.BETA_TESTER) &&
      //   !role.includes(ROLES.EVALUATION) &&
      //   !role.includes(ROLES.EXTRA_FEATURE)
      // ) {
      jobId = await sendUrlMutationOld.mutateAsync({ url });

      await checkStatusMutationOld.mutateAsync(jobId);

      await fetchDataMutationOld.mutateAsync(jobId);

      // }

      return;

      jobId = await sendUrlMutation.mutateAsync({ url });
      await checkStatusMutation.mutateAsync(jobId);
      await fetchFeatureDataMutation.mutateAsync(jobId);
      return fetchDataMutation.mutateAsync(jobId);
    } catch (error) {
      console.error("Process failed:", error);
      setStatus("Error occurred");
      throw error;
    }
  };

  return {
    executeProcess,
    status, //Keyframes status
    isPending:
      sendUrlMutationOld.isPending ||
      checkStatusMutationOld.isPending ||
      sendUrlMutation.isPending ||
      checkStatusMutation.isPending ||
      fetchDataMutation.isPending,
    data: fetchDataMutation.data,
    error:
      sendUrlMutation.error ||
      checkStatusMutation.error ||
      fetchDataMutation.error,

    featureStatus,
    isFeatureDataPending: fetchFeatureDataMutation.isPending,
    featureData: fetchFeatureDataMutation.data,
    featureDataError: fetchFeatureDataMutation.error,
  };
};
