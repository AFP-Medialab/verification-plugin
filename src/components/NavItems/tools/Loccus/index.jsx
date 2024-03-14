import React, { useRef, useState } from "react";
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
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  Grid,
  LinearProgress,
  Stack,
  TextField,
} from "@mui/material";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";

import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import { AudioFile } from "@mui/icons-material";

import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import LoccusResults from "./loccusResults";

import { setError } from "redux/reducers/errorReducer";
import { isValidUrl } from "../../../Shared/Utils/URLUtils";

import { v4 as uuidv4 } from "uuid";
import CloseIcon from "@mui/icons-material/Close";
import useAuthenticatedRequest from "components/Shared/Authentication/useAuthenticatedRequest";
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
  const [type, setType] = useState("");
  const [audioFile, setAudioFile] = useState(AUDIO_FILE_DEFAULT_STATE);

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
      const uid = uuidv4();

      let data = JSON.stringify({
        file: b64InputFile,
        handle: uid,
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
        sample: uid,
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
      };

      const res2 = await authenticatedRequest(config2);

      if (!res2 || !res2.data || res2.data.message) {
        //   TODO: handle error
        return;
      }

      dispatch(
        setLoccusResult({
          url: audioFile ? URL.createObjectURL(audioFile) : url,
          result: res2.data,
        }),
      );
    } catch (error) {
      console.log(error);
      handleError(error.response?.data?.message ?? error.message);
    }
  };

  const resetAudioFile = () => {
    setAudioFile(AUDIO_FILE_DEFAULT_STATE);
  };

  const handleClose = () => {
    setInput("");
    resetAudioFile();
  };

  const handleCloseSelectedFile = () => {
    setAudioFile(null);
    handleClose();
    dispatch(resetLoccusAudio());
  };

  const audioRef = useRef(null);

  const preprocessLoccusUpload = async (file) => {
    if (!(file instanceof File)) {
      dispatch(setError(keyword("error_invalid_file")));
      return Error(keyword("error_invalid_file"));
    }

    if (!file.type.includes("audio")) {
      dispatch(setError(keyword("error_invalid_media_file")));
      return Error(keyword("error_invalid_media_file"));
    }

    // TODO: Use ffmpeg to convert the m4a files if possible
    if (file.type.includes("m4a")) {
      dispatch(setError(keyword("error_invalid_audio_file")));
      return Error(keyword("error_invalid_audio_file"));
    }

    const audioURL = URL.createObjectURL(file);
    audioRef.current = new Audio(audioURL);

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
    });

    const durationInSeconds = audioBuffer.duration;

    if (durationInSeconds >= 120) {
      dispatch(setError("error"));
      return Error("Audio file duration Error");
    } else if (durationInSeconds <= 2) {
      dispatch(setError("error"));
      return Error("Audio file duration Error");
    } else {
      return file;
    }
  };

  const preprocessError = () => {
    dispatch(setError(keywordWarning("warning_file_too_big")));
  };

  const preprocessSuccess = (file) => {
    setAudioFile(file);
    setType("local");
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
            <Grid container direction="row" spacing={3} alignItems="center">
              <Grid item xs>
                <TextField
                  type="url"
                  id="standard-full-width"
                  label={keyword("loccus_link")}
                  placeholder={keyword("loccus_placeholder")}
                  fullWidth
                  value={input}
                  variant="outlined"
                  disabled={isLoading || audioFile instanceof Blob}
                  onChange={(e) => setInput(e.target.value)}
                />
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={async (e) => {
                    dispatch(resetLoccusAudio());
                    e.preventDefault();
                    await useGetVoiceCloningScore(
                      input,
                      true,
                      dispatch,
                      type,
                      audioFile,
                    );
                  }}
                  disabled={(input === "" && !audioFile) || isLoading}
                >
                  {keyword("loccus_submit_button")}
                </Button>
              </Grid>
            </Grid>
            <Grid item mt={2}>
              <ButtonGroup
                variant="outlined"
                disabled={isLoading || input !== ""}
              >
                <Button
                  startIcon={<FolderOpenIcon />}
                  sx={{ textTransform: "none" }}
                >
                  <label htmlFor="fileInputSynthetic">
                    {audioFile ? audioFile.name : keyword("button_localfile")}
                  </label>
                  <input
                    id="fileInputSynthetic"
                    type="file"
                    accept={"audio/*"}
                    hidden={true}
                    onChange={async (e) => {
                      preprocessFileUpload(
                        e.target.files[0],
                        role,
                        await preprocessLoccusUpload(e.target.files[0]),
                        preprocessSuccess,
                        preprocessError,
                      );
                      e.target.value = null;
                    }}
                  />
                </Button>
                {audioFile instanceof Blob && (
                  <Button
                    size="small"
                    aria-label="remove selected file"
                    onClick={handleCloseSelectedFile}
                  >
                    <CloseIcon fontSize="small" />
                  </Button>
                )}
              </ButtonGroup>
            </Grid>
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
        <LoccusResults result={result} url={url} handleClose={handleClose} />
      )}
    </div>
  );
};

export default Loccus;
