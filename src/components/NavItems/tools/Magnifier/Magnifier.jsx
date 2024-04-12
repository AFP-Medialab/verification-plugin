import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box, Card, CardHeader, LinearProgress } from "@mui/material";

import "tui-image-editor/dist/tui-image-editor.css";
import ImageResult from "./Results/ImageResult";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import { useParams } from "react-router-dom";
import {
  resetMagnifierState,
  setMagnifierLoading,
  setMagnifierResult,
} from "../../../../redux/actions/tools/magnifierActions";
import { setError } from "redux/reducers/errorReducer";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { getclientId } from "../../../Shared/GoogleAnalytics/MatomoAnalytics";
import { useTrackEvent } from "../../../../Hooks/useAnalytics";
import { KNOWN_LINKS } from "../../Assistant/AssistantRuleBook";

import MagnifierIcon from "../../../NavBar/images/SVG/Image/Magnifier.svg";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import StringFileUploadField from "../../../Shared/StringFileUploadField";

const Magnifier = () => {
  const { url } = useParams();
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Magnifier");
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );

  const resultUrl = useSelector((state) => state.magnifier.url);
  const magnifierResult = useSelector((state) => state.magnifier.result);
  const session = useSelector((state) => state.userSession);
  const isLoading = useSelector((state) => state.magnifier.loading);
  const uid = session && session.user ? session.user.id : null;
  const dispatch = useDispatch();

  const [input, setInput] = useState(resultUrl);

  const [imageFile, setImageFile] = useState(undefined);

  const getErrorText = () => {
    return keyword("please_give_a_correct_link");
  };
  const [eventUrl, setEventUrl] = useState(undefined);
  const client_id = getclientId();
  useTrackEvent(
    "submission",
    "magnifier",
    "image magnifier caa analysis",
    eventUrl,
    client_id,
    eventUrl,
    uid,
  );
  const submitUrl = (src) => {
    dispatch(setMagnifierLoading(true));

    const fileUrl = imageFile ? URL.createObjectURL(imageFile) : src;

    setEventUrl(fileUrl);

    let img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      let canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d").drawImage(img, 0, 0);

      // Get raw image data
      dispatch(
        setMagnifierResult({
          url: fileUrl,
          result: canvas.toDataURL("image/png"),
          notification: false,
          loading: false,
        }),
      );
      canvas.remove();
    };
    img.onerror = () => {
      dispatch(setError(getErrorText()));
    };
    img.src = fileUrl;

    dispatch(setMagnifierLoading(false));
  };

  useEffect(() => {
    if (url) {
      if (url !== KNOWN_LINKS.OWN) {
        const uri = url !== null ? decodeURIComponent(url) : undefined;
        dispatch(setMagnifierLoading(true));
        setInput(uri);
        submitUrl(uri);
      }
    }
  }, [url]);

  const preprocessImage = (file) => {
    setImageFile(file);
    return file;
  };

  const handleCloseSelectedFile = () => {
    setImageFile(undefined);
    setInput("");
    dispatch(resetMagnifierState());
  };

  return (
    <div>
      <HeaderTool
        name={keywordAllTools("navbar_magnifier")}
        description={keywordAllTools("navbar_magnifier_description")}
        icon={
          <MagnifierIcon
            style={{ fill: "#00926c" }}
            width="40px"
            height="40px"
          />
        }
      />

      <Card>
        <CardHeader
          title={keyword("cardheader_source")}
          className={classes.headerUploadedImage}
        />

        <Box p={3}>
          <form>
            <StringFileUploadField
              labelKeyword={keyword("magnifier_urlbox")}
              placeholderKeyword={keyword("magnifier_urlbox_placeholder")}
              submitButtonKeyword={keyword("button_submit")}
              localFileKeyword={keyword("button_localfile")}
              urlInput={input}
              setUrlInput={setInput}
              fileInput={imageFile}
              setFileInput={setImageFile}
              handleSubmit={submitUrl}
              fileInputTypesAccepted={"image/*"}
              handleCloseSelectedFile={handleCloseSelectedFile}
              preprocessLocalFile={preprocessImage}
            />
          </form>

          {isLoading && (
            <Box mt={3}>
              <LinearProgress />
            </Box>
          )}
        </Box>
      </Card>

      <Box m={3} />

      {magnifierResult && (
        <ImageResult handleCloseResults={handleCloseSelectedFile} />
      )}
    </div>
  );
};
export default Magnifier;
