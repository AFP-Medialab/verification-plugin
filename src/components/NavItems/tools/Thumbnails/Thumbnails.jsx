import React from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import ImageGridList from "../../../Shared/ImageGridList/ImageGridList";
import { useDispatch, useSelector } from "react-redux";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import { loadImageSize, useLoading } from "../../../../Hooks/useInput";
import {
  cleanThumbnailsState,
  setThumbnailsResult,
  setThumbnailsLoading,
} from "../../../../redux/reducers/tools/thumbnailsReducer";
import { setError } from "../../../../redux/actions/errorActions";
import CloseResult from "../../../Shared/CloseResult/CloseResult";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/Thumbnails.tsv";
import {
  trackEvent,
  getclientId,
} from "../../../Shared/GoogleAnalytics/MatomoAnalytics";
import OnClickInfo from "../../../Shared/OnClickInfo/OnClickInfo";
import { useParams } from "react-router-dom";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import ThumbnailsIcon from "../../../NavBar/images/SVG/Video/Thumbnails.svg";
import Grid from "@mui/material/Grid";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import LinearProgress from "@mui/material/LinearProgress";
import {
  reverseImageSearch,
  reverseImageSearchAll,
  SEARCH_ENGINE_SETTINGS,
} from "../../../Shared/ReverseSearch/reverseSearchUtils";

