import React, { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Grid2 from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import DetailedIcon from "@mui/icons-material/ViewComfyRounded";
import SimpleIcon from "@mui/icons-material/ViewStreamRounded";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";

import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

import { cleanKeyframesState } from "../../../../../redux/actions/tools/keyframesActions";
import ImageGridList from "../../../../Shared/ImageGridList/ImageGridList";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";
import {
  SEARCH_ENGINE_SETTINGS,
  reverseImageSearch,
} from "../../../../Shared/ReverseSearch/reverseSearchUtils";
import { useKeyframes } from "../Hooks/usekeyframes";

const KeyFramesResults = (props) => {
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Keyframes");
  const keywordHelp = i18nLoadNamespace("components/Shared/OnClickInfo");
  const dispatch = useDispatch();

  const [detailed, setDetailed] = useState(false);
  const [simpleList, detailedList] = useKeyframes(props.result);
  //const [findHeight, setFindHeight] = useState(false);
  const [cols, setCols] = useState(3);
  //const [height, setHeight] = useState(0);
  const similarityResults = useSelector((state) => state.keyframes.similarity);
  //const isLoading = useSelector(state => state.keyframes.loading);
  const isLoadingSimilarity = useSelector(
    (state) => state.keyframes.similarityLoading,
  );

  const theme = createTheme({
    palette: {
      primary: {
        light: "#00926c",
        main: "#00926c",
        dark: "#00926c",
        contrastText: "#fff",
      },
      secondary: {
        main: "#ffaf33",
      },
      error: {
        main: "rgb(198,57,59)",
      },
    },
    components: {
      MuiImageList: {
        styleOverrides: {
          root: {
            maxHeight: "none!important",
            height: "auto!important",
          },
        },
      },
    },
  });

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

  return (
    <>
      <Card>
        {similarityResults &&
          !isLoadingSimilarity &&
          similarityResults.length > 0 && (
            <Box>
              <Accordion style={{ border: "2px solid #00926c" }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon style={{ color: "#17717e" }} />}
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
                    <ReportProblemOutlinedIcon
                      style={{ color: "#17717e", marginRight: "8px" }}
                    />
                    <Typography
                      variant="h6"
                      align="left"
                      style={{ color: "#17717e" }}
                    >
                      {keyword("found_dbkf")}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails style={{ flexDirection: "column" }}>
                  <Box p={2}>
                    <Typography variant="body1" align="left">
                      {keyword("dbkf_articles")}
                    </Typography>

                    <Box m={1} />

                    {similarityResults.map((value, key) => {
                      return (
                        <Typography
                          variant="body1"
                          align="left"
                          style={{ color: "#17717e" }}
                          key={key}
                        >
                          <Link
                            target="_blank"
                            href={value.externalLink}
                            style={{ color: "#17717e" }}
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
          )}
      </Card>
      <Box m={3} />
      <Card>
        <CardHeader
          title={
            <Grid2
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <span>{keyword("cardheader_results")}</span>
              <HelpOutlineIcon
                style={{ color: "#FFFFFF" }}
                onClick={clickHelp}
              />

              <Popover
                id={help}
                open={openHelp}
                anchorEl={anchorHelp}
                onClose={closeHelp}
                PaperProps={{
                  style: {
                    width: "300px",
                    fontSize: 14,
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
                <Box p={3}>
                  <Grid2
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="stretch"
                  >
                    <Typography variant="h6" gutterBottom>
                      {keywordHelp("title_tip")}
                    </Typography>

                    <CloseIcon onClick={closeHelp} />
                  </Grid2>

                  <Box m={1} />
                  <Typography variant="body2">
                    {keywordHelp("keyframes_tip")}
                  </Typography>
                </Box>
              </Popover>
            </Grid2>
          }
          className={classes.headerUploadedImage}
          action={
            <IconButton
              aria-label="close"
              onClick={() => {
                props.closeResult();
                dispatch(cleanKeyframesState());
              }}
            >
              <CloseIcon sx={{ color: "white" }} />
            </IconButton>
          }
        />

        <div className={classes.root2}>
          <Grid2
            container
            justifyContent="space-between"
            spacing={2}
            alignContent={"center"}
          >
            <Grid2>
              {!detailed ? (
                <Button
                  color={"primary"}
                  onClick={() => toggleDetail()}
                  endIcon={<DetailedIcon />}
                >
                  {keyword("keyframe_title_get_detail")}
                </Button>
              ) : (
                <Button
                  color={"primary"}
                  onClick={() => toggleDetail()}
                  endIcon={<SimpleIcon />}
                >
                  {keyword("keyframe_title_get_simple")}
                </Button>
              )}
            </Grid2>
            <Grid2 size="grow" style={{ textAlign: "end" }}>
              <Button onClick={() => zoom(-1)} endIcon={<ZoomOutIcon />}>
                {keyword("zoom_out")}
              </Button>
            </Grid2>
            <Grid2>
              <Button onClick={() => zoom(1)} endIcon={<ZoomInIcon />}>
                {keyword("zoom_in")}
              </Button>
            </Grid2>
          </Grid2>
          <Box m={2} />
          <Divider />

          <Box m={4} />
          <ThemeProvider theme={theme}>
            {detailed && loadingDetailed && (
              <Box m={4}>
                <CircularProgress />
              </Box>
            )}
            {detailed && (
              //<ImageGridList list={detailedList} height={160} onClick={(url) => ImageReverseSearch("google", url)}/>

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
              //<ImageGridList list={simpleList}  height={160} onClick={(url) => ImageReverseSearch("google", url)}/>
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
          </ThemeProvider>
        </div>
      </Card>
    </>
  );
};
export default memo(KeyFramesResults);
