import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";

import { Gradient } from "@mui/icons-material";

import { ROLES } from "@/constants/roles";
import {
  resetSyntheticImageDetectionImage,
  setSyntheticImageDetectionLoading,
  setSyntheticImageDetectionNearDuplicates,
  setSyntheticImageDetectionResult,
} from "@/redux/actions/tools/syntheticImageDetectionActions";
import { isValidUrl } from "@Shared/Utils/URLUtils";
import { preprocessFileUpload } from "@Shared/Utils/fileUtils";
import axios from "axios";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { setError } from "redux/reducers/errorReducer";

import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import StringFileUploadField from "../../../Shared/StringFileUploadField";
import { syntheticImageDetectionAlgorithms } from "./SyntheticImageDetectionAlgorithms";
import SyntheticImageDetectionResults from "./syntheticImageDetectionResults";

const SyntheticImageDetection = () => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const urlParam = urlParams.get("url");

  const keyword = i18nLoadNamespace(
    "components/NavItems/tools/SyntheticImageDetection",
  );
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );
  const keywordWarning = i18nLoadNamespace("components/Shared/OnWarningInfo");

  const role = useSelector((state) => state.userSession.user.roles);

  const isLoading = useSelector(
    (state) => state.syntheticImageDetection.loading,
  );
  const result = useSelector((state) => state.syntheticImageDetection.result);
  const url = useSelector((state) => state.syntheticImageDetection.url);
  const nd = useSelector((state) => state.syntheticImageDetection.duplicates);
  const [input, setInput] = useState(url ? url : "");
  const [imageFile, setImageFile] = useState(undefined);

  const [imageType, setImageType] = useState(undefined);

  const [autoResizeLocalFile, setAutoResizeLocalFile] = useState(true);

  const dispatch = useDispatch();

  const IMAGE_FROM = {
    URL: "url",
    UPLOAD: "local",
  };

  const workerRef = useRef(null);

  useEffect(() => {
    if (urlParam && !input) {
      setInput(urlParam);
      handleSubmit(urlParam);
    }
  }, []);

  useEffect(() => {
    if (url && input && !result) {
      handleSubmit(input);
    }
  }, [url, input, result]);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("@workers/resizeImageWorker", import.meta.url),
    );

    return () => {
      workerRef.current.terminate();
    };
  }, []);

  /**
   *
   * @param image
   */
  const resizeImageWithWorker = (image) => {
    return new Promise((resolve, reject) => {
      const workerInstance = new Worker(
        new URL("@workers/resizeImageWorker", import.meta.url),
      );
      workerInstance.postMessage(image);

      workerInstance.onerror = function (e) {
        reject(e.error);
      };

      workerInstance.onmessage = function (e) {
        // console.log(e);
        resolve(e.data);
      };
    });
  };

  const getSyntheticImageScores = async (
    url,
    processURL,
    dispatch,
    type,
    image,
  ) => {
    if (!processURL || (!url && !image)) {
      return;
    }

    dispatch(setSyntheticImageDetectionLoading(true));
    const modeURL = "images/";

    const services = syntheticImageDetectionAlgorithms
      .map((algorithm) => algorithm.apiServiceName)
      .join(",");

    const baseURL = process.env.REACT_APP_CAA_DEEPFAKE_URL;

    const getUserFriendlyError = (error) => {
      // Default error
      if (!error) {
        return keyword("synthetic_image_detection_error_generic");
      }

      if (
        error.includes("Received status code 400") ||
        error.includes("Cannot open image from")
      )
        return keyword("synthetic_image_detection_error_400");

      return keyword("synthetic_image_detection_error_generic");
    };

    const handleError = (e) => {
      dispatch(setError(e));
      dispatch(setSyntheticImageDetectionLoading(false));
    };

    if (!isValidUrl(url) && !image) {
      handleError(keywordWarning("error_invalid_url"));
      return;
    }

    let res;
    const bodyFormData = new FormData();

    try {
      switch (type) {
        case IMAGE_FROM.UPLOAD:
          bodyFormData.append("file", image);
          res = await axios.post(baseURL + modeURL + "jobs", bodyFormData, {
            method: "post",
            params: { services: services, search_similar: true },
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          break;

        default:
          res = await axios.post(baseURL + modeURL + "jobs", null, {
            params: { url: url, services: services, search_similar: true },
          });
          break;
      }
    } catch (error) {
      const processedError = getUserFriendlyError(
        error?.response?.data?.message ?? "error_" + error.status,
      );
      handleError(processedError);
    }

    const getResult = async (id) => {
      let response;
      try {
        response = await axios.get(baseURL + modeURL + "reports/" + id);
      } catch (error) {
        handleError("error_" + error.status);
      }

      if (response && response.data != null) {
        dispatch(
          setSyntheticImageDetectionResult({
            url: image ? URL.createObjectURL(image) : url,
            result: response.data,
          }),
        );
      }

      if (
        response &&
        response.data &&
        response.data.similar_images &&
        response.data.similar_images.completed
      ) {
        let imgSimilarRes;

        try {
          imgSimilarRes = await axios.get(baseURL + modeURL + "similar/" + id);
        } catch (error) {
          handleError("error_" + error.status);
        }

        //console.log(imgSimilarRes.data);

        if (
          !imgSimilarRes.data ||
          !imgSimilarRes.data.similar_media ||
          !Array.isArray(imgSimilarRes.data.similar_media) ||
          imgSimilarRes.data.similar_media.length === 0
        ) {
          dispatch(setSyntheticImageDetectionNearDuplicates(null));
        }

        dispatch(setSyntheticImageDetectionNearDuplicates(imgSimilarRes.data));
      }
    };

    const waitUntilFinish = async (id) => {
      let response;

      try {
        response = await axios.get(baseURL + modeURL + "jobs/" + id);
      } catch (error) {
        handleError("error_" + error.status);
      }

      if (response && response.data && response.data.status === "PROCESSING") {
        await sleep(waitUntilFinish, id);
      } else if (
        response &&
        response.data &&
        response.data.status === "COMPLETED"
      ) {
        await getResult(id);
      } else {
        handleError("error_" + response.data.status);
      }
    };

    if (!res || !res.data) return;
    await waitUntilFinish(res.data.id);
  };

  function sleep(fn, param) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(fn(param)), 3000);
    });
  }

  const handleClose = () => {
    setInput("");
    setImageFile(undefined);
    dispatch(resetSyntheticImageDetectionImage());
  };

  const preprocessingSuccess = (file) => {
    setImageFile(file);
    return file;
  };

  const preprocessingError = () => {
    dispatch(setError(keywordWarning("warning_file_too_big")));
  };

  const preprocessImage = (file) => {
    return preprocessFileUpload(
      file,
      role,
      undefined,
      preprocessingSuccess,
      preprocessingError,
    );
  };

  /**
   *
   * @param url {string}
   * @returns {Promise<void>}
   */
  const handleSubmit = async (url) => {
    const processedFile =
      autoResizeLocalFile && imageFile
        ? role.includes(ROLES.BETA_TESTER)
          ? await resizeImageWithWorker(imageFile)
          : imageFile
        : imageFile;

    if (autoResizeLocalFile && processedFile) {
      setImageFile(processedFile);
    }

    dispatch(resetSyntheticImageDetectionImage());
    const urlInput = url ? url : input;
    const type =
      urlInput && typeof urlInput === "string"
        ? IMAGE_FROM.URL
        : IMAGE_FROM.UPLOAD;

    await getSyntheticImageScores(
      urlInput,
      true,
      dispatch,
      type,
      processedFile,
    );
  };

  useEffect(() => {
    if (!result) return;

    if (imageFile && imageFile instanceof File) {
      setImageType(imageFile.type);
    }

    if (
      input &&
      typeof input === "string" &&
      input !== "" &&
      URL.canParse(input)
    ) {
      try {
        fetch(input, {
          method: "GET",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
            Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
          },
        }).then(async (response) => {
          //console.log(response.headers.get("Content-Type"));
          const mimeType = (await response.blob()).type;
          setImageType(mimeType);
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [imageFile, input, result]);

  const toggleAutoResizeLocalFile = () => {
    setAutoResizeLocalFile((prev) => !prev);
  };

  return (
    <Box>
      <HeaderTool
        name={keywordAllTools("navbar_synthetic_image_detection")}
        description={keywordAllTools(
          "navbar_synthetic_image_detection_description",
        )}
        icon={
          <Gradient
            style={{
              fill: "var(--mui-palette-primary-main)",
              height: "40px",
              width: "auto",
            }}
          />
        }
      />
      <Stack
        direction="column"
        spacing={2}
        sx={{
          mb: 4,
        }}
      >
        <Alert severity="warning">
          {keywordWarning("warning_beta_synthetic_image_detection")}
        </Alert>
      </Stack>
      <Card variant="outlined">
        <Box
          sx={{
            p: 4,
          }}
        >
          <Stack direction="column" spacing={2}>
            <form>
              <StringFileUploadField
                labelKeyword={keyword("synthetic_image_detection_link")}
                placeholderKeyword={keyword(
                  "synthetic_image_detection_placeholder",
                )}
                submitButtonKeyword={keyword("submit_button")}
                localFileKeyword={keyword("button_localfile")}
                urlInput={input}
                setUrlInput={setInput}
                fileInput={imageFile}
                setFileInput={setImageFile}
                handleSubmit={handleSubmit}
                fileInputTypesAccepted={"image/*"}
                handleCloseSelectedFile={handleClose}
                preprocessLocalFile={preprocessImage}
                isParentLoading={isLoading}
              />
            </form>

            {role.includes(ROLES.BETA_TESTER) && imageFile && (
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={autoResizeLocalFile}
                      onChange={toggleAutoResizeLocalFile}
                      size="small"
                      disabled={isLoading}
                    />
                  }
                  label="Auto-Resize"
                />
              </FormGroup>
            )}

            {isLoading && (
              <Box
                sx={{
                  mt: 3,
                }}
              >
                <LinearProgress />
              </Box>
            )}
          </Stack>
        </Box>
      </Card>
      <Box
        sx={{
          m: 3,
        }}
      />
      {result && (
        <SyntheticImageDetectionResults
          results={result}
          url={url}
          handleClose={handleClose}
          nd={nd}
          imageType={imageType}
        />
      )}
    </Box>
  );
};

export default SyntheticImageDetection;
