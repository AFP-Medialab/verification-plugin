import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";
import Stack from "@mui/material/Stack";

import { getclientId } from "@Shared/GoogleAnalytics/MatomoAnalytics";
import {
  getFileTypeFromFileObject,
  getFileTypeFromUrl,
} from "@Shared/Utils/fileUtils";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import StringFileUploadField from "components/Shared/StringFileUploadField";

import { useTrackEvent } from "../../../../Hooks/useAnalytics";
import { imageMetadata as imageMetadataTool } from "../../../../constants/tools";
import {
  cleanMetadataState,
  setMetadataMediaType,
  setMetadataResult,
} from "../../../../redux/reducers/tools/metadataReducer";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import { KNOWN_LINKS } from "../../Assistant/AssistantRuleBook";
import MetadataImageResult from "./Results/MetadataImageResult";
import MetadataVideoResult from "./Results/MetadataVideoResult";
import {
  getImageMetadataFromFile,
  getImageMetadataFromUrl,
} from "./api/imageMetadataApi";
import { useVideoMetadataMutation } from "./hooks/useVideoMetadataMutation";

const Metadata = () => {
  const { url, type } = useParams();

  const keyword = i18nLoadNamespace("components/NavItems/tools/Metadata");

  const keywordTip = i18nLoadNamespace("components/Shared/OnClickInfo");

  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );

  const resultUrl = useSelector((state) => state.metadata.url);
  const resultData = useSelector((state) => state.metadata.result);
  const resultIsImage = useSelector((state) => state.metadata.isImage);
  const session = useSelector((state) => state.userSession);
  const uid = session && session.user ? session.user.id : null;

  const [input, setInput] = useState(resultUrl ? resultUrl : "");
  const [fileInput, setFileInput] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [urlDetected, setUrlDetected] = useState(false);
  const [error, setError] = useState(false);

  const [imageMetadata, setImageMetadata] = useState(
    resultData ? resultData : null,
  );

  const client_id = getclientId();
  useTrackEvent(
    "submission",
    "metadata",
    "extract metadata",
    input,
    client_id,
    imageUrl,
    uid,
  );
  useTrackEvent(
    "submission",
    "metadata",
    "extract metadata",
    input,
    client_id,
    videoUrl,
    uid,
  );

  const getVideoMetadata = useVideoMetadataMutation({
    onSuccess: (data) => {
      dispatch(
        setMetadataResult({
          url: videoUrl,
          result: data instanceof Error ? null : data,
          notification: false,
          loading: false,
          isImage: false,
        }),
      );
    },
  });

  const resetMetadataState = () => {
    dispatch(cleanMetadataState());
    getVideoMetadata.reset();
    setImageMetadata(null);
    setError(false);
    setImageUrl(null);
  };

  const submitUrl = async () => {
    resetMetadataState();

    try {
      if (!input && !fileInput) {
        throw new Error("No input provided"); // Handle missing input
      }

      // Determine file type
      const fileType = input
        ? await getFileTypeFromUrl(input)
        : await getFileTypeFromFileObject(fileInput);

      if (!fileType || fileType instanceof Error) {
        throw new Error("Unable to determine file type");
      }

      if (fileType.mime.includes("video")) {
        const video = input || URL.createObjectURL(fileInput);

        setVideoUrl(video);
        getVideoMetadata.mutate(video);
        return;
      }

      if (fileType.mime.includes("image")) {
        // Set the image URL
        const imageUrl = input || URL.createObjectURL(fileInput);
        setImageUrl(imageUrl);

        // Extract metadata
        const metadata = input
          ? await getImageMetadataFromUrl(input)
          : await getImageMetadataFromFile(fileInput);

        setImageMetadata(metadata instanceof Error ? null : metadata);

        dispatch(
          setMetadataResult({
            url: imageUrl,
            result: metadata instanceof Error ? null : metadata,
            notification: false,
            loading: false,
            isImage: true,
          }),
        );

        return;
      }

      throw new Error("Unsupported file type");
    } catch (error) {
      console.error("Error in submitUrl:", error.message);
      setError(error.message);
    }
  };

  useEffect(() => {
    setImageUrl(null);
  }, [imageUrl]);

  useEffect(() => {
    // roundabout hack :: fix requires amending actions/reducer so a new state object is returned
    if (urlDetected) {
      submitUrl();
    }
  }, [urlDetected]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (url && url !== KNOWN_LINKS.OWN) {
      let uri = decodeURIComponent(url);
      setInput(uri);
      setUrlDetected(true);
    }
  }, [url, type]);

  const processUrl = useSelector((state) => state.assistant.processUrl);
  const processUrlType = useSelector((state) => state.assistant.processUrlType);
  useEffect(() => {
    if (processUrl) {
      setInput(processUrl);
      dispatch(setMetadataMediaType(processUrlType));
      setUrlDetected(true);
    }
  }, [processUrl]);

  const handleCloseResult = () => {
    setInput("");
  };

  const handleCloseFile = () => {
    setFileInput(null);
    resetMetadataState();
  };

  return (
    <Box>
      <HeaderTool
        name={keywordAllTools("navbar_metadata")}
        description={keywordAllTools("navbar_metadata_description")}
        icon={
          <imageMetadataTool.icon
            sx={{
              fill: "#00926c",
              fontSize: "40px",
            }}
          />
        }
      />
      <Stack direction={"column"} spacing={2}>
        <Alert severity="info">{keyword("description_limitations")}</Alert>
        <Alert severity="info">{keywordTip("metadata_tip")}</Alert>
      </Stack>

      <Box m={4} />

      <Card variant="outlined">
        <form>
          <Box p={4}>
            <StringFileUploadField
              labelKeyword={keyword("metadata_content_input")}
              placeholderKeyword={keyword("metadata_content_input_placeholder")}
              submitButtonKeyword={keyword("button_submit")}
              localFileKeyword={keyword("button_localfile")}
              urlInput={input}
              setUrlInput={setInput}
              fileInput={fileInput}
              setFileInput={setFileInput}
              handleSubmit={submitUrl}
              fileInputTypesAccepted={"image/*, video/*"}
              handleCloseSelectedFile={handleCloseFile}
            />
          </Box>
        </form>
      </Card>
      <Box m={4} />

      {error && <Alert severity="error">{error}</Alert>}

      {getVideoMetadata.isPending && (
        <Fade in={getVideoMetadata.isPending} timeout={750}>
          <Alert icon={<CircularProgress size={20} />} severity="info">
            {"Loading..."}
          </Alert>
        </Fade>
      )}

      {getVideoMetadata.isError && (
        <Alert severity="error">{keyword("metadata_generic_error")}</Alert>
      )}

      {resultData && !resultIsImage && resultUrl && (
        <MetadataVideoResult metadata={resultData} videoSrc={resultUrl} />
      )}

      {resultData && resultIsImage && (
        <MetadataImageResult
          result={resultData}
          metadata={imageMetadata}
          closeResult={handleCloseResult}
          imageSrc={resultUrl}
        />
      )}
    </Box>
  );
};
export default Metadata;
