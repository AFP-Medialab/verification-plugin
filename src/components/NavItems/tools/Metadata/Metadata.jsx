import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";
import Stack from "@mui/material/Stack";

import { useTrackEvent } from "@/Hooks/useAnalytics";
import C2paResults from "@/components/NavItems/tools/C2pa/Results/C2paResults";
import { useC2paMetadataMutation } from "@/components/NavItems/tools/Metadata/hooks/useC2paMetadataMutation";
import { KNOWN_LINKS } from "@/constants/tools";
import {
  cleanMetadataState,
  setC2paMetadataResult,
  setCurrentC2paImageId,
  setMetadataMediaType,
  setMetadataResult,
} from "@/redux/reducers/tools/metadataReducer";
import useAuthenticatedRequest from "@Shared/Authentication/useAuthenticatedRequest";
import { getclientId } from "@Shared/GoogleAnalytics/MatomoAnalytics";
import {
  getFileTypeFromFileObject,
  getFileTypeFromUrl,
} from "@Shared/Utils/fileUtils";
import { useUrlOrFile } from "Hooks/useUrlOrFile";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import StringFileUploadField from "components/Shared/StringFileUploadField";

import { imageMetadata as imageMetadataTool } from "../../../../constants/tools";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import MetadataImageResult from "./Results/MetadataImageResult";
import MetadataVideoResult from "./Results/MetadataVideoResult";
import {
  getImageMetadataFromFile,
  getImageMetadataFromUrl,
} from "./api/imageMetadataApi";
import { useVideoMetadataMutation } from "./hooks/useVideoMetadataMutation";

const Metadata = () => {
  const { url, type } = useParams();
  const [searchParams] = useSearchParams();

  const keyword = i18nLoadNamespace("components/NavItems/tools/Metadata");

  const keywordTip = i18nLoadNamespace("components/Shared/OnClickInfo");

  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );

  const resultUrl = useSelector((state) => state.metadata.url);
  const resultData = useSelector((state) => state.metadata.result);
  const resultIsImage = useSelector((state) => state.metadata.isImage);
  const c2paResults = useSelector((state) => state.metadata.c2pa);
  const currentC2paImageSelected = useSelector(
    (state) => state.metadata.currentC2paImageId,
  );

  const session = useSelector((state) => state.userSession);
  const uid = session && session.user ? session.user.id : null;

  const [input = resultUrl || "", setInput, fileInput, setFileInput] =
    useUrlOrFile();
  const [imageUrl, setImageUrl] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [urlDetected, setUrlDetected] = useState(false);
  const [error, setError] = useState(false);

  const [imageMetadata, setImageMetadata] = useState(
    resultData ? resultData : null,
  );

  const authenticatedRequest = useAuthenticatedRequest();

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

  const getC2paMetadata = useC2paMetadataMutation({
    onSuccess: (data) => {
      dispatch(setCurrentC2paImageId(data.currentImageId));

      dispatch(
        setC2paMetadataResult({
          c2pa: data instanceof Error ? null : data,
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
        getC2paMetadata.mutate(video);
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

        const hdImageConfig = {
          method: "get",
          responseType: "blob",
          maxBodyLength: Infinity,
          url: input || URL.createObjectURL(fileInput),
        };

        const blob = (await authenticatedRequest(hdImageConfig)).data;

        await getC2paMetadata.mutateAsync(URL.createObjectURL(blob));

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

  useEffect(() => {
    const fromAssistant = searchParams.has("fromAssistant");
    if (fromAssistant && (input || fileInput)) {
      submitUrl();
    }
  }, [searchParams]);

  const handleCloseResult = () => {
    setInput("");
  };

  const resetState = () => {
    setInput("");
    setFileInput(null);
    resetMetadataState();
  };

  return (
    <Stack direction="column" spacing={4}>
      <Stack direction={"column"} spacing={2}>
        <HeaderTool
          name={keywordAllTools("navbar_metadata")}
          description={keywordAllTools("navbar_metadata_description")}
          icon={
            <imageMetadataTool.icon
              sx={{
                fill: "var(--mui-palette-primary-main)",
                fontSize: "40px",
              }}
            />
          }
        />
        <Alert severity="info">{keyword("description_limitations")}</Alert>
        <Alert severity="info">{keywordTip("metadata_tip")}</Alert>
      </Stack>

      <Card variant="outlined">
        <form>
          <Box
            sx={{
              p: 4,
            }}
          >
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
              handleCloseSelectedFile={resetState}
              handleClearUrl={resetState}
            />
          </Box>
        </form>
      </Card>
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
      {c2paResults && c2paResults.result && (
        <Card variant="outlined">
          <C2paResults
            result={c2paResults.result}
            hasSimilarAfpResult={false}
            currentImage={currentC2paImageSelected}
            mainImage={c2paResults.mainImageId}
            setCurrentImageId={setCurrentC2paImageId}
            variant={"metadata"}
          />
        </Card>
      )}
    </Stack>
  );
};
export default Metadata;
