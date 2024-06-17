import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetLoccusAudio,
  setLoccusLoading,
  setLoccusResult,
} from "../../../../redux/actions/tools/loccusActions";

import axios from "axios";
import {
  Alert,
  Box,
  Card,
  CardHeader,
  Grid,
  LinearProgress,
  Stack,
} from "@mui/material";

import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import { AudioFile } from "@mui/icons-material";

import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import LoccusResults from "./loccusResults";

import { setError } from "redux/reducers/errorReducer";
import { isValidUrl } from "../../../Shared/Utils/URLUtils";

import useAuthenticatedRequest from "components/Shared/Authentication/useAuthenticatedRequest";
import StringFileUploadField from "../../../Shared/StringFileUploadField";
import { preprocessFileUpload } from "../../../Shared/Utils/fileUtils";

const Loccus = () => {
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Loccus");
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );
  const keywordWarning = i18nLoadNamespace("components/Shared/OnWarningInfo");

  const AUDIO_FILE_DEFAULT_STATE = undefined;

  const role = useSelector((state) => state.userSession.user.roles);
  const isLoading = useSelector(
    (state) => state.syntheticAudioDetection.loading,
  );
  const result = useSelector((state) => state.syntheticAudioDetection.result);
  const url = useSelector((state) => state.syntheticAudioDetection.url);
  const authenticatedRequest = useAuthenticatedRequest();
  const [input, setInput] = useState(url ? url : "");
  const [audioFile, setAudioFile] = useState(AUDIO_FILE_DEFAULT_STATE);

  const [chunks, setChunks] = useState([]);

  const dispatch = useDispatch();

  const useGetVoiceCloningScore = async (url, processURL, dispatch) => {
    if (!processURL && !url && !audioFile) {
      return;
    }

    const blobToDataUrl = (blob) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

    const blobToBase64 = async (blob) => {
      const text = await blobToDataUrl(blob);
      return text.slice(text.indexOf(",") + 1);
    };

    let blob;

    if (isValidUrl(url) && !audioFile) {
      try {
        blob = (await axios.get(url, { responseType: "blob" })).data ?? null;
      } catch (e) {
        //TODO: Handle Error
        console.log(e);
      }
    }

    const b64InputFile = blob
      ? decodeURIComponent(await blobToBase64(blob))
      : await blobToBase64(audioFile);

    dispatch(setLoccusLoading(true));

    const handleError = (e) => {
      dispatch(setError(e));
      dispatch(setLoccusLoading(false));
    };

    let res;

    try {
      // unique identifier for the file to process
      // TODO: provide a view on previous file uploads by the user

      let data = JSON.stringify({
        file: b64InputFile,
        alias: "test",
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        //samples
        url: process.env.REACT_APP_LOCCUS_URL + "/upload",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: data,
        timeout: 60000,
        signal: AbortSignal.timeout(60000),
      };

      // First, we upload the file to Loccus
      res = await authenticatedRequest(config);

      if (!res || !res.data || res.data.message) {
        //   TODO: handle error
        return;
      }

      if (!res.data.state || res.data.state !== "available") {
        //   TODO: Handle Error
        return;
      }

      // Second, we perform the Loccus authenticity verification

      const data2 = JSON.stringify({
        model: "default",
        sample: res.data.handle,
      });

      const config2 = {
        method: "post",
        maxBodyLength: Infinity,
        ///verifications/authenticity
        url: process.env.REACT_APP_LOCCUS_URL + "/detection",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: data2,
        timeout: 180000,
        signal: AbortSignal.timeout(180000),
      };

      const res2 = await authenticatedRequest(config2);

      if (!res2 || !res2.data || res2.data.message) {
        //   TODO: handle error
        return;
      }

      const config3 = {
        method: "get",
        maxBodyLength: Infinity,
        ///verifications/authenticity
        url:
          process.env.REACT_APP_LOCCUS_URL +
          `/detection/${res2.data.handle}/chunks?page-size=1000`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: data2,
        timeout: 180000,
        signal: AbortSignal.timeout(180000),
      };

      const res3 = await authenticatedRequest(config3);

      setChunks(res3.data);

      dispatch(
        setLoccusResult({
          url: audioFile ? URL.createObjectURL(audioFile) : url,
          result: res2.data,
        }),
      );
    } catch (error) {
      console.log(error);
      if (error.message.includes("canceled")) {
        handleError(keyword("loccus_error_timeout"));
      } else {
        handleError(error.response?.data?.message ?? error.message);
      }
    }
  };

  const handleClose = () => {
    setInput("");
    setAudioFile(AUDIO_FILE_DEFAULT_STATE);
    dispatch(resetLoccusAudio());
  };

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
      (file.type.includes("m4a") ||
        file.type.includes("basic") ||
        file.type.includes("aiff"))
    ) {
      dispatch(setError(keyword("error_invalid_audio_file")));

      handleClose();

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
          (buffer) => {
            resolve(buffer);
          },
          (error) => {
            reject(error);
          },
        );
      };
    }).catch((error) => {
      console.log(error);
      dispatch(setError(keyword("loccus_error_unable_to_read_file")));
      return Error(error);
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

  const handleSubmit = async () => {
    dispatch(resetLoccusAudio());
    await useGetVoiceCloningScore(input, true, dispatch);
  };

  return (
    <div>
      <HeaderTool
        name={keywordAllTools("navbar_loccus")}
        description={keywordAllTools("navbar_loccus_description")}
        icon={
          <AudioFile
            style={{ fill: "#00926c", height: "75px", width: "auto" }}
          />
        }
      />
      <Stack direction={"column"} spacing={2}>
        <Alert severity="warning">
          {keywordWarning("warning_beta_loccus")}
        </Alert>
        <Alert severity="info">{keyword("loccus_tip")}</Alert>
      </Stack>

      <Box m={3} />

      <Card>
        <CardHeader
          title={
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <span>{keyword("loccus_link")}</span>
            </Grid>
          }
          className={classes.headerUploadedAudio}
        />

        <Box p={3}>
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
              handleCloseSelectedFile={handleClose}
              preprocessLocalFile={preprocessLocalFile}
            />
          </form>
          <Box m={2} />
          {isLoading && (
            <Box mt={3}>
              <LinearProgress />
            </Box>
          )}
        </Box>
      </Card>

      <Box m={3} />

      {result && (
        <LoccusResults
          result={result}
          url={url}
          handleClose={handleClose}
          chunks={chunks}
        />
      )}
    </div>
  );
};

export default Loccus;
