import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";

import {
  resetOcrState,
  setb64InputFile,
  setOcrBinaryImage,
  setOcrErrorKey,
  setOcrInput,
  setOcrResult,
} from "../../../../redux/actions/tools/ocrActions";
import OcrResult from "./Results/OcrResult";

import { Box } from "@mui/material";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import OCRIcon from "../../../NavBar/images/SVG/Image/OCR.svg";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
//import { submissionEvent } from "../../../Shared/GoogleAnalytics/GoogleAnalytics";
import { getclientId } from "../../../Shared/GoogleAnalytics/MatomoAnalytics";
import { useTrackEvent } from "../../../../Hooks/useAnalytics";
import { setError } from "redux/reducers/errorReducer";
import { preprocessFileUpload } from "../../../Shared/Utils/fileUtils";
import StringFileUploadField from "../../../Shared/StringFileUploadField";
import { KNOWN_LINKS } from "../../Assistant/AssistantRuleBook";

const OCR = () => {
  const { url } = useParams();
  const classes = useMyStyles();
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
    setEventUrl(url);

    const ocrInput =
      imageFile && imageFile instanceof File
        ? URL.createObjectURL(imageFile)
        : src;
    console.log("ocrInput", ocrInput);

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

  const handleCloseSelectedFile = () => {
    dispatch(resetOcrState());
  };

  const preprocessImage = (file) => {
    return preprocessFileUpload(
      file,
      role,
      undefined,
      preprocessingSuccess,
      preprocessingError,
    );
  };

  return (
    <div>
      <HeaderTool
        name={keywordAllTools("navbar_ocr")}
        description={keywordAllTools("navbar_ocr_description")}
        icon={
          <OCRIcon style={{ fill: "#00926c" }} width="40px" height="40px" />
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
              handleCloseSelectedFile={handleCloseSelectedFile}
              preprocessLocalFile={preprocessImage}
            />
          </form>
        </Box>
      </Card>

      <Box m={3} />

      {ocrInputUrl ? <OcrResult /> : null}
    </div>
  );
};
export default OCR;
