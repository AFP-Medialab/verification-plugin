import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  detectHiyaAudioAuthenticity,
  getHiyaDetectionChunks,
  uploadHiyaAudio,
} from "@/components/NavItems/tools/Hiya/api";
import {
  resetHiyaAudio,
  setHiyaLoading,
  setHiyaResult,
} from "@/redux/actions/tools/hiyaActions";
import { isValidUrl } from "@Shared/Utils/URLUtils";
import { blobToBase64, preprocessFileUpload } from "@Shared/Utils/fileUtils";
import axios from "axios";
import useAuthenticatedRequest from "components/Shared/Authentication/useAuthenticatedRequest";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { setError } from "redux/reducers/errorReducer";

/**
 * Custom hook for Hiya audio analysis functionality
 * Provides all the logic for audio file processing, validation, and analysis
 *
 * @returns {Object} Hook object containing analysis functions, state, and handlers
 * @property {Function} getAnalysisResultsForAudio - React Query mutation for audio analysis
 * @property {Function} handleSubmit - Submits audio for analysis
 * @property {Function} resetState - Resets component state to defaults
 * @property {Function} preprocessLocalFile - Validates and processes local audio files
 * @property {string} input - Current URL input value
 * @property {Function} setInput - Setter for URL input
 * @property {File|undefined} audioFile - Currently selected audio file
 * @property {Function} setAudioFile - Setter for audio file
 * @property {Function} preprocessSuccess - Success callback for file preprocessing
 * @property {Function} preprocessError - Error callback for file preprocessing
 *
 * @example
 * ```javascript
 * const {
 *   getAnalysisResultsForAudio,
 *   handleSubmit,
 *   resetState,
 *   preprocessLocalFile,
 *   input,
 *   setInput,
 *   audioFile,
 *   setAudioFile,
 *   preprocessSuccess,
 *   preprocessError
 * } = useHiyaAudioAnalysis();
 * ```
 */
export const useHiyaAudioAnalysis = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Hiya");
  const keywordWarning = i18nLoadNamespace("components/Shared/OnWarningInfo");

  const AUDIO_FILE_DEFAULT_STATE = undefined;

  const role = useSelector((state) => state.userSession.user.roles);
  const url = useSelector((state) => state.syntheticAudioDetection.url);
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
   * Handles the complete workflow: URL fetching, upload, detection, and chunk analysis
   *
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
      dispatchAction(setHiyaLoading(false));
    };

    try {
      const uploadResponse = await uploadHiyaAudio(
        base64EncodedFile,
        authenticatedRequest,
      );

      const detectionResponse = await detectHiyaAudioAuthenticity(
        uploadResponse.data.handle,
        authenticatedRequest,
      );

      const chunks = await getHiyaDetectionChunks(
        detectionResponse.data.handle,
        authenticatedRequest,
      );

      const isAnalysisInconclusive = isResultInconclusive(chunks.data);

      dispatchAction(
        setHiyaResult({
          url: audioFile ? URL.createObjectURL(audioFile) : audioUrl,
          result: detectionResponse.data,
          chunks: chunks.data,
          isInconclusive: isAnalysisInconclusive,
        }),
      );
    } catch (error) {
      console.log(error);
      if (error.message.includes("canceled")) {
        handleError(keyword("hiya_error_timeout"));
        throw new Error(keyword("hiya_error_timeout"));
      } else {
        handleError(error.response?.data?.message ?? error.message);
        throw new Error(error.response?.data?.message ?? error.message);
      }
    }
  };

  /**
   * Preprocesses and validates an audio file before upload to Hiya
   * Checks file type, browser compatibility, duration limits, and audio format
   *
   * @param {File} file - The audio file to validate
   * @returns {Promise<File|Error>} The validated file or an error
   */
  const preprocessHiyaUpload = async (file) => {
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
      dispatch(setError(keyword("hiya_error_unable_to_read_file")));
      return new Error(error);
    });

    if (!(audioBuffer instanceof AudioBuffer)) {
      return audioBuffer;
    }

    const durationInSeconds = audioBuffer.duration;

    if (durationInSeconds >= 300) {
      dispatch(setError(keyword("hiya_tip")));
      return Error(keyword("hiya_tip"));
    } else if (durationInSeconds <= 2) {
      dispatch(setError(keyword("hiya_tip")));
      return Error(keyword("hiya_tip"));
    } else {
      return file;
    }
  };

  /**
   * React Query mutation for audio analysis
   * Wraps the voice cloning score analysis in a mutation for loading states and error handling
   */
  const getAnalysisResultsForAudio = useMutation({
    mutationFn: () => {
      return useGetVoiceCloningScore(input, true, dispatch);
    },
  });

  /**
   * Resets the component state to default values
   * Clears input, file selection, and Redux state
   */
  const resetState = () => {
    getAnalysisResultsForAudio.reset();
    setInput("");
    setAudioFile(AUDIO_FILE_DEFAULT_STATE);
    dispatch(resetHiyaAudio());
  };

  /**
   * Error callback for file preprocessing
   * Dispatches error when file is too large or invalid
   */
  const preprocessError = () => {
    dispatch(setError(keywordWarning("warning_file_too_big")));
  };

  /**
   * Success callback for file preprocessing
   * Sets the validated audio file in state
   *
   * @param {File} file - The successfully validated audio file
   */
  const preprocessSuccess = (file) => {
    setAudioFile(file);
  };

  /**
   * Processes a locally selected file through validation pipeline
   * Combines role-based validation with Hiya-specific audio validation
   *
   * @param {File} fileSelected - The file selected by the user
   * @returns {Promise} Result of the preprocessing pipeline
   */
  const preprocessLocalFile = async (fileSelected) => {
    return preprocessFileUpload(
      fileSelected,
      role,
      await preprocessHiyaUpload(fileSelected),
      preprocessSuccess,
      preprocessError,
    );
  };

  /**
   * Handles form submission for audio analysis
   * Resets previous results and triggers new analysis
   */
  const handleSubmit = async () => {
    dispatch(resetHiyaAudio());
    await getAnalysisResultsForAudio.mutate();
  };

  return {
    getAnalysisResultsForAudio,
    handleSubmit,
    resetState,
    preprocessLocalFile,
    input,
    setInput,
    audioFile,
    setAudioFile,
    preprocessSuccess,
    preprocessError,
  };
};
