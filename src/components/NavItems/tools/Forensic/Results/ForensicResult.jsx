import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import React, { useState, Component, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/Forensic.tsv";
import tsvWarning from "../../../../../LocalDictionary/components/Shared/OnWarningInfo.tsv";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Divider from "@mui/material/Divider";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import CloseIcon from "@mui/icons-material/Close";
import GifIcon from "@mui/icons-material/Gif";
import Fab from "@mui/material/Fab";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import Fade from "@mui/material/Fade";
import { cleanForensicState } from "../../../../../redux/actions/tools/forensicActions";
import {
  setStateInit,
  setStateBackResults,
} from "../../../../../redux/reducers/tools/gifReducer";
import LinkIcon from "@mui/icons-material/Link";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import WarningIcon from "@mui/icons-material/Warning";
import Alert from "@mui/material/Alert";
import MakoScale from "../../../../NavBar/images/SVG/MakoScale.png";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import AnimatedGif from "../../Gif/AnimatedGif";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component="span">{children}</Typography>
        </Box>
      )}
    </div>
  );
}
export class Instructions extends Component {
  render() {
    return <HelpOutlineIcon />;
  }
}

const ForensicResults = (props) => {
  const dispatch = useDispatch();
  const displayItem = useSelector((state) => state.forensic.displayItem);

  const theme = createTheme({
    components: {
      MuiCardHeader: {
        styleOverrides: {
          root: {
            backgroundColor: "#05A9B4",
          },
          title: {
            color: "white",
            fontSize: 20,
            fontweight: 500,
          },
        },
      },

      MuiTab: {
        styleOverrides: {
          wrapper: {
            fontSize: 12,
          },
          root: {
            minWidth: "25%!important",
          },
        },
      },
    },

    palette: {
      primary: {
        light: "#5cdbe6",
        main: "#05a9b4",
        dark: "#007984",
        contrastText: "#fff",
      },
    },
  });

  const classes = useMyStyles();
  const keyword = useLoadLanguage(
    "components/NavItems/tools/Forensic.tsv",
    tsv
  );
  const keywordWarning = useLoadLanguage(
    "components/Shared/OnWarningInfo.tsv",
    tsvWarning
  );
  const results = props.result.filters;
  //const masks = props.masksData;
  //console.log(results);

  const userAuthenticated = useSelector(
    (state) => state.userSession && state.userSession.userAuthenticated
  );
  const [openAlert, setOpenAlert] = React.useState(false);

  const filtersIDs = [
    //COMPRESSION
    "zero_report", //0
    "ghost_report", //1
    "cagi_report", //2
    "adq1_report", //3
    "dct_report", //4
    "blk_report", //5

    //NOISE
    "splicebuster_report", //6
    "wavelet_report", //7
    "cfa_report", //8

    //DEEP LEARNING
    "mantranet_report", //9
    "fusion_report", //10

    //CLONING
    "cmfd_report", //11
    "rcmfd_report", //12

    //LENSES

    "ela_report", //13
    "laplacian_report", //14
    "median_report", //15
  ];

  const idStartCompression = 0;
  const idStartNoise = 6;
  const idStartDeepLearning = 9;
  const idStartCloning = 11;
  const idStartLenses = 13;

  //console.log(results);

  const filters = useRef(
    filtersIDs.map((value) => {
      var filter;
      //console.log(results[value]);

      if (results[value] === undefined || !results[value].completed) {
        filter = {
          id: "",
          name: "",
          map: "",
          mask: "",
        };
        return filter;
      }
      //Zero
      if (value === "zero_report") {
        filter = {
          id: value,
          name: keyword("forensic_title_" + value),
          map: [
            results[value]["forgery"]["colormap"],
            //results[value]["votemap"]["colormap"],
          ],
          currentDisplayed: 0,
          arrows: [false, false],
          mask: [
            results[value]["forgery"]["transparent"],
            //results[value]["votemap"]["transparent"],
          ],
          popover: false,
        };

        //GHOST
      } else if (value === "ghost_report") {
        filter = {
          id: value,
          name: keyword("forensic_title_" + value),
          map: results[value]["colormap"],
          currentDisplayed: 0,
          arrows: [false, false],
          mask: results[value]["transparent"],
          popover: false,
        };

        //CAGI
      } else if (value === "cagi_report") {
        filter = {
          id: value,
          name: [
            keyword("forensic_title_cagiNormal"),
            keyword("forensic_title_cagiInversed"),
          ],
          map: [
            results[value]["cagiNormalReport"]["colormap"],
            results[value]["cagiInversedReport"]["colormap"],
          ],
          currentDisplayed: 0,
          arrows: [false, false],
          mask: [
            results[value]["cagiNormalReport"]["transparent"],
            results[value]["cagiInversedReport"]["transparent"],
          ],
          popover: false,
        };

        //RCMFD
      } else if (value === "rcmfd_report") {
        filter = {
          id: value,
          name: keyword("forensic_title_" + value),
          map: results[value].map,
          mask: results[value].map,
          popover: false,
        };

        //LENSES
      } else if (
        value === "ela_report" ||
        value === "laplacian_report" ||
        value === "median_report"
      ) {
        filter = {
          id: value,
          name: keyword("forensic_title_" + value),
          map: results[value].map,
          popover: false,
        };
      } else {
        filter = {
          id: value,
          name: keyword("forensic_title_" + value),
          map: results[value]["colormap"],
          mask: results[value]["transparent"],
          popover: false,
        };
      }

      return filter;
    })
  );

  //onsole.log(filters);
  //console.log(results);

  const tabs = [0, 1, 2, 3];

  //Hover effect of the filters
  //============================================================================================
  const [filterHoverEnabled, setFilterHoverEnabled] = React.useState(false);
  const [filterHover, setFilterHover] = useState(displayItem);

  function displayFilterHover(map) {
    setFilterHover(map);
    setFilterHoverEnabled(true);
  }

  function hideFilterHover() {
    setFilterHoverEnabled(false);
    setFilterHover(displayItem);
  }

  //Button analyze new image
  //============================================================================================
  function newImage() {
    dispatch(cleanForensicState());
    props.resetImage();
  }

  //Help of the lenses
  //============================================================================================
  const [anchorHelpLenses, setAnchorHelpLenses] = React.useState(false);
  const openHelpLenses = Boolean(anchorHelpLenses);
  const helpLenses = openHelpLenses ? "simple-popover" : undefined;

  function clickHelpLenses(event) {
    setAnchorHelpLenses(event.currentTarget);
  }

  function closeHelpLenses() {
    setAnchorHelpLenses(null);
  }

  //Help of the Filters
  //============================================================================================
  const [anchorHelpFilters, setAnchorHelpFilters] = React.useState(false);
  const openHelpFilters = Boolean(anchorHelpFilters);
  const helpFilters = openHelpFilters ? "simple-popover" : undefined;

  function clickHelpFilters(event) {
    setAnchorHelpFilters(event.currentTarget);
  }

  function closeHelpFilters() {
    setAnchorHelpFilters(false);
  }

  //Navigation and Gif of filters
  //============================================================================================

  function arrowsToDisplay(filter) {
    //left, right
    var arrows = [false, false];
    var filterData = filters.current.find((x) => x.id === filter);
    if (filterData.map.length === 1) {
      return;
    }
    if (filterData.currentDisplayed === 0) {
      arrows[1] = true;
      filters.current.find((x) => x.id === filter).arrows = arrows;
    } else if (filterData.currentDisplayed === filterData.map.length - 1) {
      arrows[0] = true;
      filters.current.find((x) => x.id === filter).arrows = arrows;
    } else {
      arrows[0] = true;
      arrows[1] = true;
      filters.current.find((x) => x.id === filter).arrows = arrows;
    }
  }

  function clickArrowFilter(filter, arrow) {
    filters.current.find((x) => x.id === filter).currentDisplayed += arrow;
    arrowsToDisplay(filter);
    displayFilterHover(
      filters.current.find((x) => x.id === filter).mask[
        filters.current.find((x) => x.id === filter).currentDisplayed
      ]
    );
  }

  //Gif popover
  //============================================================================================
  const [anchorGifPopover, setAnchorGifPopover] = React.useState(false);
  const openGifPopover = Boolean(anchorGifPopover);
  const gifPopover = openGifPopover ? "simple-popover" : undefined;
  const gifImage = displayItem;
  const [gifFilter, setGifFilter] = React.useState(displayItem);
  //const gifFilterMask = useSelector(state => state.forensic.maskUrl);
  //console.log(gifFilterMask);

  //const [interval, setIntervalVar] = React.useState(null);

  const gifState = useSelector((state) => state.gif.toolState);
  //const [gifToolState, setgifToolState] = useState(1)

  function clickGifPopover(event, filter) {
    if (userAuthenticated) {
      var url;
      if (
        filter === "zero_report" ||
        filter === "ghost_report" ||
        filter === "cagi_report"
      ) {
        url = filters.current.find((x) => x.id === filter).mask[
          filters.current.find((x) => x.id === filter).currentDisplayed
        ];
        setGifFilter(url);
        //console.log(url);
        //setReadyTransparency(true);
      } else {
        url = filters.current.find((x) => x.id === filter).mask;
        setGifFilter(url);
        //console.log(url);
        //setReadyTransparency(true);
      }
      dispatch(setStateBackResults());
      //setIntervalVar(setInterval(() => animateFilter(), 1100));
      setAnchorGifPopover(event.currentTarget);
    } else {
      setOpenAlert(true);
    }
  }

  function closeGifPopover() {
    //clearInterval(interval);
    setAnchorGifPopover(false);
    //setReadyTransparency(false);
  }

  const imageDisplayed = displayItem;

  //tabs
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //console.log("Downloading: " + downloading);

  //Copy url to clipboard
  const [openToast, setOpenToast] = React.useState(false);

  const handleClickCopyURL = () => {
    navigator.clipboard.writeText(displayItem);
    setOpenToast(true);
  };

  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenToast(false);
  };

  //Explanation of the filters
  const [anchorFilterExplanation, setAnchorFilterExplanation] =
    React.useState(false);
  const openFilterExplanation = Boolean(anchorFilterExplanation);
  const [filterPopover, setFilterPopover] = React.useState(false);
  const [textCagiPopover, setTextCagiPopover] = React.useState(null);
  const [titleCagiPopover, setTitleCagiPopover] = React.useState(null);

  const handleOpenFilterExplanation = (event, filter) => {
    if (filter === "cagi") {
      if (
        filters.current.find((x) => x.id === "cagi_report").currentDisplayed ===
        0
      ) {
        setTextCagiPopover(keyword("forensic_card_cagiNormal"));
        setTitleCagiPopover(
          filters.current.find((x) => x.id === "cagi_report").name[0]
        );
      } else {
        setTextCagiPopover(keyword("forensic_card_cagiInversed"));
        setTitleCagiPopover(
          filters.current.find((x) => x.id === "cagi_report").name[1]
        );
      }
      setAnchorFilterExplanation(event.currentTarget);
      setFilterPopover("cagi_report");
      filters.current.find((x) => x.id === "cagi_report").popover = true;
    } else {
      setAnchorFilterExplanation(event.currentTarget);
      setFilterPopover(filter);
      filters.current.find((x) => x.id === filter).popover = true;
    }
  };

  const handleCloseFilterExplanation = () => {
    setAnchorFilterExplanation(null);
    filters.current.find((x) => x.id === filterPopover).popover = false;
  };

  const idExpl = openFilterExplanation ? "simple-popover" : undefined;

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };

  useEffect(() => {
    return () => {
      //clearInterval(interval);
      dispatch(setStateInit());
    };
    // eslint-disable-next-line
  }, []);

  const currentLang = useSelector((state) => state.language);
  const isCurrentLanguageLeftToRight = currentLang !== "ar";

  return (
    <div>
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={
          isCurrentLanguageLeftToRight
            ? {
                vertical: "bottom",
                horizontal: "left",
              }
            : {
                vertical: "bottom",
                horizontal: "right",
              }
        }
      >
        <Alert onClose={handleCloseAlert} severity="warning">
          {keywordWarning("warning_advanced_tools")}
        </Alert>
      </Snackbar>
      <Box mt={3} style={{ marginBottom: "50px" }}>
        <Alert severity="warning">{keywordWarning("warning_forensic")}</Alert>
      </Box>
      <div className={classes.newForensics}>
        <ThemeProvider theme={theme}>
          <Box mt={5} mb={5}>
            <Snackbar
              anchorOrigin={
                isCurrentLanguageLeftToRight
                  ? {
                      vertical: "bottom",
                      horizontal: "left",
                    }
                  : {
                      vertical: "bottom",
                      horizontal: "right",
                    }
              }
              open={openToast}
              autoHideDuration={6000}
              onClose={handleCloseToast}
              message={keyword("forensic_tosast_clipboard")}
              action={
                <React.Fragment>
                  <IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={handleCloseToast}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </React.Fragment>
              }
            />

            <Grid container spacing={3}>
              <Grid
                item
                xs={6}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <Card>
                  <CardHeader
                    title={
                      <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Grid item>
                          <span>{keyword("forensic_title_image")}</span>
                        </Grid>

                        <Grid item xs>
                          <Box ml={2}>
                            <IconButton
                              style={{ color: "white", padding: "0" }}
                              component="span"
                              onClick={handleClickCopyURL}
                            >
                              <LinkIcon />
                            </IconButton>
                          </Box>
                        </Grid>

                        <Grid item>
                          <Button
                            variant="contained"
                            style={{
                              backgroundColor: "#FFFFFF",
                              color: "black",
                            }}
                            onClick={newImage}
                          >
                            {keyword("forensic_button_newImage")}
                          </Button>
                        </Grid>
                      </Grid>
                    }
                    className={classes.headerUpladedImage}
                  />

                  <div className={classes.wrapperImageFilter}>
                    <CardMedia
                      crossOrigin={"anonymous"}
                      component="img"
                      className={classes.imageUploaded}
                      image={imageDisplayed}
                    />
                    <Fade in={filterHoverEnabled} timeout={300}>
                      <CardMedia
                        component="img"
                        className={classes.filterDisplayedClass}
                        image={filterHover}
                      />
                    </Fade>
                  </div>
                </Card>

                <Box mt={3}></Box>

                <Card className={classes.lensesCard}>
                  <CardHeader
                    title={
                      <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <span>{keyword("forensic_title_lenses")}</span>
                        <WarningIcon
                          style={{ color: "#FFFFFF" }}
                          onClick={clickHelpLenses}
                        />

                        <Popover
                          id={helpLenses}
                          open={openHelpLenses}
                          anchorEl={anchorHelpLenses}
                          onClose={closeHelpLenses}
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
                            <Grid
                              container
                              direction="row"
                              justifyContent="space-between"
                              alignItems="stretch"
                            >
                              <Typography variant="h6" gutterBottom>
                                {keyword("forensic_title_what")}
                              </Typography>

                              <CloseIcon onClick={closeHelpLenses} />
                            </Grid>

                            <Box m={1} />
                            <Typography variant="body2">
                              {keyword("forensic_lenses_explanation")}
                            </Typography>
                          </Box>
                        </Popover>
                      </Grid>
                    }
                  />

                  <Box p={3}>
                    <Grid container spacing={3}>
                      {filters.current
                        .slice(idStartLenses)
                        .map((value, key) => {
                          return (
                            <Grid key={key} item xs={4}>
                              <CardMedia
                                className={classes.imageFilter}
                                image={value.map}
                                onMouseOver={() =>
                                  displayFilterHover(value.map)
                                }
                                onMouseLeave={hideFilterHover}
                              />
                              <Box
                                align="center"
                                width="100%"
                                className={classes.lensesTitles}
                              >
                                {value.name}
                                <IconButton
                                  className={classes.margin}
                                  size="small"
                                  onClick={(e) =>
                                    handleOpenFilterExplanation(e, value.id)
                                  }
                                >
                                  <HelpOutlineIcon fontSize="inherit" />
                                </IconButton>
                                <Popover
                                  id={idExpl}
                                  open={
                                    value.popover !== undefined
                                      ? value.popover
                                      : false
                                  }
                                  anchorEl={anchorFilterExplanation}
                                  onClose={handleCloseFilterExplanation}
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
                                    <Grid
                                      container
                                      direction="row"
                                      justifyContent="space-between"
                                      alignItems="stretch"
                                    >
                                      <Typography variant="body1">
                                        {value.name}
                                      </Typography>

                                      <CloseIcon
                                        onClick={handleCloseFilterExplanation}
                                      />
                                    </Grid>
                                    <Box m={1} />

                                    <Typography variant="body2" align="justify">
                                      {keyword("forensic_card_" + value.id)}
                                    </Typography>
                                  </Box>
                                </Popover>
                              </Box>
                            </Grid>
                          );
                        })}
                    </Grid>
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={6}>
                <Card className={classes.cardFilters}>
                  <CardHeader
                    title={
                      <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <span>{keyword("forensic_title_filters")}</span>
                        <HelpOutlineIcon
                          style={{ color: "#FFFFFF" }}
                          onClick={clickHelpFilters}
                        />

                        <Popover
                          id={helpFilters}
                          open={openHelpFilters}
                          anchorEl={anchorHelpFilters}
                          onClose={closeHelpFilters}
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
                            <Grid
                              container
                              direction="row"
                              justifyContent="space-between"
                              alignItems="stretch"
                            >
                              <Typography variant="h6" gutterBottom>
                                {keyword("forensic_title_what")}
                              </Typography>

                              <CloseIcon onClick={closeHelpFilters} />
                            </Grid>
                            <Box m={1} />
                            <Typography variant="body2">
                              {keyword("forensic_filters_explanation")}
                            </Typography>
                          </Box>
                        </Popover>
                      </Grid>
                    }
                  ></CardHeader>

                  <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor={"primary"}
                  >
                    <Tab label={keyword("forensic_family_compression_title")} />
                    <Tab label={keyword("forensic_family_noise_title")} />
                    <Tab label={keyword("forensic_family_ai_title")} />
                    <Tab label={keyword("forensic_family_cloning_title")} />
                  </Tabs>

                  {tabs.map((valueTab, keyTab) => {
                    var filtersTab = [];
                    var textDescription = "";
                    var textLook = "";
                    var textIgnore = "";

                    if (valueTab === 0) {
                      filtersTab = filters.current.slice(
                        idStartCompression,
                        idStartNoise
                      );
                      textDescription = keyword(
                        "forensic_family_compression_description"
                      );
                      textLook = keyword("forensic_family_compression_look");
                      textIgnore = keyword(
                        "forensic_family_compression_ignore"
                      );
                    } else if (valueTab === 1) {
                      filtersTab = filters.current.slice(
                        idStartNoise,
                        idStartDeepLearning
                      );
                      textDescription = keyword(
                        "forensic_family_noise_description"
                      );
                      textLook = keyword("forensic_family_noise_look");
                      textIgnore = keyword("forensic_family_noise_ignore");
                    } else if (valueTab === 2) {
                      filtersTab = filters.current.slice(
                        idStartDeepLearning,
                        idStartCloning
                      );
                      textDescription = keyword(
                        "forensic_family_ai_description"
                      );
                      textLook = keyword("forensic_family_ai_look");
                      textIgnore = keyword("forensic_family_ai_ignore");
                    } else {
                      filtersTab = filters.current.slice(
                        idStartCloning,
                        idStartLenses
                      );
                      textDescription = keyword(
                        "forensic_family_cloning_description"
                      );
                      textLook = keyword("forensic_family_cloning_look");
                      textIgnore = keyword("forensic_family_cloning_ignore");
                    }

                    return (
                      <TabPanel value={value} key={keyTab} index={valueTab}>
                        <Grid container spacing={3}>
                          {filtersTab.map((value, key) => {
                            if (
                              value.id === "zero_report" ||
                              value.id === "ghost_report" ||
                              value.id === "cagi_report"
                            ) {
                              arrowsToDisplay(value.id);
                            }

                            /*
                                                            if (value.id === "ghost_report") {
                                                                value.mask = ghostMasks;
                                                            }
                                                            */

                            return (
                              <Grid key={key} item xs={4}>
                                {value.id === "zero_report" ||
                                value.id === "ghost_report" ||
                                value.id === "cagi_report" ? (
                                  <div
                                    className={classes.imageOverlayWrapper}
                                    onMouseOver={() =>
                                      displayFilterHover(
                                        value.mask[value.currentDisplayed]
                                      )
                                    }
                                    onMouseLeave={hideFilterHover}
                                  >
                                    <CardMedia
                                      className={classes.imageFilter}
                                      image={value.map[value.currentDisplayed]}
                                    />

                                    <div className={classes.imageOverlay}>
                                      <Grid
                                        container
                                        direction="row"
                                        justifyContent="space-around"
                                        alignItems="center"
                                      >
                                        {value.arrows[0] ? (
                                          <Fab
                                            size="small"
                                            style={{
                                              backgroundColor: "#ffffff",
                                            }}
                                            onClick={() =>
                                              clickArrowFilter(value.id, -1)
                                            }
                                          >
                                            {isCurrentLanguageLeftToRight ? (
                                              <NavigateBeforeIcon
                                                style={{ color: "#00000" }}
                                              />
                                            ) : (
                                              <NavigateNextIcon
                                                style={{ color: "#00000" }}
                                              />
                                            )}
                                          </Fab>
                                        ) : (
                                          <Fab
                                            size="small"
                                            style={{ visibility: "hidden" }}
                                          ></Fab>
                                        )}
                                        <Fab
                                          size="medium"
                                          style={{ backgroundColor: "#ffffff" }}
                                          onClick={(e) =>
                                            clickGifPopover(e, value.id)
                                          }
                                        >
                                          <GifIcon
                                            style={{ color: "#000000" }}
                                          />
                                        </Fab>

                                        {value.arrows[1] ? (
                                          <Fab
                                            size="small"
                                            style={{
                                              backgroundColor: "#ffffff",
                                            }}
                                            onClick={() =>
                                              clickArrowFilter(value.id, 1)
                                            }
                                          >
                                            {isCurrentLanguageLeftToRight ? (
                                              <NavigateNextIcon
                                                style={{ color: "#00000" }}
                                              />
                                            ) : (
                                              <NavigateBeforeIcon
                                                style={{ color: "#00000" }}
                                              />
                                            )}
                                          </Fab>
                                        ) : (
                                          <Fab
                                            size="small"
                                            style={{ visibility: "hidden" }}
                                          ></Fab>
                                        )}
                                      </Grid>
                                    </div>
                                  </div>
                                ) : (
                                  value.id !== "" && (
                                    <div
                                      className={classes.imageOverlayWrapper}
                                      onMouseOver={() =>
                                        displayFilterHover(value.mask)
                                      }
                                      onMouseLeave={hideFilterHover}
                                    >
                                      <CardMedia
                                        className={classes.imageFilter}
                                        image={value.map}
                                      />

                                      <div className={classes.imageOverlay}>
                                        <Grid
                                          container
                                          direction="row"
                                          justifyContent="space-around"
                                          alignItems="center"
                                        >
                                          <Fab
                                            size="medium"
                                            style={{
                                              backgroundColor: "#ffffff",
                                            }}
                                            onClick={(e) =>
                                              clickGifPopover(e, value.id)
                                            }
                                          >
                                            <GifIcon
                                              style={{ color: "#000000" }}
                                            />
                                          </Fab>
                                        </Grid>
                                      </div>
                                    </div>
                                  )
                                )}

                                {value.id !== "" && (
                                  <div>
                                    {value.id === "cagi_report" ? (
                                      <Box align="center" width="100%">
                                        {value.name[value.currentDisplayed]}
                                        <IconButton
                                          className={classes.margin}
                                          size="small"
                                          onClick={(e) =>
                                            handleOpenFilterExplanation(
                                              e,
                                              "cagi"
                                            )
                                          }
                                        >
                                          <HelpOutlineIcon fontSize="inherit" />
                                        </IconButton>
                                      </Box>
                                    ) : (
                                      <Box align="center" width="100%" pl={1}>
                                        {value.name}
                                        <IconButton
                                          className={classes.margin}
                                          size="small"
                                          onClick={(e) =>
                                            handleOpenFilterExplanation(
                                              e,
                                              value.id
                                            )
                                          }
                                        >
                                          <HelpOutlineIcon fontSize="inherit" />
                                        </IconButton>
                                      </Box>
                                    )}
                                  </div>
                                )}

                                <Popover
                                  id={idExpl}
                                  open={
                                    value.popover !== undefined
                                      ? value.popover
                                      : false
                                  }
                                  anchorEl={anchorFilterExplanation}
                                  onClose={handleCloseFilterExplanation}
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
                                    <Grid
                                      container
                                      direction="row"
                                      justifyContent="space-between"
                                      alignItems="stretch"
                                    >
                                      {value.id === "cagi_report" ? (
                                        <Typography variant="body1">
                                          {titleCagiPopover}
                                        </Typography>
                                      ) : (
                                        <Typography variant="body1">
                                          {value.name}
                                        </Typography>
                                      )}

                                      <CloseIcon
                                        onClick={handleCloseFilterExplanation}
                                      />
                                    </Grid>
                                    <Box m={1} />

                                    {value.id === "cagi_report" ? (
                                      <Typography variant="body2">
                                        {textCagiPopover}
                                      </Typography>
                                    ) : (
                                      <Typography
                                        variant="body2"
                                        align="justify"
                                      >
                                        {keyword("forensic_card_" + value.id)}
                                      </Typography>
                                    )}
                                  </Box>
                                </Popover>
                              </Grid>
                            );
                          })}
                        </Grid>

                        {valueTab !== 3 && (
                          <div>
                            <Box m={2} />

                            <CardMedia
                              image={MakoScale}
                              style={{
                                height: "20px",
                                transform: "scale(-1)",
                                backgroundSize: "contain",
                              }}
                            />

                            <Grid
                              container
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Grid item>
                                <Typography variant="body1">
                                  {keyword("forensic_text_nodetection")}
                                </Typography>
                              </Grid>

                              <Grid item>
                                <Typography variant="body1">
                                  {keyword("forensic_text_detection")}
                                </Typography>
                              </Grid>
                            </Grid>
                          </div>
                        )}

                        <Box m={2} />
                        <Alert
                          icon={<EmojiObjectsIcon fontSize="inherit" />}
                          severity="info"
                        >
                          {keyword("forensic_text_hoverinfo")}
                        </Alert>
                        <Box mt={2} mb={2}>
                          <Divider />
                        </Box>

                        <Box display="flex" mb={2}>
                          <Box mr={2}>
                            <InfoIcon style={{ color: "#333333" }} />
                          </Box>
                          <Box>{textDescription}</Box>
                        </Box>

                        <Box display="flex" mb={2}>
                          <Box mr={2}>
                            <CheckCircleIcon style={{ color: "#8BC34A" }} />
                          </Box>
                          <Box>{textLook}</Box>
                        </Box>

                        <Box display="flex" mb={2}>
                          <Box mr={2}>
                            <CancelIcon style={{ color: "#EB5757" }} />
                          </Box>
                          <Box>{textIgnore}</Box>
                        </Box>
                      </TabPanel>
                    );
                  })}
                </Card>
              </Grid>
            </Grid>

            <Popover
              id={gifPopover}
              open={openGifPopover}
              anchorEl={anchorGifPopover}
              onClose={closeGifPopover}
              anchorReference="anchorPosition"
              anchorPosition={{ top: 0, left: 0 }}
              PaperProps={{
                style: {
                  width: "60vw",
                  height: "70vh",
                  marginTop: "5vh",
                  marginLeft: "5vw",
                  marginBottom: "5vh",
                  marginRight: "5vw",
                  fontSize: 14,
                  justifyContent: "center",
                  alignItems: "center",
                },
              }}
              anchorOrigin={{
                vertical: "center",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "center",
                horizontal: "center",
              }}
            >
              <Box p={3}>
                <Grid
                  container
                  direction="row"
                  justifyContent="space-between"
                  alignItems="stretch"
                >
                  <Typography variant="h6" gutterBottom>
                    {keyword("forensic_title_export")}
                  </Typography>
                  <IconButton onClick={closeGifPopover}>
                    <CloseIcon />
                  </IconButton>
                </Grid>
                <Box m={2} />
                <AnimatedGif
                  toolState={gifState}
                  homoImg1={gifImage}
                  homoImg2={gifFilter}
                  isPopup={true}
                />
              </Box>
            </Popover>
          </Box>
        </ThemeProvider>
      </div>
    </div>
  );
};
export default ForensicResults;
