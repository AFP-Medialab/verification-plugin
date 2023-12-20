import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
//import 'tui-image-editor/dist/tui-image-editor.css'
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Grid from "@mui/material/Grid";
import MetadataImageResult from "./Results/MetadataImageResult";
import MetadataVideoResult from "./Results/MetadataVideoResult";
import useImageTreatment from "./Hooks/useImageTreatment";
import useVideoTreatment from "./Hooks/useVideoTreatment";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { getclientId } from "../../../Shared/GoogleAnalytics/MatomoAnalytics";
import { useTrackEvent } from "../../../../Hooks/useAnalytics";
import { useParams, useLocation } from "react-router-dom";

import { CONTENT_TYPE, KNOWN_LINKS } from "../../Assistant/AssistantRuleBook";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import MetadataIcon from "../../../NavBar/images/SVG/Image/Metadata.svg";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";

import { useDispatch } from "react-redux";
import { setMetadataMediaType } from "../../../../redux/reducers/tools/metadataReducer";

const Metadata = ({ mediaType }) => {
  const { url, type } = useParams();
  const location = useLocation();

  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Metadata");
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );

  const resultUrl = useSelector((state) => state.metadata.url);
  const resultData = useSelector((state) => state.metadata.result);
  const resultIsImage = useSelector((state) => state.metadata.isImage);
  const session = useSelector((state) => state.userSession);
  const uid = session && session.user ? session.user.email : null;

  const [radioImage, setRadioImage] = useState(
    mediaType === "video" ? false : true,
  );
  const [input, setInput] = useState(resultUrl ? resultUrl : "");
  const [imageUrl, setImageurl] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [urlDetected, setUrlDetected] = useState(false);

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
  const submitUrl = () => {
    if (input) {
      /* trackEvent(
        "submission",
        "metadata",
        "extract metadata",
        input,
        client_id,
        uid
      );*/
      if (radioImage) {
        setImageurl(input);
      } else {
        setVideoUrl(input);
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

  const handleCloseResult = () => {
    setInput("");
  };

  return (
    <div>
      <HeaderTool
        name={keywordAllTools("navbar_metadata")}
        description={keywordAllTools("navbar_metadata_description")}
        icon={
          <MetadataIcon
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
            <Grid container direction="row" spacing={3} alignItems="center">
              <Grid item xs>
                <TextField
                  value={input}
                  id="standard-full-width"
                  label={keyword("metadata_content_input")}
                  placeholder={keyword("metadata_content_input_placeholder")}
                  fullWidth
                  variant="outlined"
                  onChange={(e) => setInput(e.target.value)}
                />
              </Grid>
              <Grid item>
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
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    e.preventDefault(), submitUrl();
                  }}
                >
                  {keyword("button_submit")}
                </Button>
              </Grid>
            </Grid>
          </form>

          <Box m={1} />

          <Grid
            container
            direction="column"
            spacing={1}
            alignItems="flex-start"
          >
            <Grid item xs>
              <Typography variant="body1">
                * {keyword("description_limitations")}
              </Typography>
            </Grid>

            <Grid item>
              <Button startIcon={<FolderOpenIcon />}>
                <label htmlFor="fileInputMetadata">
                  {keyword("button_localfile")}
                </label>
                <input
                  id="fileInputMetadata"
                  type="file"
                  hidden={true}
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setInput(URL.createObjectURL(e.target.files[0]));
                      // reset value
                      e.target.value = null;
                    }
                  }}
                />
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Card>
      <Box m={3} />
      {resultData ? (
        resultIsImage ? (
          <MetadataImageResult
            result={resultData}
            image={resultUrl}
            closeResult={handleCloseResult}
          />
        ) : (
          <MetadataVideoResult
            result={resultData}
            closeResult={handleCloseResult}
          />
        )
      ) : null}
    </div>
  );
};
export default Metadata;
