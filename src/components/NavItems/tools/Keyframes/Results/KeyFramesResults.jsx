import React, { memo, useState } from "react";
import { useSelector } from "react-redux";
import ImageGridList from "@Shared/ImageGridList/ImageGridList";
import { useKeyframes } from "../Hooks/usekeyframes";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid2,
  IconButton,
  Link,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "@Shared/MaterialUiStyles/useMyStyles";

import {
  reverseImageSearch,
  SEARCH_ENGINE_SETTINGS,
} from "@Shared/ReverseSearch/reverseSearchUtils";
import {
  Close,
  Download,
  ExpandMore,
  HelpOutline,
  ReportProblemOutlined,
  ZoomIn,
  ZoomOut,
} from "@mui/icons-material";

const KeyFramesResults = (props) => {
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Keyframes");
  const keywordHelp = i18nLoadNamespace("components/Shared/OnClickInfo");

  const [detailed, setDetailed] = useState(false);

  const [simpleList, detailedList] = useKeyframes(props.result);
  const [cols, setCols] = useState(4);

  const similarityResults = useSelector((state) => state.keyframes.similarity);
  const isLoadingSimilarity = useSelector(
    (state) => state.keyframes.similarityLoading,
  );

  const toggleDetail = () => {
    setDetailed(!detailed);
  };
  const imageClick = (event) => {
    let url = event;
    if (url !== "")
      reverseImageSearch(
        url,
        SEARCH_ENGINE_SETTINGS.GOOGLE_LENS_SEARCH.NAME,
        false,
      );
  };
  const zoom = (zoom) => {
    if (zoom === -1) {
      if (cols !== 12) {
        if (cols === 4) {
          setCols(6);
        } else if (cols === 6) {
          setCols(12);
        } else {
          setCols(cols + 1);
        }
      }
    }
    if (zoom === 1) {
      if (cols !== 1) {
        if (cols === 12) {
          setCols(6);
        } else if (cols === 6) {
          setCols(4);
        } else {
          setCols(cols - 1);
        }
      }
    }
  };

  const [loadingSimple, setLoadingSimple] = useState(true);
  const [loadingDetailed, setLoadingDetailed] = useState(true);
  const [classSimple, setClassSimple] = useState(classes.hidden);
  const [classDetailed, setClassDetailed] = useState(classes.hidden);

  const showElementsSimple = () => {
    setLoadingSimple(false);
    setClassSimple(classes.showElement);
  };

  const showElementsDetailed = () => {
    setLoadingDetailed(false);
    setClassDetailed(classes.showElement);
  };

  //Help
  //============================================================================================
  const [anchorHelp, setAnchorHelp] = useState(null);
  const openHelp = Boolean(anchorHelp);
  const help = openHelp ? "simple-popover" : undefined;

  function clickHelp(event) {
    setAnchorHelp(event.currentTarget);
  }

  function closeHelp() {
    setAnchorHelp(null);
  }

  const keyframe_url = process.env.REACT_APP_KEYFRAME_API;
  const video_id = useSelector((state) => state.keyframes.video_id);

  const downloadAction = () => {
    const downloadUrl = keyframe_url + "/keyframes/" + video_id + "/Subshots";
    fetch(downloadUrl).then((response) => {
      response.blob().then((blob) => {
        const url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.click();
      });
    });
  };

  return (
    <>
      {similarityResults &&
        !isLoadingSimilarity &&
        similarityResults.length > 0 && (
          <Card variant="outlined">
            <Box>
              <Accordion style={{ border: "2px solid #00926c" }}>
                <AccordionSummary
                  expandIcon={<ExpandMore sx={{ color: "primary" }} />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Box
                    p={1}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <ReportProblemOutlined
                      sx={{ color: "primary", marginRight: "8px" }}
                    />
                    <Typography
                      variant="h6"
                      align="left"
                      sx={{ color: "primary" }}
                    >
                      {keyword("found_dbkf")}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails style={{ flexDirection: "column" }}>
                  <Box p={1}>
                    <Typography variant="body1" align="left">
                      {keyword("dbkf_articles")}
                    </Typography>

                    <Box m={1} />

                    {similarityResults.map((value, key) => {
                      return (
                        <Typography
                          variant="body1"
                          align="left"
                          sx={{ color: "primary" }}
                          key={key}
                        >
                          <Link
                            target="_blank"
                            href={value.externalLink}
                            sx={{ color: "primary" }}
                          >
                            {value.externalLink}
                          </Link>
                        </Typography>
                      );
                    })}
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Card>
        )}
      <Card variant="outlined">
        <CardContent>
          <Stack direction="column" spacing={4}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h6">
                {keyword("cardheader_results")}
              </Typography>
              <IconButton onClick={clickHelp}>
                <HelpOutline />
              </IconButton>
              <Popover
                id={help}
                open={openHelp}
                anchorEl={anchorHelp}
                onClose={closeHelp}
                PaperProps={{
                  style: {
                    width: "300px",
                  },
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <Box p={2}>
                  <Stack direction="column" spacing={2}>
                    <Stack
                      direction="row"
                      sx={{
                        justifyContent: "space-between",
                        alignItems: "baseline",
                      }}
                    >
                      <Typography variant="h6" gutterBottom>
                        {keywordHelp("title_tip")}
                      </Typography>{" "}
                      <IconButton onClick={closeHelp}>
                        <Close />
                      </IconButton>
                    </Stack>
                    <Typography variant="body2">
                      {keywordHelp("keyframes_tip")}
                    </Typography>
                  </Stack>
                </Box>
              </Popover>
            </Stack>

            <Stack direction="column">
              <Grid2
                container
                justifyContent="space-between"
                spacing={2}
                alignContent={"center"}
              >
                <Grid2>
                  <Button onClick={() => toggleDetail()}>
                    {!detailed
                      ? keyword("keyframe_title_get_detail")
                      : keyword("keyframe_title_get_simple")}
                  </Button>
                </Grid2>

                <Grid2>
                  <Button
                    color="primary"
                    onClick={downloadAction}
                    startIcon={<Download />}
                  >
                    {keyword("keyframes_download_subshots")}
                  </Button>
                </Grid2>

                <Grid2 size="grow" style={{ textAlign: "end" }}>
                  <Button onClick={() => zoom(-1)} startIcon={<ZoomOut />}>
                    {keyword("zoom_out")}
                  </Button>
                </Grid2>
                <Grid2>
                  <Button onClick={() => zoom(1)} startIcon={<ZoomIn />}>
                    {keyword("zoom_in")}
                  </Button>
                </Grid2>
              </Grid2>
              <Divider />
            </Stack>

            {detailed && loadingDetailed && (
              <Box m={4}>
                <CircularProgress />
              </Box>
            )}
            {detailed && (
              <div className={classDetailed}>
                <ImageGridList
                  list={detailedList}
                  cols={cols}
                  handleClick={imageClick}
                  style={{ maxHeigth: "none", height: "auto" }}
                  setLoading={showElementsDetailed}
                />
              </div>
            )}

            {!detailed && loadingSimple && (
              <Box m={4}>
                <CircularProgress />
              </Box>
            )}
            {!detailed && (
              <div className={classSimple}>
                <ImageGridList
                  list={simpleList}
                  cols={cols}
                  handleClick={imageClick}
                  style={{ maxHeigth: "none", height: "auto" }}
                  setLoading={showElementsSimple}
                />
              </div>
            )}
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};
export default memo(KeyFramesResults);
