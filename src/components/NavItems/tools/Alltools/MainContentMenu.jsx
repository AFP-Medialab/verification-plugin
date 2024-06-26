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
  SvgIcon,
  Tab,
  Tabs,
} from "@mui/material";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import Iframe from "react-iframe";
import DialogActions from "@mui/material/DialogActions";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import MainContentMenuItem from "./MainContentMenuItem";
import ImageIcon from "../../../NavBar/images/SVG/Image/Images.svg";
import VideoIcon from "../../../NavBar/images/SVG/Video/Video.svg";
import SearchIcon from "../../../NavBar/images/SVG/Search/Search.svg";
import DataIcon from "../../../NavBar/images/SVG/DataAnalysis/Data_analysis.svg";
import { useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { Audiotrack } from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import { TOOLS_CATEGORIES } from "components/NavBar/NavBar";
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

const MainContentMenu = (props) => {
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

  const handleClick = (path, restrictions) => {
    //console.log(type);

    if (restrictions !== undefined && restrictions.includes("lock")) {
      if (userAuthenticated) {
        //console.log("LOGGED");
        handlePush(path);
      } else {
        setOpenAlert(true);
      }
    } else {
      //console.log(path);
      handlePush(path);
    }
  };

  const handlePush = (path) => {
    if (path === "csvSna" || path === "factcheck" || path === "xnetwork") {
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

  const categories = [
    {
      type: TOOLS_CATEGORIES.VIDEO,
      name: keywordNavbar(TOOLS_CATEGORIES.VIDEO),
      value: toolsVideo,
      icon: (
        <SvgIcon
          component={VideoIcon}
          sx={{
            fontSize: "40px",
          }}
          inheritViewBox
        />
      ),
    },
    {
      type: TOOLS_CATEGORIES.IMAGE,
      name: keywordNavbar(TOOLS_CATEGORIES.IMAGE),
      value: toolsImages,
      icon: (
        <SvgIcon
          component={ImageIcon}
          sx={{
            fontSize: "40px",
          }}
          inheritViewBox
        />
      ),
    },
    {
      type: TOOLS_CATEGORIES.AUDIO,
      name: keywordNavbar(TOOLS_CATEGORIES.AUDIO),
      value: toolsAudio,
      icon: <Audiotrack width="40px" height="40px" />,
    },
    {
      type: TOOLS_CATEGORIES.SEARCH,
      name: keywordNavbar(TOOLS_CATEGORIES.SEARCH),
      value: toolsSearch,
      icon: (
        <SvgIcon
          component={SearchIcon}
          sx={{
            fontSize: "40px",
          }}
          inheritViewBox
        />
      ),
    },
    {
      type: TOOLS_CATEGORIES.DATA_ANALYSIS,
      name: keywordNavbar(TOOLS_CATEGORIES.DATA_ANALYSIS),
      value: toolsData,
      icon: (
        <SvgIcon
          component={DataIcon}
          sx={{
            fontSize: "40px",
          }}
          inheritViewBox
        />
      ),
    },
    {
      type: TOOLS_CATEGORIES.OTHER,
      name: keywordNavbar(TOOLS_CATEGORIES.OTHER),
      value: otherTools,
      icon: <MoreHorizIcon width="40px" height="40px" />,
    },
  ];

  tools.forEach((value) => {
    if (value.type === TOOLS_CATEGORIES.VIDEO) {
      toolsVideo.push(value);
    }

    if (value.type === TOOLS_CATEGORIES.IMAGE) {
      toolsImages.push(value);
    }

    if (value.type === TOOLS_CATEGORIES.AUDIO) {
      toolsAudio.push(value);
    }

    if (value.type === TOOLS_CATEGORIES.SEARCH) {
      toolsSearch.push(value);
    }

    if (value.type === TOOLS_CATEGORIES.DATA_ANALYSIS) {
      toolsData.push(value);
    }

    if (value.type === TOOLS_CATEGORIES.OTHER) {
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
  const categoriesAllowedForUser = categories.filter(
    (category) => category.value.length !== 0,
  );
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
      <Card>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor={"primary"}
          variant="scrollable"
          scrollButtons="auto"
        >
          {categoriesAllowedForUser.map((category, index) => {
            //  if(category.value.length !==0){
            return (
              <Tab
                key={index}
                icon={category.icon}
                iconPosition="start"
                label={
                  <Typography
                    variant="h6"
                    style={{
                      textTransform: "capitalize",
                    }}
                  >
                    {category.name}
                  </Typography>
                }
              />
            );
            // }
          })}
        </Tabs>

        <Box m={1} />

        <div style={{ minHeight: "340px" }}>
          {categoriesAllowedForUser.map((category, index) => {
            const tools = category.value;
            //if(tools.length !==0){
            return (
              <TabPanel value={value} index={index} key={index}>
                <Grid
                  container
                  justifyContent="flex-start"
                  spacing={2}
                  className={classes.toolCardsContainer}
                >
                  {tools.map((value, key) => {
                    const element = (
                      <Grid
                        className={classes.toolCardStyle}
                        item
                        key={key}
                        onClick={() =>
                          handleClick(value.path, value.toolRestrictions)
                        }
                      >
                        <MainContentMenuItem
                          name={keyword(value.title)}
                          description={keyword(value.description)}
                          icon={value.iconColored}
                          iconsAttributes={value.icons}
                        />
                      </Grid>
                    );
                    if (value.toolRestrictions.includes("BETA_TESTER")) {
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
            );
          })}
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
export default MainContentMenu;
