import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";
import Stack from "@mui/material/Stack";

import { getclientId } from "@Shared/GoogleAnalytics/MatomoAnalytics";
import { isValidUrl } from "@Shared/Utils/URLUtils";
import {
  getFileTypeFromFileObject,
  getFileTypeFromUrl,
} from "@Shared/Utils/fileUtils";
import { parseMetadata } from "@uswriting/exiftool";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import StringFileUploadField from "components/Shared/StringFileUploadField";
import exifr from "exifr";

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

const Metadata = () => {
  const { url, type } = useParams();
  const location = useLocation();

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
  const [imageUrl, setImageurl] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [urlDetected, setUrlDetected] = useState(false);
  const [error, setError] = useState(false);

  const [imageMetadata, setImageMetadata] = useState(
    resultData ? resultData : null,
  );

  const exifrOptions = {
    exif: true,
    gps: true,
    iptc: true,
    jfif: true,
    tiff: true,
    mergeOutput: false,
  };

  const extractVideoMetadata = async (url) => {
    if (!isValidUrl(url)) {
      throw new Error("Invalid URL");
    }

    // Fetch the video
    const response = await fetch(url, {
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const blob = await response.blob();

    // Parse the metadata
    const jsonMetadata = await parseMetadata(
      new File([blob], "video-file", {
        type: blob.type,
      }),
      {
        args: ["-a", "-g1", "-json", "-n"],
        transform: (data) => JSON.parse(data),
      },
    );

    if (!jsonMetadata.success) {
      throw new Error("No metadata found.");
    }

    return jsonMetadata.data[0];
  };

  const getVideoMetadata = useMutation({
    mutationFn: (url) => {
      return extractVideoMetadata(url);
    },
    onSuccess: (data) => {
      setMetadataResult(data);
    },
  });

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

  async function getImageMetadataFromUrl(url) {
    try {
      // Validate the URL format
      if (!url || typeof url !== "string" || !/^https?:\/\//.test(url)) {
        return new Error("Invalid URL provided");
      }

      // Fetch the image
      const response = await fetch(url);

      // Check for a successful response
      if (!response.ok) {
        return new Error(
          `Failed to fetch image: ${response.status} ${response.statusText}`,
        );
      }

      // Check if the content-type is an image
      const contentType = response.headers.get("Content-Type");
      if (!contentType || !contentType.startsWith("image/")) {
        return new Error("The provided URL is not an image");
      }

      // Convert response to a Blob
      const blob = await response.blob();

      // Extract metadata using exifr
      const metadata = await exifr.parse(blob, exifrOptions);

      // Handle missing metadata
      if (!metadata) {
        return new Error("No EXIF metadata found in the image");
      }

      return metadata;
    } catch (error) {
      console.error("Error extracting metadata:", error.message);
      return null; // Return null instead of throwing to prevent app crashes
    }
  }

  const submitUrl = async () => {
    // Reset state
    cleanMetadataState();
    getVideoMetadata.reset();
    setImageMetadata(null);
    setError(false);

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
        setImageurl(imageUrl);

        // Extract metadata
        const metadata = input
          ? await getImageMetadataFromUrl(input)
          : await exifr.parse(fileInput, exifrOptions);

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

      // if (fileType.mime.includes("video")) {
      //   setVideoUrl(input || URL.createObjectURL(fileInput));
      //   return;
      // }

      throw new Error("Unsupported file type");
    } catch (error) {
      console.error("Error in submitUrl:", error.message);
      setError(error.message);
    }
  };

  useEffect(() => {
    setImageurl(null);
  }, [imageUrl]);

  useEffect(() => {
    // roundabout hack :: fix requires amending actions/reducer so a new state object is returned
    if (urlDetected) {
      submitUrl();
    }
  }, [urlDetected]);

  const [initTool, setInitTool] = useState(true);

  const dispatch = useDispatch();

  if (initTool) {
    if (location.state != null) {
      if (location.state.media === "image") {
        dispatch(setMetadataMediaType("image"));
      } else if (location.state.media === "video") {
        dispatch(setMetadataMediaType("video"));
      }
    } else {
      // console.log(mediaType);
    }
    setInitTool(false);
  }

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

      {getVideoMetadata.isSuccess && videoUrl && (
        <MetadataVideoResult
          metadata={getVideoMetadata.data}
          videoSrc={videoUrl}
          handleClose={handleCloseResult}
        />
      )}

      {resultData ? (
        resultIsImage ? (
          <MetadataImageResult
            result={resultData}
            metadata={imageMetadata}
            closeResult={handleCloseResult}
            imageSrc={resultUrl}
          />
        ) : (
          <MetadataVideoResult
            result={resultData}
            closeResult={handleCloseResult}
          />
        )
      ) : null}
    </Box>
  );
};
export default Metadata;
