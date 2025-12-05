import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import LinearProgress from "@mui/material/LinearProgress";

import { useTrackEvent } from "@/Hooks/useAnalytics";
import { imageMagnifier } from "@/constants/tools";
import { KNOWN_LINKS } from "@/constants/tools";
import {
  resetMagnifierState,
  setMagnifierLoading,
  setMagnifierResult,
} from "@/redux/actions/tools/magnifierActions";
import { setError } from "@/redux/reducers/errorReducer";
import { getclientId } from "@Shared/GoogleAnalytics/MatomoAnalytics";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";

import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import StringFileUploadField from "../../../Shared/StringFileUploadField";
import ImageResult from "./Results/ImageResult";

const Magnifier = () => {
  const { url } = useParams();
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

  const processUrl = useSelector((state) => state.assistant.processUrl);
  useEffect(() => {
    if (processUrl && url?.includes("autoRun")) {
      setInput(processUrl);
      submitUrl(processUrl);
    }
  }, [processUrl, url]);

  const preprocessImage = (file) => {
    setImageFile(file);
    return file;
  };

  const resetState = () => {
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
          <imageMagnifier.icon
            sx={{
              fill: "var(--mui-palette-primary-main)",
              fontSize: "40px",
            }}
          />
        }
      />
      <Card variant="outlined">
        <Box
          sx={{
            p: 4,
          }}
        >
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
              handleCloseSelectedFile={resetState}
              preprocessLocalFile={preprocessImage}
              handleClearUrl={resetState}
            />
          </form>

          {isLoading && (
            <Box
              sx={{
                mt: 3,
              }}
            >
              <LinearProgress />
            </Box>
          )}
        </Box>
      </Card>
      <Box
        sx={{
          m: 3,
        }}
      />
      {magnifierResult && <ImageResult handleCloseResults={resetState} />}
    </div>
  );
};
export default Magnifier;
