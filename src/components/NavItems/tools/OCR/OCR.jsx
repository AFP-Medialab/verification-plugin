import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";

import { useTrackEvent } from "@/Hooks/useAnalytics";
import { imageOcr } from "@/constants/tools";
import {
  resetOcrState,
  setOcrBinaryImage,
  setOcrErrorKey,
  setOcrInput,
  setOcrResult,
  setb64InputFile,
} from "@/redux/actions/tools/ocrActions";
import { getclientId } from "@Shared/GoogleAnalytics/MatomoAnalytics";
import HeaderTool from "@Shared/HeaderTool/HeaderTool";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import { preprocessFileUpload } from "@Shared/Utils/fileUtils";
import { setError } from "redux/reducers/errorReducer";

import StringFileUploadField from "../../../Shared/StringFileUploadField";
import { KNOWN_LINKS } from "../../Assistant/AssistantRuleBook";
import OcrResult from "./Results/OcrResult";

const OCR = () => {
  const { url } = useParams();
  const dispatch = useDispatch();
  const keyword = i18nLoadNamespace("components/NavItems/tools/OCR");
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );

  const role = useSelector((state) => state.userSession.user.roles);
  const ocrInputUrl = useSelector((state) => state.ocr.url);
  const selectedScript = useSelector((state) => state.ocr.selectedScript);

  const fail = useSelector((state) => state.ocr.fail);
  const errorKey = useSelector((state) => state.ocr.errorKey);
  const session = useSelector((state) => state.userSession);
  const uid = session && session.user ? session.user.id : null;

  const [input, setInput] = useState(ocrInputUrl ?? "");
  const [imageFile, setImageFile] = useState(undefined);
  const [b64Image, setB64Image] = useState(undefined);
  const [eventUrl, setEventUrl] = useState(undefined);

  const client_id = getclientId();
  useTrackEvent(
    "submission",
    "ocr",
    "image ocr processing",
    eventUrl,
    client_id,
    eventUrl,
    uid,
  );

  const submitUrl = (src) => {
    const url = imageFile ? b64Image : src;
    setEventUrl(imageFile ? "local_image" : url);

    const ocrInput =
      imageFile && imageFile instanceof File
        ? URL.createObjectURL(imageFile)
        : src;
    // console.log("ocrInput", ocrInput);

    dispatch(setOcrInput(ocrInput, selectedScript));
  };

  const onLoadImage = (img) => {
    img.onload = () => {
      let canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d").drawImage(img, 0, 0);
      dispatch(setb64InputFile(canvas.toDataURL("image/png")));
      // Get raw image data
      canvas.remove();
    };
  };

  const preprocessingSuccess = (file) => {
    // setImageFile(file);

    const reader = new FileReader();
    const localUrl = URL.createObjectURL(file);
    // setInput(localUrl);
    reader.onload = () => {
      dispatch(setOcrBinaryImage(reader.result));
      setB64Image(reader.result);
    };
    reader.readAsBinaryString(file);
    let img = new Image();
    img.crossOrigin = "anonymous";
    onLoadImage(img);
    img.src = localUrl;
  };

  const preprocessingError = () => {
    dispatch(setOcrErrorKey("ocr_too_big"));
    dispatch(setOcrResult(false, true, false, null));
  };

  useEffect(() => {
    let error_message_key = errorKey ? errorKey : "ocr_error";
    if (fail) {
      dispatch(setError(keyword(error_message_key)));
      dispatch(resetOcrState());
    }
  }, [fail, errorKey]);

  const localImage = (src) => {
    let img = new Image();
    img.crossOrigin = "anonymous";
    fetch(src)
      .then((r) => {
        return r.blob();
      })
      .then((blob) => {
        let url = URL.createObjectURL(blob);
        setInput(url);
        let reader = new FileReader();
        reader.readAsBinaryString(blob);
        reader.onloadend = () => {
          const base64String = reader.result;
          dispatch(setOcrBinaryImage(base64String));
          submitUrl(url);
        };
      });
    onLoadImage(img);
    img.src = src;
  };

  // automatically run if url param in current page url
  useEffect(() => {
    if (url && url !== KNOWN_LINKS.OWN) {
      const uri = url !== null ? decodeURIComponent(url) : undefined;

      if (!uri.startsWith("http")) {
        localImage(uri);
      } else {
        setInput(uri);
        submitUrl(uri);
      }
    }
  }, [url]);

  const processUrl = useSelector((state) => state.assistant.processUrl);
  useEffect(() => {
    if (processUrl) {
      setInput(processUrl);
      submitUrl(processUrl);
    }
  }, [processUrl]);

  const resetState = () => {
    dispatch(resetOcrState());
  };

  const preprocessImage = (file) => {
    return preprocessFileUpload(
      file,
      role,
      undefined,
      preprocessingSuccess,
      preprocessingError,
      4000000,
    );
  };

  return (
    <div>
      <HeaderTool
        name={keywordAllTools("navbar_ocr")}
        description={keywordAllTools("navbar_ocr_description")}
        icon={
          <imageOcr.icon
            sx={{ fill: "var(--mui-palette-primary-main)", fontSize: "40px" }}
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
              labelKeyword={keyword("ocr_urlbox")}
              placeholderKeyword={keyword("ocr_urlbox_placeholder")}
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
        </Box>
      </Card>
      <Box
        sx={{
          m: 3,
        }}
      />
      {ocrInputUrl ? <OcrResult /> : null}
    </div>
  );
};
export default OCR;
