import React, { useState } from "react";
import Iframe from "react-iframe";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import SvgIcon from "@mui/material/SvgIcon";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";

import { Audiotrack } from "@mui/icons-material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import { ROLES } from "@/constants/roles";
import { TOOLS_CATEGORIES, canUserSeeTool, tools } from "@/constants/tools";
import { selectToolTab } from "@/redux/reducers/toolTabSelectedReducer";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";

import DataIcon from "../../../NavBar/images/SVG/DataAnalysis/Data_analysis.svg";
import ImageIcon from "../../../NavBar/images/SVG/Image/Images.svg";
import SearchIcon from "../../../NavBar/images/SVG/Search/Search.svg";
import VideoIcon from "../../../NavBar/images/SVG/Video/Video.svg";
import ToolsMenuItem from "./ToolsMenuItem";

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
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

/**
 *
 * @returns {Element}
 * @constructor
 */
const ToolsMenu = () => {
  const navigate = useNavigate();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Alltools");
  const keywordNavbar = i18nLoadNamespace("components/NavBar");
  const keywordWarning = i18nLoadNamespace("components/Shared/OnWarningInfo");

  const [videoUrl, setVideoUrl] = useState(null);

  const dispatch = useDispatch();

  const userAuthenticated = useSelector(
    (state) => state.userSession && state.userSession.userAuthenticated,
  );

  const role = useSelector((state) => state.userSession.user.roles);

  const tabSelected = useSelector((state) => state.toolTabSelected);

  const betaTester = role.includes("BETA_TESTER");

  const [openAlert, setOpenAlert] = React.useState(false);

  const handleClick = (path, rolesNeeded) => {
    if (rolesNeeded && rolesNeeded.includes(ROLES.REGISTERED_USER)) {
      if (userAuthenticated) {
        handlePush(path);
      } else {
        setOpenAlert(true);
      }
    } else {
      handlePush(path);
    }
  };

  const handlePush = (path) => {
    if (path === "csvSna" || path === "factcheck" || path === "xnetwork") {
      window.open(import.meta.env.VITE_TSNA_SERVER + path, "_blank");
    } else if (path === "disinfoDeck") {
      window.open(import.meta.env.VITE_DISINFO_DECK_SERVER, "_blank");
    } else {
      navigate("/app/tools/" + path);
    }
  };

  //TODO: Move this code somewhere else so that the component is easier to reuse

  /**
   *
   * @type {Tool[]}
   */
  const toolsVideo = [];

  /**
   *
   * @type {Tool[]}
   */
  const toolsImages = [];

  /**
   *
   * @type {Tool[]}
   */
  const toolsAudio = [];

  /**
   *
   * @type {Tool[]}
   */
  const toolsSearch = [];

  /**
   *
   * @type {Tool[]}
   */
  const toolsData = [];

  /**
   *
   * @type {Tool[]}
   */
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
            fontSize: "24px",
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
            fontSize: "24px",
          }}
          inheritViewBox
        />
      ),
    },
    {
      type: TOOLS_CATEGORIES.AUDIO,
      name: keywordNavbar(TOOLS_CATEGORIES.AUDIO),
      value: toolsAudio,
      icon: <Audiotrack width="24px" height="24px" />,
    },
    {
      type: TOOLS_CATEGORIES.SEARCH,
      name: keywordNavbar(TOOLS_CATEGORIES.SEARCH),
      value: toolsSearch,
      icon: (
        <SvgIcon
          component={SearchIcon}
          sx={{
            fontSize: "24px",
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
            fontSize: "24px",
          }}
          inheritViewBox
        />
      ),
    },
    {
      type: TOOLS_CATEGORIES.OTHER,
      name: keywordNavbar(TOOLS_CATEGORIES.OTHER),
      value: otherTools,
      icon: <MoreHorizIcon width="24px" height="24px" />,
    },
  ];

  tools.forEach((tool) => {
    if (
      tool.category === TOOLS_CATEGORIES.VIDEO &&
      canUserSeeTool(tool, role, userAuthenticated)
    ) {
      toolsVideo.push(tool);
    }

    if (
      tool.category === TOOLS_CATEGORIES.IMAGE &&
      canUserSeeTool(tool, role, userAuthenticated)
    ) {
      toolsImages.push(tool);
    }

    if (
      tool.category === TOOLS_CATEGORIES.AUDIO &&
      canUserSeeTool(tool, role, userAuthenticated)
    ) {
      toolsAudio.push(tool);
    }

    if (
      tool.category === TOOLS_CATEGORIES.SEARCH &&
      canUserSeeTool(tool, role, userAuthenticated)
    ) {
      toolsSearch.push(tool);
    }

    if (
      tool.category === TOOLS_CATEGORIES.DATA_ANALYSIS &&
      canUserSeeTool(tool, role, userAuthenticated)
    ) {
      toolsData.push(tool);
    }

    if (
      tool.category === TOOLS_CATEGORIES.OTHER &&
      canUserSeeTool(tool, role, userAuthenticated)
    ) {
      otherTools.push(tool);
    }
  });

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };

  const handleChange = (event, newValue) => {
    dispatch(selectToolTab(newValue));
  };

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
      <Card variant="outlined">
        <Tabs
          value={tabSelected}
          onChange={handleChange}
          indicatorColor={"primary"}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
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
                    style={{
                      textTransform: "capitalize",
                    }}
                  >
                    {category.name}
                  </Typography>
                }
              />
            );
          })}
        </Tabs>

        <Box sx={{ m: 1 }} />

        <Box sx={{ minHeight: "55vh" }}>
          {categoriesAllowedForUser.map((category, index) => {
            const tools = category.value;

            return (
              <TabPanel value={tabSelected} index={index} key={index}>
                <Grid
                  container
                  sx={{
                    justifyContent: "flex-start",
                    alignItems: "stretch",
                  }}
                  spacing={2}
                >
                  {tools.map((tool, key) => {
                    const element = (
                      <Grid
                        size={{ xs: 4, lg: 3 }}
                        key={key}
                        sx={{
                          minWidth: "200px",
                        }}
                      >
                        <ToolsMenuItem
                          tool={tool}
                          onClick={() =>
                            handleClick(tool.path, tool.rolesNeeded)
                          }
                          key={key}
                        />
                      </Grid>
                    );
                    if (
                      tool.rolesNeeded &&
                      tool.rolesNeeded.includes("BETA_TESTER")
                    ) {
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
        </Box>
      </Card>
      <Box sx={{ m: 3 }} />
      <Box sx={{ m: 4 }} />
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
export default ToolsMenu;
