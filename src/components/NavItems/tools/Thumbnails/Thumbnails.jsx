import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";

import CloseIcon from "@mui/icons-material/Close";

import { useTrackEvent } from "@/Hooks/useAnalytics";
import { loadImageSize, useLoading } from "@/Hooks/useInput";
import { thumbnails } from "@/constants/tools";
import {
  cleanThumbnailsState,
  setThumbnailsLoading,
  setThumbnailsResult,
} from "@/redux/reducers/tools/thumbnailsReducer";
import { getclientId } from "@Shared/GoogleAnalytics/MatomoAnalytics";
import HeaderTool from "@Shared/HeaderTool/HeaderTool";
import ImageGridList from "@Shared/ImageGridList/ImageGridList";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import useMyStyles from "@Shared/MaterialUiStyles/useMyStyles";
import OnClickInfo from "@Shared/OnClickInfo/OnClickInfo";
import {
  SEARCH_ENGINE_SETTINGS,
  reverseImageSearch,
  reverseImageSearchAll,
} from "@Shared/ReverseSearch/reverseSearchUtils";
import { setError } from "redux/reducers/errorReducer";

const Thumbnails = () => {
  const { url } = useParams();

  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Thumbnails");
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );

  const resultUrl = useSelector((state) => state.thumbnails.url);
  const resultData = useSelector((state) => state.thumbnails.result);
  const isLoading = useSelector((state) => state.thumbnails.loading);
  const session = useSelector((state) => state.userSession);
  const uid = session && session.user ? session.user.id : null;

  const [height, setHeight] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [input, setInput] = useState(resultUrl);
  const [urlDetected, setUrlDetected] = useState(false);
  const cols = 3;

  const dispatch = useDispatch();

  const handleChangeValue = (e) => {
    setInput(e.target.value);
  };

  /**
   * Initialize selected values with Google Search and open tabs set to true by default
   * @returns {selectedValue}
   */
  const initializeSelectedValue = () => {
    let selectedList = {};

    for (const searchEngine of Object.values(SEARCH_ENGINE_SETTINGS)) {
      selectedList[searchEngine.NAME] =
        searchEngine.NAME === SEARCH_ENGINE_SETTINGS.GOOGLE_LENS_SEARCH.NAME;
    }

    selectedList["openTabs"] = true;

    return selectedList;
  };

  const [selectedValue, setSelectedValue] = useState(() =>
    initializeSelectedValue(),
  );

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
    let img_url = "https://img.youtube.com/vi/%s/%d.jpg";
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
  const [eventUrl, setEventUrl] = useState(undefined);
  useTrackEvent(
    "submission",
    "thumbnails",
    "youtube thumbnail",
    eventUrl,
    client_id,
    eventUrl,
    uid,
  );
  const submitForm = () => {
    setShowResult(false);
    dispatch(setError(null));
    let url = input.replace("?rel=0", "");
    if (url !== null && url !== "" && isYtUrl(url)) {
      setEventUrl(url);
      /*trackEvent(
                                                                                                  "submission",
                                                                                                  "thumbnails",
                                                                                                  "youtube thumbnail",
                                                                                                  url,
                                                                                                  client_id,
                                                                                                  uid
                                                                                                );*/
      let images = get_images(url);
      dispatch(
        setThumbnailsResult({
          url: url,
          result: images,
          notification: false,
          loading: false,
        }),
      );
      if (selectedValue.openTabs) images.forEach((img) => imageClickUrl(img));
    } else dispatch(setError(keyword("enter_valid_youtube_url")));
  };

  const imageClickUrl = (url) => {
    for (const [searchEngineName, isSearchEngineSelected] of Object.entries(
      selectedValue,
    )) {
      // Prevent error
      const searchEngineExists = Object.values(SEARCH_ENGINE_SETTINGS).some(
        (searchEngine) => searchEngine.NAME === searchEngineName,
      );
      if (!searchEngineExists) continue;

      if (isSearchEngineSelected) {
        if (searchEngineName === SEARCH_ENGINE_SETTINGS.ALL.NAME)
          reverseImageSearchAll(url, false);
        else reverseImageSearch(url, searchEngineName, false);
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
  }, [resultData]);

  useEffect(() => {
    if (showResult) {
      dispatch(setThumbnailsLoading(false));
    }
  }, [showResult]);

  const processUrl = useSelector((state) => state.assistant.processUrl);
  useEffect(() => {
    if (processUrl) {
      setInput(processUrl);
      setUrlDetected(true);
    }
  }, [processUrl]);

  return (
    <div>
      <HeaderTool
        name={keywordAllTools("navbar_thumbnails")}
        description={keywordAllTools("navbar_thumbnails_description")}
        icon={
          <thumbnails.icon
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
            <Grid
              container
              direction="row"
              spacing={3}
              sx={{
                alignItems: "center",
              }}
            >
              <Grid size="grow">
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
              <Grid>
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
              <Grid>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    submitForm();
                  }}
                >
                  {keyword("button_submit")}
                </Button>
              </Grid>
            </Grid>
          </form>

          <Box
            sx={{
              m: 2,
            }}
          />
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
                },
              )}
            </FormGroup>
          </FormControl>
          {isLoading && (
            <>
              <Box
                sx={{
                  m: 3,
                }}
              />
              <LinearProgress />
            </>
          )}
        </Box>
      </Card>
      <Box
        sx={{
          m: 3,
        }}
      />
      {resultData && resultData.length !== 0 && !isImgLoading && (
        <Card variant="outlined">
          <CardHeader
            title={keyword("cardheader_results")}
            className={classes.headerUploadedImage}
            action={
              <IconButton
                aria-label="close"
                onClick={() => dispatch(cleanThumbnailsState())}
                sx={{ p: 1 }}
              >
                <CloseIcon />
              </IconButton>
            }
          />
          <div className={classes.root2}>
            <OnClickInfo keyword={"thumbnails_tip"} />
            <Box
              sx={{
                m: 2,
              }}
            />

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