const Thumbnails = () => {
  const { url } = useParams();

  const classes = useMyStyles();
  const keyword = useLoadLanguage(
    "components/NavItems/tools/Thumbnails.tsv",
    tsv
  );
  const keywordAllTools = useLoadLanguage(
    "components/NavItems/tools/Alltools.tsv",
    tsv
  );

  const resultUrl = useSelector((state) => state.thumbnails.url);
  const resultData = useSelector((state) => state.thumbnails.result);
  const isLoading = useSelector((state) => state.thumbnails.loading);
  const [height, setHeight] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [input, setInput] = useState(resultUrl);
  const [urlDetected, setUrlDetected] = useState(false);
  var cols = 3;

  const dispatch = useDispatch();

  const handleChangeValue = (e) => {
    setInput(e.target.value);
  };

  const [selectedValue, setSelectedValue] = useState({
    [SEARCH_ENGINE_SETTINGS.GOOGLE_SEARCH.NAME]: true,
    openTabs: true,
  });

  const handleChange = (event) => {
    setSelectedValue({
      ...selectedValue,
      [event.target.value]: event.target.checked,
    });
  };

  const getYtIdFromUrlString = (url) => {
    let id = "";
    let start_url = "https://www.youtube.com";
    let start_url_short = "https://youtu.be";
    if (url.startsWith(start_url)) {
      let path = url.substring(start_url.length);
      if (path.match(/\/watch\?/)) {
        id = url.match(/v=([^&]+)/)[1];
      } else if (path.match(/\/v\//) || url.match(/\/embed\/(.*)/)) {
        id = url.substring(url.lastIndexOf("/") + 1);
      }
    } else if (url.startsWith(start_url_short)) {
      id = url.substring(url.lastIndexOf("/") + 1);
    }
    return id;
  };

  const get_images = (url) => {
    let video_id = getYtIdFromUrlString(url);
    let img_url = "http://img.youtube.com/vi/%s/%d.jpg";
    let img_arr = [];
    for (let count = 0; count < 4; count++) {
      img_arr.push(img_url.replace("%s", video_id).replace("%d", count));
    }
    return img_arr;
  };

  const isYtUrl = (url) => {
    let start_url = "https://www.youtube.com/";
    let start_url_short = "https://youtu.be/";
    return url.startsWith(start_url) || url.startsWith(start_url_short);
  };
  const client_id = getclientId();
  const submitForm = () => {
    setShowResult(false);
    dispatch(setError(null));
    let url = input.replace("?rel=0", "");
    if (url !== null && url !== "" && isYtUrl(url)) {
      trackEvent(
        "submission",
        "thumbnails",
        "youtube thumbnail",
        url,
        client_id
      );
      let images = get_images(url);
      dispatch(
        setThumbnailsResult({
          url: url,
          result: images,
          notification: false,
          loading: false,
        })
      );
      if (selectedValue.openTabs) images.forEach((img) => imageClickUrl(img));
    } else dispatch(setError("Please use a valid Youtube Url (add to tsv)"));
  };

  const imageClickUrl = (url) => {
    for (const [searchEngineName, isSearchEngineSelected] of Object.entries(
      selectedValue
    )) {
      if (isSearchEngineSelected) {
        if (searchEngineName === SEARCH_ENGINE_SETTINGS.ALL.NAME)
          reverseImageSearchAll(url, true);
        else reverseImageSearch(url, true, searchEngineName);
      }
    }
  };

  const computeHeight = async () => {
    loadImageSize(resultData, cols)
      .then((height) => {
        setHeight(height);
        setShowResult(true);
      })
      .then((height) => {
        return height;
      })
      .catch((e) => {
        console.error(e);
        return null;
      });
  };

  const [getHeight, isImgLoading] = useLoading(computeHeight);
  useEffect(() => {
    if (url !== undefined) {
      const uri = url !== null ? decodeURIComponent(url) : undefined;
      setInput(uri);
      setSelectedValue({
        ...selectedValue,
        openTabs: false,
      });
      setUrlDetected(true);
    }
  }, [url]);

  useEffect(() => {
    if (urlDetected) submitForm();
  }, [urlDetected]);

  // const response = getHeight();
  useEffect(() => {
    if (resultData) {
      getHeight();
    }
    // eslint-disable-next-line
  }, [resultData]);

  useEffect(() => {
    if (showResult) {
      dispatch(setThumbnailsLoading(false));
    }
  }, [showResult]);

  return (
    <div>
      <HeaderTool
        name={keywordAllTools("navbar_thumbnails")}
        description={keywordAllTools("navbar_thumbnails_description")}
        icon={
          <ThumbnailsIcon
            style={{ fill: "#51A5B2" }}
            width="40px"
            height="40px"
          />
        }
      />

      <Card>
        <CardHeader
          title={keyword("cardheader_link")}
          className={classes.headerUpladedImage}
        />
        <Box p={3}>
          <form>
            <Grid container direction="row" spacing={3} alignItems="center">
              <Grid item xs>
                <TextField
                  id="standard-full-width"
                  label={keyword("youtube_input")}
                  placeholder={keyword("api_input")}
                  fullWidth
                  variant="outlined"
                  onChange={(e) => handleChangeValue(e)}
                  value={input}
                />
              </Grid>
              <Grid item>
                {
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedValue["openTabs"]}
                        value={"openTabs"}
                        onChange={(e) => handleChange(e)}
                        color="primary"
                      />
                    }
                    label={keyword("openTabs")}
                    labelPlacement="end"
                  />
                }
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    e.preventDefault(), submitForm();
                  }}
                >
                  {keyword("button_submit")}
                </Button>
              </Grid>
            </Grid>
          </form>

          <Box m={2} />
          <FormControl component="fieldset">
            <FormGroup row>
              {Object.entries(SEARCH_ENGINE_SETTINGS).map(
                ([index, searchEngine]) => {
                  return (
                    <FormControlLabel
                      key={index}
                      control={
                        <Checkbox
                          checked={selectedValue[searchEngine.NAME]}
                          value={searchEngine.NAME}
                          onChange={(e) => handleChange(e)}
                          color="primary"
                        />
                      }
                      label={searchEngine.NAME}
                      labelPlacement="end"
                    />
                  );
                }
              )}
            </FormGroup>
          </FormControl>
          {isLoading && (
            <>
              <Box m={3} />
              <LinearProgress />
            </>
          )}
        </Box>
      </Card>

      <Box m={3} />

      {resultData && resultData.length !== 0 && !isImgLoading && (
        <Card>
          <CardHeader
            title={keyword("cardheader_results")}
            className={classes.headerUpladedImage}
          />
          <div className={classes.root2}>
            <CloseResult onClick={() => dispatch(cleanThumbnailsState())} />
            <OnClickInfo keyword={"thumbnails_tip"} />
            <Box m={2} />

            <ImageGridList
              list={resultData}
              handleClick={imageClickUrl}
              height={height}
              cols={cols}
            />
          </div>
        </Card>
      )}
    </div>
  );
};
export default Thumbnails;
