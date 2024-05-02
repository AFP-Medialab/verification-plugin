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
      type: keywordNavbar("navbar_category_video"),
      value: toolsVideo,
      icon: (
        <IconVideo width="40px" height="40px" style={{ fill: "#596977" }} />
      ),
    },
    {
      type: keywordNavbar("navbar_category_image"),
      value: toolsImages,
      icon: (
        <IconImage width="40px" height="40px" style={{ fill: "#596977" }} />
      ),
    },
    {
      type: keywordNavbar("navbar_category_audio"),
      value: toolsAudio,
      icon: (
        <Audiotrack width="40px" height="40px" style={{ fill: "#596977" }} />
      ),
    },
    {
      type: keywordNavbar("navbar_category_search"),
      value: toolsSearch,
      icon: (
        <IconSearch width="40px" height="40px" style={{ fill: "#596977" }} />
      ),
    },
    {
      type: keywordNavbar("navbar_category_data"),
      value: toolsData,
      icon: <IconData width="40px" height="40px" style={{ fill: "#596977" }} />,
    },
    {
      type: keywordNavbar("navbar_category_other"),
      value: otherTools,
      icon: (
        <MoreHorizIcon width="40px" height="40px" style={{ fill: "#596977" }} />
      ),
    },
  ];

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
  const roleCategories = categories.filter(
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
          {roleCategories.map((category, index) => {
            //  if(category.value.length !==0){
            return (
              <Tab
                key={index}
                label={
                  <Box mt={1}>
                    <Grid
                      container
                      direction="row"
                      justifyContent="flex-start"
                      alignItems="center"
                    >
                      <Grid item>{category.icon}</Grid>

                      <Grid item>
                        <Box m={1} />
                      </Grid>

                      <Grid item>
                        <Typography
                          variant="h6"
                          style={{
                            color: "#596977",
                            textTransform: "capitalize",
                          }}
                        >
                          {category.type}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                }
              />
            );
            // }
          })}
        </Tabs>

        <Box m={1} />

        <div style={{ minHeight: "340px" }}>
          {roleCategories.map((category, index) => {
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
                        <ToolCard
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
export default AllTools;
