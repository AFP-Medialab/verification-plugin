import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";

import { AudioFile } from "@mui/icons-material";

import {
  resetLoccusAudio,
  setLoccusLoading,
  setLoccusResult,
} from "@/redux/actions/tools/loccusActions";
import { isValidUrl } from "@Shared/Utils/URLUtils";
import { preprocessFileUpload } from "@Shared/Utils/fileUtils";
import axios from "axios";
import useAuthenticatedRequest from "components/Shared/Authentication/useAuthenticatedRequest";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { setError } from "redux/reducers/errorReducer";
import { v4 as uuidv4 } from "uuid";

import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import StringFileUploadField from "../../../Shared/StringFileUploadField";
import LoccusResults from "./loccusResults";

/**
 * Loccus Component - Audio authenticity verification tool
 * Provides functionality to analyze audio files for synthetic/cloned voice detection
 * @returns {JSX.Element} The Loccus tool interface
 */
const Loccus = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Loccus");
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );
  const keywordWarning = i18nLoadNamespace("components/Shared/OnWarningInfo");

  const AUDIO_FILE_DEFAULT_STATE = undefined;

  const role = useSelector((state) => state.userSession.user.roles);

  const result = useSelector((state) => state.syntheticAudioDetection.result);

  const isInconclusive = useSelector(
    (state) => state.syntheticAudioDetection.isInconclusive,
  );

  const url = useSelector((state) => state.syntheticAudioDetection.url);
  const chunks = useSelector((state) => state.syntheticAudioDetection.chunks);
  const authenticatedRequest = useAuthenticatedRequest();
  const [input, setInput] = useState(url ? url : "");
  const [audioFile, setAudioFile] = useState(AUDIO_FILE_DEFAULT_STATE);

  const dispatch = useDispatch();

  /**
   * Determines if the analysis result is inconclusive based on null chunk scores
   * @param {Array} analysisResults - Array of analysis result chunks
   * @returns {boolean|Error} true if more than 50% of chunks have null scores, false otherwise, or Error if invalid input
   */
  const isResultInconclusive = (analysisResults) => {
    if (!analysisResults || analysisResults.length === 0)
      return new Error(
        `[isResultInconclusive] Error: the analysis results are not defined.`,
      );

    let nullResultCount = 0;

    const totalChunks = analysisResults.length;

    for (const resultChunk of analysisResults) {
      if (resultChunk.score === null) nullResultCount++;
    }

    return nullResultCount / totalChunks >= 0.5;
  };

  /**
   * Analyzes audio for voice cloning/synthetic audio detection
   * @param {string} audioUrl - URL of the audio file to analyze
   * @param {boolean} shouldProcessUrl - Whether to process the URL
   * @param {Function} dispatchAction - Redux dispatch function
   * @throws {Error} When no URL or audio file is provided, or when API calls fail
   */
  const useGetVoiceCloningScore = async (
    audioUrl,
    shouldProcessUrl,
    dispatchAction,
  ) => {
    if (!shouldProcessUrl && !audioUrl && !audioFile) {
      throw new Error("No URL or audio file");
    }

    /**
     * Converts a Blob to a data URL
     * @param {Blob} blob - The blob to convert
     * @returns {Promise<string>} Promise that resolves to data URL
     */
    const blobToDataUrl = (blob) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

    /**
     * Converts a Blob to base64 string (without data URL prefix)
     * @param {Blob} blob - The blob to convert
     * @returns {Promise<string>} Promise that resolves to base64 string
     */
    const blobToBase64 = async (blob) => {
      const dataUrl = await blobToDataUrl(blob);
      return dataUrl.slice(dataUrl.indexOf(",") + 1);
    };

    let audioBlob;

    if (isValidUrl(audioUrl) && !audioFile) {
      try {
        audioBlob =
          (await axios.get(audioUrl, { responseType: "blob" })).data ?? null;
      } catch (error) {
        console.error(error);
        throw new Error(error.message || error);
      }
    }

    const base64EncodedFile = audioBlob
      ? decodeURIComponent(await blobToBase64(audioBlob))
      : await blobToBase64(audioFile);

    /**
     * Handles errors during the analysis process
     * @param {Error|string} error - The error to handle
     */
    const handleError = (error) => {
      dispatchAction(setError(error));
      dispatchAction(setLoccusLoading(false));
    };

    let uploadResponse;

    try {
      // TODO: provide a view on previous file uploads by the user

      const uploadRequestData = JSON.stringify({
        file: base64EncodedFile,
        alias: uuidv4(),
      });

      const uploadRequestConfig = {
        method: "post",
        maxBodyLength: Infinity,
        //samples
        url: process.env.REACT_APP_LOCCUS_URL + "/upload",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: uploadRequestData,
        timeout: 60000,
        signal: AbortSignal.timeout(60000),
      };

      // First, we upload the file to Loccus
      uploadResponse = await authenticatedRequest(uploadRequestConfig);

      if (
        !uploadResponse ||
        !uploadResponse.data ||
        uploadResponse.data.message
      ) {
        throw new Error("No data");
      }

      if (
        !uploadResponse.data.state ||
        uploadResponse.data.state !== "available"
      ) {
        throw new Error("The file is not available.");
      }

      // Second, we perform the Loccus authenticity verification

      const detectionRequestData = JSON.stringify({
        model: "default",
        sample: uploadResponse.data.handle,
      });

      const detectionRequestConfig = {
        method: "post",
        maxBodyLength: Infinity,
        ///verifications/authenticity
        url: process.env.REACT_APP_LOCCUS_URL + "/detection",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: detectionRequestData,
        timeout: 180000,
        signal: AbortSignal.timeout(180000),
      };

      const detectionResponse = await authenticatedRequest(
        detectionRequestConfig,
      );

      if (
        !detectionResponse ||
        !detectionResponse.data ||
        detectionResponse.data.message
      ) {
        // TODO: handle error
        return;
      }

      const chunksRequestConfig = {
        method: "get",
        maxBodyLength: Infinity,
        url:
          process.env.REACT_APP_LOCCUS_URL +
          `/detection/${detectionResponse.data.handle}/chunks?page-size=1000`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: detectionRequestData,
        timeout: 180000,
        signal: AbortSignal.timeout(180000),
      };

      const chunksResponse = await authenticatedRequest(chunksRequestConfig);

      const isAnalysisInconclusive = isResultInconclusive(chunksResponse.data);

      dispatchAction(
        setLoccusResult({
          url: audioFile ? URL.createObjectURL(audioFile) : audioUrl,
          result: detectionResponse.data,
          chunks: chunksResponse.data,
          isInconclusive: isAnalysisInconclusive,
        }),
      );
    } catch (error) {
      console.log(error);
      if (error.message.includes("canceled")) {
        handleError(keyword("loccus_error_timeout"));
        throw new Error(keyword("loccus_error_timeout"));
      } else {
        handleError(error.response?.data?.message ?? error.message);
        throw new Error(error.response?.data?.message ?? error.message);
      }
    }
  };

  /**
   * Resets the component state to default values
   */
  const resetState = () => {
    getAnalysisResultsForAudio.reset();
    setInput("");
    setAudioFile(AUDIO_FILE_DEFAULT_STATE);
    dispatch(resetLoccusAudio());
  };

  /**
   * Preprocesses and validates an audio file before upload to Hiya
   * @param {File} file - The audio file to validate
   * @returns {File|Error} The validated file or an error
   */
  const preprocessLoccusUpload = async (file) => {
    if (!(file instanceof File)) {
      dispatch(setError(keyword("error_invalid_file")));
      return new Error(keyword("error_invalid_file"));
    }

    if (!file.type.includes("audio")) {
      dispatch(setError(keyword("error_invalid_media_file")));
      return new Error(keyword("error_invalid_media_file"));
    }

    const isChromium = !!window.chrome;

    // TODO: Use ffmpeg to convert the m4a files if possible
    if (
      isChromium &&
      (file.type.includes("basic") || file.type.includes("aiff"))
    ) {
      dispatch(setError(keyword("error_invalid_audio_file")));

      resetState();

      return Error(keyword("error_invalid_audio_file"));
    }

    const audioContext = new AudioContext();
    const fileReader = new FileReader();

    // Read the file
    fileReader.readAsArrayBuffer(file);

    // Decode audio data and use a promise to await for the results
    const audioBuffer = await new Promise((resolve, reject) => {
      fileReader.onload = () => {
        if (typeof fileReader.result === "string") {
          reject("The result is not of ArrayBuffer type");
          return Error("The result is not of ArrayBuffer type");
        }

        audioContext.decodeAudioData(
          fileReader.result,
          (decodedBuffer) => {
            resolve(decodedBuffer);
          },
          (decodeError) => {
            reject(decodeError);
          },
        );
      };
    }).catch((error) => {
      console.log(error);
      dispatch(setError(keyword("loccus_error_unable_to_read_file")));
      return new Error(error);
    });

    if (!(audioBuffer instanceof AudioBuffer)) {
      return audioBuffer;
    }

    const durationInSeconds = audioBuffer.duration;

    if (durationInSeconds >= 300) {
      dispatch(setError(keyword("loccus_tip")));
      return Error(keyword("loccus_tip"));
    } else if (durationInSeconds <= 2) {
      dispatch(setError(keyword("loccus_tip")));
      return Error(keyword("loccus_tip"));
    } else {
      return file;
    }
  };

  const preprocessError = () => {
    dispatch(setError(keywordWarning("warning_file_too_big")));
  };

  const preprocessSuccess = (file) => {
    setAudioFile(file);
  };

  async function preprocessLocalFile(fileSelected) {
    return preprocessFileUpload(
      fileSelected,
      role,
      await preprocessLoccusUpload(fileSelected),
      preprocessSuccess,
      preprocessError,
    );
  }

  const getAnalysisResultsForAudio = useMutation({
    mutationFn: () => {
      return useGetVoiceCloningScore(input, true, dispatch);
    },
  });

  const handleSubmit = async () => {
    dispatch(resetLoccusAudio());

    await getAnalysisResultsForAudio.mutate();
  };

  return (
    <div>
      <HeaderTool
        name={keywordAllTools("navbar_loccus")}
        description={keywordAllTools("navbar_loccus_description")}
        icon={
          <AudioFile
            style={{
              fill: "var(--mui-palette-primary-main)",
              height: "40px",
              width: "auto",
            }}
          />
        }
      />
      <Stack direction={"column"} spacing={2}>
        <Alert severity="warning">
          {keywordWarning("warning_beta_loccus")}
        </Alert>
        <Alert severity="info">{keyword("loccus_tip")}</Alert>
      </Stack>
      <Box
        sx={{
          m: 3,
        }}
      />
      <Card variant="outlined">
        <Box
          sx={{
            p: 4,
          }}
        >
          <form>
            <StringFileUploadField
              labelKeyword={keyword("loccus_link")}
              placeholderKeyword={keyword("loccus_placeholder")}
              submitButtonKeyword={keyword("loccus_submit_button")}
              localFileKeyword={keyword("button_localfile")}
              urlInput={input}
              setUrlInput={setInput}
              fileInput={audioFile}
              setFileInput={setAudioFile}
              handleSubmit={handleSubmit}
              fileInputTypesAccepted={"audio/*"}
              handleCloseSelectedFile={resetState}
              preprocessLocalFile={preprocessLocalFile}
              isParentLoading={getAnalysisResultsForAudio.isPending}
              handleClearUrl={resetState}
            />
          </form>
        </Box>
        {getAnalysisResultsForAudio.isPending && (
          <>
            <Box
              sx={{
                m: 2,
              }}
            />
            <Box
              sx={{
                mt: 3,
              }}
            >
              <LinearProgress />
            </Box>
          </>
        )}
      </Card>
      <Box
        sx={{
          m: 3,
        }}
      />
      {getAnalysisResultsForAudio.isError && (
        <Alert severity="error">{keyword("loccus_generic_error")}</Alert>
      )}
      {result && (
        <LoccusResults
          result={result}
          isInconclusive={isInconclusive}
          url={url}
          handleClose={resetState}
          chunks={chunks}
        />
      )}
    </div>
  );
};

export default Loccus;
