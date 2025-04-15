import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Divider from "@mui/material/Divider";
import Fab from "@mui/material/Fab";
import Fade from "@mui/material/Fade";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Snackbar from "@mui/material/Snackbar";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import GifIcon from "@mui/icons-material/Gif";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import InfoIcon from "@mui/icons-material/Info";
import LinkIcon from "@mui/icons-material/Link";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import WarningIcon from "@mui/icons-material/Warning";

import { DetectionProgressBar } from "components/Shared/DetectionProgressBar/DetectionProgressBar";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

import { ROLES } from "../../../../../constants/roles";
import { setForensicImageRatio } from "../../../../../redux/actions/tools/forensicActions";
import {
  setStateBackResults,
  setStateInit,
} from "../../../../../redux/reducers/tools/gifReducer";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";
import AnimatedGif from "../../Gif/AnimatedGif";
import ImageCanvas from "../components/imageCanvas/imageCanvas";

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
        <Box
          sx={{
            p: 3,
          }}
        >
          <Typography component="span">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const ForensicResults = (props) => {
  const dispatch = useDispatch();
  const displayItem = useSelector((state) => state.forensic.displayItem);
  const theme = createTheme({
    components: {
      MuiCardHeader: {
        styleOverrides: {
          title: {
            fontSize: 20,
            fontWeight: 500,
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
        light: "#00926c",
        main: "#00926c",
        dark: "#00926c",
        contrastText: "#fff",
      },
    },
  });

  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Forensic");
  const keywordWarning = i18nLoadNamespace("components/Shared/OnWarningInfo");
  const results = props.result;

  const userAuthenticated = useSelector(
    (state) => state.userSession && state.userSession.userAuthenticated,
  );
  const role = useSelector((state) => state.userSession.user.roles);
  const [openAlert, setOpenAlert] = React.useState(false);

  const defaultFilterProps = {
    filtersIDs: [
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
    ],
    idStartCompression: 0,
    idStartNoise: 6,
    idStartDeepLearning: 9,
    idStartCloning: 11,
    idStartLenses: 13,
  };

  const extraFeaturesFilterProps = {
    filtersIDs: [
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
      "mmfusion_report", //11
      "trufor_report", //12
      "omgfuser_report", //13

      //CLONING
      "cmfd_report", //14
      "rcmfd_report", //15

      //LENSES

      "ela_report", //16
      "laplacian_report", //17
      "median_report", //18
    ],
    idStartCompression: 0,
    idStartNoise: 6,
    idStartDeepLearning: 9,
    idStartCloning: 14,
    idStartLenses: 16,
  };

  //SHOULD BE REWRITE
  const filtersProp =
    role.includes(ROLES.EXTRA_FEATURE) || role.includes(ROLES.EVALUATION)
      ? extraFeaturesFilterProps
      : defaultFilterProps;

  const filters = useRef(
    filtersProp.filtersIDs.map((value) => {
      let filter;
      if (!results || !results[value] || !results[value].completed) {
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
          map: [results[value]["forgery_array"]],
          currentDisplayed: 0,
          arrows: [false, false],
          mask: [results[value]["forgery_array"]],
          popover: false,
        };

        //GHOST
      } else if (value === "ghost_report") {
        filter = {
          id: value,
          name: keyword("forensic_title_" + value),
          map: results[value]["arrays"],
          currentDisplayed: 0,
          arrows: [false, false],
          mask: results[value]["arrays"],
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
            results[value]["cagiNormalReport"]["array"],
            results[value]["cagiInversedReport"]["array"],
          ],
          currentDisplayed: 0,
          arrows: [false, false],
          mask: [
            results[value]["cagiNormalReport"]["array"],
            results[value]["cagiInversedReport"]["array"],
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
      } else if (value === "cmfd_report") {
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
      } else if (value === "trufor_report" || value === "omgfuser_report") {
        filter = {
          id: value,
          name: keyword("forensic_title_" + value),
          map: results[value]["array"],
          mask: results[value]["array"],
          popover: false,
          score: results[value]["score"],
        };
      } else {
        filter = {
          id: value,
          name: keyword("forensic_title_" + value),
          map: results[value]["array"],
          mask: results[value]["array"],
          popover: false,
        };
      }

      return filter;
    }),
  );
  const tabs = [0, 1, 2, 3];

  //Hover effect of the filters
  //============================================================================================
  const [filterHoverEnabled, setFilterHoverEnabled] = React.useState(false);
  const [filterSelected, setFilterSelected] = useState(null);
  const [filterHover, setFilterHover] = useState(displayItem);
  const [isHoveredFilterInverted, setIsHoveredFilterInverted] = useState(false);

  const [applyColorScale, setApplyColorScale] = useState(false);

  function displayFilterHover(map) {
    setFilterHover(map);
    setFilterHoverEnabled(true);
  }

  /**
   * Returns true if the given filter is using an inverted grayscale to show detection (black means 100% detection)
   * @param filter {Object} The filter to verify for
   * @param filter.id {string} The filter name
   * @param filter.currentDisplayed {number} The current filter displayed in the UI if the filter has multiple masks
   * @returns {boolean}
   */
  const isFilterUsingAnInvertedScale = (filter) => {
    if (!filter) return false;

    return filter.id === "cagi_report" && filter.currentDisplayed === 1;
  };

  /**
   * Returns true if the filter is using a grayscale detection mask for which we need to compute the new color scale
   * @param filter {object} The filter to verify for
   * @returns {boolean}
   */
  const isFilterUsingColorScale = (filter) => {
    return !(
      filter.id === "ela_report" ||
      filter.id === "laplacian_report" ||
      filter.id === "median_report" ||
      filter.id === "rcmfd_report" ||
      filter.id === "cmfd_report"
    );
  };

  useEffect(() => {
    if (!filterSelected) return;

    setIsHoveredFilterInverted(isFilterUsingAnInvertedScale(filterSelected));

    setApplyColorScale(isFilterUsingColorScale(filterSelected));
  }, [filterSelected]);

  function hideFilterHover() {
    setFilterHoverEnabled(false);
  }

  //Button analyze new image
  //============================================================================================
  function newImage() {
    props.onClose();
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
    const arrows = [false, false];
    const filterData = filters.current.find((x) => x.id === filter);
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

    setFilterSelected(filters.current.find((x) => x.id === filter));

    filterSelected.id === "cagi_report" && filterSelected.currentDisplayed === 1
      ? setIsHoveredFilterInverted(true)
      : setIsHoveredFilterInverted(false);

    displayFilterHover(
      filters.current.find((x) => x.id === filter).mask[
        filters.current.find((x) => x.id === filter).currentDisplayed
      ],
    );
  }

  //Gif popover
  //============================================================================================
  const [anchorGifPopover, setAnchorGifPopover] = React.useState(false);
  const openGifPopover = Boolean(anchorGifPopover);
  const gifPopover = openGifPopover ? "simple-popover" : undefined;
  const [gifFilter, setGifFilter] = React.useState(displayItem);

  //const [interval, setIntervalVar] = React.useState(null);

  const gifState = useSelector((state) => state.gif.toolState);

  //const [gifToolState, setgifToolState] = useState(1)

  function clickGifPopover(event, filter) {
    if (userAuthenticated) {
      if (
        filter === "zero_report" ||
        filter === "ghost_report" ||
        filter === "cagi_report"
      ) {
        const url = filters.current.find((x) => x.id === filter).mask[
          filters.current.find((x) => x.id === filter).currentDisplayed
        ];
        setGifFilter(url);
        //setReadyTransparency(true);
      } else {
        const url = filters.current.find((x) => x.id === filter).mask;
        setGifFilter(url);
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
    dispatch(setStateInit());
    setAnchorGifPopover(false);
    //setReadyTransparency(false);
  }

  const imageDisplayed = displayItem;

  //tabs
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
          filters.current.find((x) => x.id === "cagi_report").name[0],
        );
      } else {
        setTextCagiPopover(keyword("forensic_card_cagiInversed"));
        setTitleCagiPopover(
          filters.current.find((x) => x.id === "cagi_report").name[1],
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
  }, []);

  const currentLang = useSelector((state) => state.language);
  const isCurrentLanguageLeftToRight = currentLang !== "ar";

  const submittedImageRef = useRef();

  useEffect(() => {
    if (
      !submittedImageRef.current.naturalWidth ||
      !submittedImageRef.current.naturalHeight
    ) {
      return;
    }

    dispatch(
      setForensicImageRatio(
        submittedImageRef.current.naturalWidth /
          submittedImageRef.current.naturalHeight,
      ),
    );
  }, [submittedImageRef.current]);

  return (
    <div>
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        sx={{ mr: 8 }}
      >
        <Alert onClose={handleCloseAlert} severity="warning">
          {keywordWarning("warning_advanced_tools")}
        </Alert>
      </Snackbar>
      <div className={classes.newForensics}>
        <ThemeProvider theme={theme}>
          <Box
            sx={{
              mt: 5,
              mb: 5,
            }}
          >
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
                size={{ xs: 6 }}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <Card variant="outlined">
                  <CardHeader
                    title={
                      <Grid
                        container
                        direction="row"
                        sx={{
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Grid>
                          <span>{keyword("forensic_title_image")}</span>
                        </Grid>

                        <Grid size="grow">
                          <Box
                            sx={{
                              ml: 2,
                            }}
                          >
                            <IconButton
                              style={{ color: "white", padding: "0" }}
                              component="span"
                              onClick={handleClickCopyURL}
                            >
                              <LinkIcon />
                            </IconButton>
                          </Box>
                        </Grid>

                        <Grid>
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
                    className={classes.headerUploadedImage}
                  />

                  <div className={classes.wrapperImageFilter}>
                    {
                      <CardMedia
                        ref={submittedImageRef}
                        crossOrigin={"anonymous"}
                        component="img"
                        className={classes.imageUploaded}
                        image={imageDisplayed}
                      />
                    }
                    <Fade in={filterHoverEnabled} timeout={500}>
                      <Box className={classes.filterDisplayedClass}>
                        <ImageCanvas
                          className={classes.filterDisplayedClass}
                          imgSrc={filterHover}
                          isGrayscaleInverted={isHoveredFilterInverted}
                          applyColorScale={applyColorScale}
                          threshold={127}
                        />
                      </Box>
                    </Fade>
                  </div>
                </Card>

                <Box
                  sx={{
                    mt: 3,
                  }}
                ></Box>

                <Card variant="outlined" className={classes.lensesCard}>
                  <CardHeader
                    title={
                      <Grid
                        container
                        direction="row"
                        sx={{
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
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
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "center",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "center",
                          }}
                          slotProps={{
                            paper: {
                              style: {
                                width: "300px",
                                fontSize: 14,
                              },
                            },
                          }}
                        >
                          <Box
                            sx={{
                              p: 3,
                            }}
                          >
                            <Grid
                              container
                              direction="row"
                              sx={{
                                justifyContent: "space-between",
                                alignItems: "stretch",
                              }}
                            >
                              <Typography variant="h6" gutterBottom>
                                {keyword("forensic_title_what")}
                              </Typography>

                              <CloseIcon onClick={closeHelpLenses} />
                            </Grid>

                            <Box
                              sx={{
                                m: 1,
                              }}
                            />
                            <Typography variant="body2">
                              {keyword("forensic_lenses_explanation")}
                            </Typography>
                          </Box>
                        </Popover>
                      </Grid>
                    }
                  />

                  <Box
                    sx={{
                      p: 3,
                    }}
                  >
                    <Grid container spacing={3}>
                      {filters.current
                        .slice(filtersProp.idStartLenses)
                        .map((value, key) => {
                          return (
                            <Grid key={key} size={{ xs: 4 }}>
                              <ImageCanvas
                                className={classes.imageFilter}
                                imgSrc={value.map}
                                isGrayscaleInverted={false}
                                applyColorScale={false}
                                threshold={0}
                                onMouseOver={() => {
                                  displayFilterHover(value.map);
                                  setFilterSelected(value);
                                }}
                                onMouseLeave={() => {
                                  hideFilterHover();
                                  // setFilterSelected(null);
                                }}
                              />
                              <Box
                                align="center"
                                className={classes.lensesTitles}
                                sx={{
                                  width: "100%",
                                }}
                              >
                                {keyword("forensic_title_" + value.id)}
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
                                  anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "center",
                                  }}
                                  transformOrigin={{
                                    vertical: "top",
                                    horizontal: "center",
                                  }}
                                  slotProps={{
                                    paper: {
                                      style: {
                                        width: "300px",
                                        fontSize: 14,
                                      },
                                    },
                                  }}
                                >
                                  <Box
                                    sx={{
                                      p: 3,
                                    }}
                                  >
                                    <Grid
                                      container
                                      direction="row"
                                      sx={{
                                        justifyContent: "space-between",
                                        alignItems: "stretch",
                                      }}
                                    >
                                      <Typography variant="body1">
                                        {keyword("forensic_title_" + value.id)}
                                      </Typography>

                                      <CloseIcon
                                        onClick={handleCloseFilterExplanation}
                                      />
                                    </Grid>
                                    <Box
                                      sx={{
                                        m: 1,
                                      }}
                                    />

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

              <Grid size={{ xs: 6 }}>
                <Card variant="outlined" className={classes.cardFilters}>
                  <CardHeader
                    title={
                      <Grid
                        container
                        direction="row"
                        sx={{
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
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
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "center",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "center",
                          }}
                          slotProps={{
                            paper: {
                              style: {
                                width: "300px",
                                fontSize: 14,
                              },
                            },
                          }}
                        >
                          <Box
                            sx={{
                              p: 3,
                            }}
                          >
                            <Grid
                              container
                              direction="row"
                              sx={{
                                justifyContent: "space-between",
                                alignItems: "stretch",
                              }}
                            >
                              <Typography variant="h6" gutterBottom>
                                {keyword("forensic_title_what")}
                              </Typography>

                              <CloseIcon onClick={closeHelpFilters} />
                            </Grid>
                            <Box
                              sx={{
                                m: 1,
                              }}
                            />
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
                    variant="scrollable"
                    onChange={handleChange}
                    indicatorColor={"primary"}
                  >
                    <Tab label={keyword("forensic_family_compression_title")} />
                    <Tab label={keyword("forensic_family_noise_title")} />
                    <Tab label={keyword("forensic_family_ai_title")} />
                    <Tab label={keyword("forensic_family_cloning_title")} />
                  </Tabs>

                  {tabs.map((valueTab, keyTab) => {
                    let filtersTab;
                    let textDescription;
                    let textLook;
                    let textIgnore;

                    if (valueTab === 0) {
                      filtersTab = filters.current.slice(
                        filtersProp.idStartCompression,
                        filtersProp.idStartNoise,
                      );
                      textDescription = keyword(
                        "forensic_family_compression_description",
                      );
                      textLook = keyword("forensic_family_compression_look");
                      textIgnore = keyword(
                        "forensic_family_compression_ignore",
                      );
                    } else if (valueTab === 1) {
                      filtersTab = filters.current.slice(
                        filtersProp.idStartNoise,
                        filtersProp.idStartDeepLearning,
                      );
                      textDescription = keyword(
                        "forensic_family_noise_description",
                      );
                      textLook = keyword("forensic_family_noise_look");
                      textIgnore = keyword("forensic_family_noise_ignore");
                    } else if (valueTab === 2) {
                      filtersTab = filters.current.slice(
                        filtersProp.idStartDeepLearning,
                        filtersProp.idStartCloning,
                      );
                      textDescription = keyword(
                        "forensic_family_ai_description",
                      );
                      textLook = keyword("forensic_family_ai_look");
                      textIgnore = keyword("forensic_family_ai_ignore");
                    } else {
                      filtersTab = filters.current.slice(
                        filtersProp.idStartCloning,
                        filtersProp.idStartLenses,
                      );
                      textDescription = keyword(
                        "forensic_family_cloning_description",
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
                            return (
                              <Grid key={key} size={{ xs: 4 }}>
                                {value.id === "zero_report" ||
                                value.id === "ghost_report" ||
                                value.id === "cagi_report" ? (
                                  <div
                                    className={classes.imageOverlayWrapper}
                                    onMouseOver={() => {
                                      displayFilterHover(
                                        value.mask[value.currentDisplayed],
                                      );
                                      setFilterSelected(value);
                                    }}
                                    onMouseLeave={hideFilterHover}
                                  >
                                    <ImageCanvas
                                      className={classes.imageFilter}
                                      imgSrc={value.map[value.currentDisplayed]}
                                      isGrayscaleInverted={isFilterUsingAnInvertedScale(
                                        value,
                                      )}
                                      applyColorScale={isFilterUsingColorScale(
                                        value,
                                      )}
                                      threshold={0}
                                    />
                                    <div className={classes.imageOverlay}>
                                      <Grid
                                        container
                                        direction="row"
                                        sx={{
                                          justifyContent: "space-around",
                                          alignItems: "center",
                                          width: "100%",
                                        }}
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
                                                sx={{
                                                  color: "black",
                                                }}
                                              />
                                            ) : (
                                              <NavigateNextIcon
                                                sx={{
                                                  color: "black",
                                                }}
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
                                                sx={{ color: "black" }}
                                              />
                                            ) : (
                                              <NavigateBeforeIcon
                                                sx={{ color: "black" }}
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
                                      onMouseOver={() => {
                                        displayFilterHover(value.mask);
                                        setFilterSelected(value);
                                      }}
                                      onMouseLeave={hideFilterHover}
                                    >
                                      <ImageCanvas
                                        className={classes.imageFilter}
                                        imgSrc={value.map}
                                        isGrayscaleInverted={false}
                                        applyColorScale={isFilterUsingColorScale(
                                          value,
                                        )}
                                        threshold={0}
                                      />
                                      <div className={classes.imageOverlay}>
                                        <Grid
                                          container
                                          direction="row"
                                          sx={{
                                            justifyContent: "space-around",
                                            alignItems: "center",
                                            width: "100%",
                                          }}
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
                                      <Box
                                        align="center"
                                        sx={{
                                          width: "100%",
                                        }}
                                      >
                                        {value.name[value.currentDisplayed]}
                                        <IconButton
                                          className={classes.margin}
                                          size="small"
                                          onClick={(e) =>
                                            handleOpenFilterExplanation(
                                              e,
                                              "cagi",
                                            )
                                          }
                                        >
                                          <HelpOutlineIcon fontSize="inherit" />
                                        </IconButton>
                                      </Box>
                                    ) : (
                                      <Box
                                        align="center"
                                        sx={{
                                          width: "100%",
                                          pl: 1,
                                        }}
                                      >
                                        {keyword("forensic_title_" + value.id)}
                                        <IconButton
                                          className={classes.margin}
                                          size="small"
                                          onClick={(e) =>
                                            handleOpenFilterExplanation(
                                              e,
                                              value.id,
                                            )
                                          }
                                        >
                                          <HelpOutlineIcon fontSize="inherit" />
                                        </IconButton>
                                      </Box>
                                    )}
                                    {value.score && (
                                      <Box
                                        align="center"
                                        sx={{
                                          width: "100%",
                                          pl: 1,
                                        }}
                                      >
                                        {keyword("forensic_score") +
                                          ": " +
                                          (value.score * 100).toPrecision(2) +
                                          " %"}
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
                                  anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "center",
                                  }}
                                  transformOrigin={{
                                    vertical: "top",
                                    horizontal: "center",
                                  }}
                                  slotProps={{
                                    paper: {
                                      style: {
                                        width: "300px",
                                        fontSize: 14,
                                      },
                                    },
                                  }}
                                >
                                  <Box
                                    sx={{
                                      p: 3,
                                    }}
                                  >
                                    <Grid
                                      container
                                      direction="row"
                                      sx={{
                                        justifyContent: "space-between",
                                        alignItems: "stretch",
                                      }}
                                    >
                                      {value.id === "cagi_report" ? (
                                        <Typography variant="body1">
                                          {titleCagiPopover}
                                        </Typography>
                                      ) : (
                                        <Typography variant="body1">
                                          {keyword(
                                            "forensic_title_" + value.id,
                                          )}
                                        </Typography>
                                      )}

                                      <CloseIcon
                                        onClick={handleCloseFilterExplanation}
                                      />
                                    </Grid>
                                    <Box
                                      sx={{
                                        m: 1,
                                      }}
                                    />

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
                        {valueTab !== 3 && <DetectionProgressBar />}
                        <Box
                          sx={{
                            m: 2,
                          }}
                        />
                        <Alert
                          icon={<EmojiObjectsIcon fontSize="inherit" />}
                          severity="info"
                        >
                          {keyword("forensic_text_hoverinfo")}
                        </Alert>
                        <Box
                          sx={{
                            mt: 2,
                            mb: 2,
                          }}
                        >
                          <Divider />
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              mr: 2,
                            }}
                          >
                            <InfoIcon style={{ color: "#333333" }} />
                          </Box>
                          <Box>{textDescription}</Box>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              mr: 2,
                            }}
                          >
                            <CheckCircleIcon style={{ color: "#8BC34A" }} />
                          </Box>
                          <Box>{textLook}</Box>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              mr: 2,
                            }}
                          >
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
              anchorOrigin={{
                vertical: "center",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "center",
                horizontal: "center",
              }}
              slotProps={{
                paper: {
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
                },
              }}
            >
              <Box
                sx={{
                  p: 3,
                }}
              >
                <Grid
                  container
                  direction="row"
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "stretch",
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    {keyword("forensic_title_export")}
                  </Typography>
                  <IconButton onClick={closeGifPopover}>
                    <CloseIcon />
                  </IconButton>
                </Grid>
                <Box
                  sx={{
                    m: 2,
                  }}
                />
                <AnimatedGif
                  toolState={gifState}
                  homoImg1={imageDisplayed}
                  homoImg2={gifFilter}
                  isPopup={true}
                  isCanvas={true}
                  isGrayscaleInverted={isHoveredFilterInverted}
                  applyColorScale={applyColorScale}
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
