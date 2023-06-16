import { Box, TextField, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "tui-image-editor/dist/tui-image-editor.css";
import ImageResult from "./Results/ImageResult";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import { useParams } from "react-router-dom";
import {
  setMagnifierResult,
  setMagnifierLoading,
} from "../../../../redux/actions/tools/magnifierActions";
import { setError } from "../../../../redux/actions/errorActions";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/Magnifier.tsv";
import {
  //trackEvent,
  getclientId,
} from "../../../Shared/GoogleAnalytics/MatomoAnalytics";
import { useTrackEvent } from "../../../../Hooks/useAnalytics";
import { KNOWN_LINKS } from "../../Assistant/AssistantRuleBook";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import MagnifierIcon from "../../../NavBar/images/SVG/Image/Magnifier.svg";
import Grid from "@mui/material/Grid";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";

const Magnifier = () => {
  const { url } = useParams();
  const classes = useMyStyles();
  const keyword = useLoadLanguage(
    "components/NavItems/tools/Magnifier.tsv",
    tsv
  );
  const keywordAllTools = useLoadLanguage(
    "components/NavItems/tools/Alltools.tsv",
    tsv
  );

  const resultUrl = useSelector((state) => state.magnifier.url);
  const resultResult = useSelector((state) => state.magnifier.result);
  const session = useSelector((state) => state.userSession);
  const uid = session && session.user ? session.user.email : null;
  const dispatch = useDispatch();

  const [input, setInput] = useState(resultUrl);

  const getErrorText = (error) => {
    if (keyword(error) !== "") return keyword(error);
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
    uid
  );
  const submitUrl = (src) => {
    setEventUrl(src);
    /*trackEvent(
      "submission",
      "magnifier",
      "image magnifier caa analysis",
      src,
      client_id,
      uid
    );*/
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
          url: src,
          result: canvas.toDataURL("image/png"),
          notification: false,
          loading: false,
        })
      );
      canvas.remove();
    };
    img.onerror = (error) => {
      dispatch(setError(getErrorText(error)));
    };
    img.src = src;
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
          className={classes.headerUpladedImage}
        />

        <Box p={3}>
          <form>
            <Grid container direction="row" spacing={3} alignItems="center">
              <Grid item xs>
                <TextField
                  id="standard-full-width"
                  label={keyword("magnifier_urlbox")}
                  placeholder={keyword("magnifier_urlbox_placeholder")}
                  fullWidth
                  value={input}
                  variant="outlined"
                  onChange={(e) => setInput(e.target.value)}
                />
              </Grid>

              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    e.preventDefault(), submitUrl(input);
                  }}
                >
                  {keyword("button_submit") || ""}
                </Button>
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
                setInput(URL.createObjectURL(e.target.files[0]));
              }}
            />
          </Button>
        </Box>
      </Card>

      <Box m={3} />

      {resultResult && resultResult !== "" && <ImageResult />}
    </div>
  );
};
export default Magnifier;
