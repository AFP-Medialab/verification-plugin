import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";

import { getclientId } from "@Shared/GoogleAnalytics/MatomoAnalytics";
import {
  getFileTypeFromFile,
  getFileTypeFromUrl,
} from "@Shared/Utils/fileUtils";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import StringFileUploadField from "components/Shared/StringFileUploadField";
import exifr from "exifr";

import { useTrackEvent } from "../../../../Hooks/useAnalytics";
import { imageMetadata as imageMetadataTool } from "../../../../constants/tools";
import { setMetadataMediaType } from "../../../../redux/reducers/tools/metadataReducer";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import { CONTENT_TYPE, KNOWN_LINKS } from "../../Assistant/AssistantRuleBook";
import useImageTreatment from "./Hooks/useImageTreatment";
import useVideoTreatment from "./Hooks/useVideoTreatment";
import MetadataImageResult from "./Results/MetadataImageResult";
import MetadataVideoResult from "./Results/MetadataVideoResult";

const Metadata = ({ mediaType }) => {
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

  const [radioImage, setRadioImage] = useState(mediaType !== "video");
  const [input, setInput] = useState(resultUrl ? resultUrl : "");
  const [fileInput, setFileInput] = useState(null);
  const [imageUrl, setImageurl] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [urlDetected, setUrlDetected] = useState(false);

  const [imageMetadata, setImageMetadata] = useState(null);
  const exifrOptions = {
    exif: true,
    gps: true,
    iptc: true,
    jfif: true,
    tiff: true,
    mergeOutput: false,
  };

  useVideoTreatment(videoUrl, keyword);
  useImageTreatment(imageUrl, keyword);

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
  const submitUrl = async () => {
    if (input) {
      console.log(getFileTypeFromUrl(input));

      if (radioImage) {
        setImageurl(input);
        // const metadata = await exifr.parse(input, exifrOptions);
        // setImageMetadata(metadata);
      } else {
        setVideoUrl(input);
      }
    } else if (fileInput) {
      console.log(getFileTypeFromFile(fileInput));

      if (radioImage) {
        setImageurl(URL.createObjectURL(fileInput));
        const metadata = await exifr.parse(fileInput, exifrOptions);
        setImageMetadata(metadata);
      } else {
        setVideoUrl(URL.createObjectURL(fileInput));
      }
    }
  };

  useEffect(() => {
    setVideoUrl(null);
  }, [videoUrl]);

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
        setRadioImage(true);
      } else if (location.state.media === "video") {
        dispatch(setMetadataMediaType("video"));
        setRadioImage(false);
      }
    } else {
      // console.log(mediaType);
    }
    setInitTool(false);
  }

  useEffect(() => {
    if (type) {
      let content_type = decodeURIComponent(type);
      if (content_type === CONTENT_TYPE.VIDEO) {
        setRadioImage(false);
      } else if (content_type === CONTENT_TYPE.IMAGE) {
        setRadioImage(true);
      }
    }

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
      setRadioImage(processUrlType === "image");
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
        <Box p={4}>
          <RadioGroup
            aria-label="position"
            name="position"
            value={radioImage}
            onChange={() => setRadioImage(!radioImage)}
            row
          >
            <FormControlLabel
              value={true}
              control={<Radio color="primary" />}
              label={keyword("metadata_radio_image")}
              labelPlacement="end"
            />
            <FormControlLabel
              value={false}
              control={<Radio color="primary" />}
              label={keyword("metadata_radio_video")}
              labelPlacement="end"
            />
          </RadioGroup>

          <Box m={2} />

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
      </Card>
      <Box m={4} />
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
