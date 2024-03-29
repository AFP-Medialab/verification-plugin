import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { KNOWN_LINKS } from "../../Assistant/AssistantRuleBook";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";

import {
  cleanOcr,
  setb64InputFile,
  setOcrBinaryImage,
  setOcrErrorKey,
  setOcrInput,
  setOcrResult,
} from "../../../../redux/actions/tools/ocrActions";
import OcrResult from "./Results/OcrResult";

import { Box, Button, TextField } from "@mui/material";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import OCRIcon from "../../../NavBar/images/SVG/Image/OCR.svg";
import Grid from "@mui/material/Grid";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
//import { submissionEvent } from "../../../Shared/GoogleAnalytics/GoogleAnalytics";
import { getclientId } from "../../../Shared/GoogleAnalytics/MatomoAnalytics";
import { useTrackEvent } from "../../../../Hooks/useAnalytics";
import { setError } from "redux/reducers/errorReducer";
import _ from "lodash";
import { preprocessFileUpload } from "../../../Shared/Utils/fileUtils";

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
  const result = useSelector((state) => state.ocr.result);
  const fail = useSelector((state) => state.ocr.fail);
  const errorKey = useSelector((state) => state.ocr.errorKey);
  const session = useSelector((state) => state.userSession);
  const uid = session && session.user ? session.user.id : null;

  const [userInput, setUserInput] = useState(ocrInputUrl);
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
    setEventUrl(src);
    dispatch(setOcrInput(src, selectedScript));
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
    const reader = new FileReader();
    const localUrl = URL.createObjectURL(file);
    setUserInput(localUrl);
    reader.onload = () => {
      dispatch(setOcrBinaryImage(reader.result));
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
      dispatch(cleanOcr());
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
        setUserInput(url);
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

  // store any changes to the input text box to local state
  useEffect(() => {
    if (!ocrInputUrl) {
      setUserInput(undefined);
    }
  }, [ocrInputUrl]);

  // automatically run if url param in current page url
  useEffect(() => {
    if (url && url !== KNOWN_LINKS.OWN) {
      const uri = url !== null ? decodeURIComponent(url) : undefined;

      if (!uri.startsWith("http")) {
        localImage(uri);
      } else {
        setUserInput(uri);
        submitUrl(uri);
      }
    }
  }, [url]);

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
            <Grid container direction="row" spacing={3} alignItems="center">
              <Grid item xs>
                <TextField
                  id="standard-full-width"
                  label={keyword("ocr_urlbox")}
                  placeholder={keyword("ocr_urlbox_placeholder")}
                  fullWidth
                  value={userInput || ""}
                  variant="outlined"
                  onChange={(e) => setUserInput(e.target.value)}
                />
              </Grid>
              <Grid item>
                {!result ? (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={(e) => {
                      e.preventDefault();
                      if (!_.isUndefined(userInput)) submitUrl(userInput);
                    }}
                  >
                    {keyword("button_submit") || ""}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) => {
                      e.preventDefault(), dispatch(cleanOcr());
                    }}
                  >
                    {keyword("button_remove")}
                  </Button>
                )}
              </Grid>
            </Grid>
          </form>

          <Box m={2} />
          <Button startIcon={<FolderOpenIcon />}>
            <label htmlFor="fileInputMagnifier">
              {keyword("button_localfile")}
            </label>
            <input
              id="fileInputMagnifier"
              type="file"
              hidden={true}
              onChange={(e) => {
                preprocessFileUpload(
                  e.target.files[0],
                  role,
                  undefined,
                  preprocessingSuccess,
                  preprocessingError,
                );
              }}
            />
          </Button>
        </Box>
      </Card>

      <Box m={3} />

      {ocrInputUrl ? <OcrResult /> : null}
    </div>
  );
};
export default OCR;
