import React, { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  Grid,
  Snackbar,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import Iframe from "react-iframe";
import DialogActions from "@mui/material/DialogActions";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import ToolCard from "./ToolCard";
import IconImage from "../../../NavBar/images/SVG/Image/Images.svg";
import IconVideo from "../../../NavBar/images/SVG/Video/Video.svg";
import IconSearch from "../../../NavBar/images/SVG/Search/Search.svg";
import IconData from "../../../NavBar/images/SVG/DataAnalysis/Data_analysis.svg";
import IconTools from "../../../NavBar/images/SVG/Navbar/Tools.svg";
import LoginHeader from "../../../Shared/LoginHeader/LoginHeader";
import { useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { Audiotrack } from "@mui/icons-material";

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
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

const AllTools = (props) => {
  const navigate = useNavigate();
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Alltools");
  const keywordNavbar = i18nLoadNamespace("components/NavBar");
  const keywordWarning = i18nLoadNamespace("components/Shared/OnWarningInfo");

  const tools = props.tools;
  const [videoUrl, setVideoUrl] = useState(null);

  const userAuthenticated = useSelector(
    (state) => state.userSession && state.userSession.userAuthenticated,
  );
  const [openAlert, setOpenAlert] = React.useState(false);
  const currentLang = useSelector((state) => state.language);

  const handleClick = (path, mediaTool, restrictions) => {
    //console.log(type);

    if (restrictions !== undefined && restrictions.includes("lock")) {
      if (userAuthenticated) {
        //console.log("LOGGED");
        handlePush(path, mediaTool);
      } else {
        setOpenAlert(true);
      }
    } else {
      //console.log(path);
      handlePush(path, mediaTool);
    }
  };

  const handlePush = (path, mediaTool) => {
    if (path === "factcheck" || path === "xnetwork") {
      window.open(process.env.REACT_APP_TSNA_SERVER + path, "_blank");
    } else {
      navigate("/app/tools/" + path);
      /* history.push({
                                                          pathname: "/app/tools/" + path,
                                                          state: { media: mediaTool }
                                                      })*/
    }
  };

  //console.log(tools);

  const toolsVideo = [];
  const toolsImages = [];
  const toolsAudio = [];
  const toolsSearch = [];
  const toolsData = [];
  const otherTools = [];

  tools.forEach((value) => {
    if (value.type === keywordNavbar("navbar_category_video")) {
      toolsVideo.push(value);
    }

    if (value.type === keywordNavbar("navbar_category_image")) {
      toolsImages.push(value);
    }

    if (value.type === keywordNavbar("navbar_category_audio")) {
      toolsAudio.push(value);
    }

    if (value.type === keywordNavbar("navbar_category_search")) {
      toolsSearch.push(value);
    }

    if (value.type === keywordNavbar("navbar_category_data")) {
      toolsData.push(value);
    }

    if (value.type === keywordNavbar("navbar_category_other")) {
      otherTools.push(value);
    }
  });

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const role = useSelector((state) => state.userSession.user.roles);
  const betaTester = role.includes("BETA_TESTER");

  return (
    <>
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

      <LoginHeader
        name={keyword("navbar_tools")}
        icon={
          <IconTools width="40px" height="40px" style={{ fill: "#00926c" }} />
        }
      />

      <Card>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor={"primary"}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            label={
              <Box mt={1}>
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <Grid item>
                    <IconVideo
                      width="40px"
                      height="40px"
                      style={{ fill: "#596977" }}
                    />
                  </Grid>

                  <Grid item>
                    <Box m={1} />
                  </Grid>

                  <Grid item>
                    <Typography
                      variant="h6"
                      style={{ color: "#596977", textTransform: "capitalize" }}
                    >
                      {keyword("category_video")}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            }
          />
          <Tab
            label={
              <Box mt={1}>
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <Grid item>
                    <IconImage
                      width="40px"
                      height="40px"
                      style={{ fill: "#596977" }}
                    />
                  </Grid>

                  <Grid item>
                    <Box m={1} />
                  </Grid>

                  <Grid item>
                    <Typography
                      variant="h6"
                      style={{ color: "#596977", textTransform: "capitalize" }}
                    >
                      {keyword("category_image")}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            }
          />
          <Tab
            label={
              <Box mt={1}>
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <Grid item>
                    <Audiotrack
                      width="40px"
                      height="40px"
                      style={{ fill: "#596977" }}
                    />
                  </Grid>

                  <Grid item>
                    <Box m={1} />
                  </Grid>

                  <Grid item>
                    <Typography
                      variant="h6"
                      style={{ color: "#596977", textTransform: "capitalize" }}
                    >
                      {keyword("category_audio")}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            }
          />
          <Tab
            label={
              <Box mt={1}>
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <Grid item>
                    <IconSearch
                      width="40px"
                      height="40px"
                      style={{ fill: "#596977" }}
                    />
                  </Grid>

                  <Grid item>
                    <Box m={1} />
                  </Grid>

                  <Grid item>
                    <Typography
                      variant="h6"
                      style={{ color: "#596977", textTransform: "capitalize" }}
                    >
                      {keyword("category_search")}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            }
          />
          <Tab
            label={
              <Box mt={1}>
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <Grid item>
                    <IconData
                      width="40px"
                      height="40px"
                      style={{ fill: "#596977" }}
                    />
                  </Grid>

                  <Grid item>
                    <Box m={1} />
                  </Grid>

                  <Grid item>
                    <Typography
                      variant="h6"
                      style={{ color: "#596977", textTransform: "capitalize" }}
                    >
                      {keyword("category_data")}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            }
          />
          <Tab
            label={
              <Box mt={1}>
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <Grid item>
                    <MoreHorizIcon
                      width="40px"
                      height="40px"
                      style={{ fill: "#596977" }}
                    />
                  </Grid>

                  <Grid item>
                    <Box m={1} />
                  </Grid>

                  <Grid item>
                    <Typography
                      variant="h6"
                      style={{ color: "#596977", textTransform: "capitalize" }}
                    >
                      {keyword("category_other")}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            }
          />
        </Tabs>

        <Box m={1} />

        <div style={{ minHeight: "340px" }}>
          <TabPanel value={value} index={0}>
            <Grid
              container
              justifyContent="flex-start"
              spacing={2}
              className={classes.toolCardsContainer}
            >
              {toolsVideo.map((value, key) => {
                const element = (
                  <Grid
                    className={classes.toolCardStyle}
                    item
                    key={key}
                    onClick={() =>
                      handleClick(value.path, "video", value.toolRestrictions)
                    }
                  >
                    <ToolCard
                      name={keyword(value.title)}
                      description={keyword(value.description)}
                      icon={value.iconColored}
                      iconsAttributes={value.icons}
                      path="../../../NavBar/images/SVG/Image/Gif.svg"
                    />
                  </Grid>
                );
                //console.log(value);
                if (value.toolRestrictions.includes("beta")) {
                  if (betaTester) {
                    return element;
                  } else {
                    return null;
                  }
                } else {
                  return element;
                }
              })}
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Grid
              container
              justifyContent="flex-start"
              spacing={2}
              className={classes.toolCardsContainer}
            >
              {toolsImages.map((value, key) => {
                const element = (
                  <Grid
                    className={classes.toolCardStyle}
                    item
                    key={key}
                    onClick={() =>
                      handleClick(value.path, "image", value.toolRestrictions)
                    }
                  >
                    <ToolCard
                      name={keyword(value.title)}
                      description={keyword(value.description)}
                      icon={value.iconColored}
                      iconsAttributes={value.icons}
                    />
                  </Grid>
                );
                //console.log(value);
                if (value.toolRestrictions.includes("beta")) {
                  if (betaTester) {
                    return element;
                  } else {
                    return null;
                  }
                } else {
                  return element;
                }
              })}
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Grid
              container
              justifyContent="flex-start"
              spacing={2}
              className={classes.toolCardsContainer}
            >
              {toolsAudio.map((value, key) => {
                const element = (
                  <Grid
                    className={classes.toolCardStyle}
                    item
                    key={key}
                    onClick={() =>
                      handleClick(value.path, "audio", value.toolRestrictions)
                    }
                  >
                    <ToolCard
                      name={keyword(value.title)}
                      description={keyword(value.description)}
                      icon={value.iconColored}
                      iconsAttributes={value.icons}
                    />
                  </Grid>
                );
                //console.log(value);
                if (value.toolRestrictions.includes("beta")) {
                  if (betaTester) {
                    return element;
                  } else {
                    return null;
                  }
                } else {
                  return element;
                }
              })}
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={3}>
            <Grid
              container
              justifyContent="flex-start"
              spacing={2}
              className={classes.toolCardsContainer}
            >
              {toolsSearch.map((value, key) => {
                const element = (
                  <Grid
                    className={classes.toolCardStyle}
                    item
                    key={key}
                    onClick={() =>
                      handleClick(value.path, "search", value.toolRestrictions)
                    }
                  >
                    <ToolCard
                      name={keyword(value.title)}
                      description={keyword(value.description)}
                      icon={value.iconColored}
                      iconsAttributes={value.icons}
                    />
                  </Grid>
                );
                if (value.toolRestrictions.includes("beta")) {
                  if (betaTester) {
                    return element;
                  } else {
                    return null;
                  }
                } else {
                  return element;
                }
              })}
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={4}>
            <Grid
              container
              justifyContent="flex-start"
              spacing={2}
              className={classes.toolCardsContainer}
            >
              {toolsData.map((value, key) => {
                let element;
                if (value.title === "navbar_twitter_crowdtangle") {
                  element = (
                    <Grid
                      className={classes.toolCardStyle}
                      item
                      key={key}
                      onClick={() =>
                        window.open(
                          process.env.REACT_APP_TSNA_SERVER +
                            "csvSna?lang=" +
                            currentLang,
                          "_blank",
                        )
                      }
                    >
                      <ToolCard
                        name={keyword(value.title)}
                        description={keyword(value.description)}
                        icon={value.iconColored}
                        iconsAttributes={value.icons}
                      />
                    </Grid>
                  );
                } else {
                  element = (
                    <Grid
                      className={classes.toolCardStyle}
                      item
                      key={key}
                      onClick={() =>
                        handleClick(value.path, "data", value.toolRestrictions)
                      }
                    >
                      <ToolCard
                        name={keyword(value.title)}
                        description={keyword(value.description)}
                        icon={value.iconColored}
                        iconsAttributes={value.icons}
                      />
                    </Grid>
                  );
                }

                if (value.toolRestrictions.includes("beta")) {
                  if (betaTester) {
                    return element;
                  } else {
                    return null;
                  }
                } else {
                  return element;
                }
              })}
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={5}>
            <Grid
              container
              justifyContent="flex-start"
              spacing={2}
              className={classes.toolCardsContainer}
            >
              {otherTools.map((value, key) => {
                const element = (
                  <Grid
                    className={classes.toolCardStyle}
                    item
                    key={key}
                    onClick={() =>
                      handleClick(value.path, "data", value.toolRestrictions)
                    }
                  >
                    <ToolCard
                      name={keyword(value.title)}
                      description={keyword(value.description)}
                      icon={value.iconColored}
                      iconsAttributes={value.icons}
                    />
                  </Grid>
                );

                if (value.toolRestrictions.includes("beta")) {
                  if (betaTester) {
                    return element;
                  } else {
                    return null;
                  }
                } else {
                  return element;
                }
              })}
            </Grid>
          </TabPanel>
        </div>
      </Card>

      <Box m={3} />

      <Box m={4} />

      <Dialog
        height={"400px"}
        fullWidth
        maxWidth={"md"}
        open={videoUrl !== null}
        onClose={() => setVideoUrl(null)}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogContent>
          <Iframe
            frameBorder="0"
            url={videoUrl}
            allow="fullscreen"
            height="400"
            width="100%"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVideoUrl(null)} color="primary">
            {keyword("close")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default AllTools;
