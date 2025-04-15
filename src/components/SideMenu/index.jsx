import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import {
  Audiotrack,
  ChevronLeft,
  ChevronRight,
  ExpandLess,
  ExpandMore,
  MoreHoriz,
} from "@mui/icons-material";

import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import clsx from "clsx";

import { ROLES } from "../../constants/roles";
import {
  TOOLS_CATEGORIES,
  TOOL_GROUPS,
  TOOL_STATUS_ICON,
  canUserSeeTool,
  toolsHome,
} from "../../constants/tools";
import { TOP_MENU_ITEMS } from "../../constants/topMenuItems";
import { selectTopMenuItem } from "../../redux/reducers/navReducer";
import { selectTool } from "../../redux/reducers/tools/toolReducer";
import DataIcon from "../NavBar/images/SVG/DataAnalysis/Data_analysis.svg";
import ImageIcon from "../NavBar/images/SVG/Image/Images.svg";
import SearchIcon from "../NavBar/images/SVG/Search/Search.svg";
import VideoIcon from "../NavBar/images/SVG/Video/Video.svg";
import useMyStyles from "../Shared/MaterialUiStyles/useMyStyles";
import SideMenuElement from "./sideMenuElement";

const SideMenu = ({ tools, setOpenAlert }) => {
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavBar");

  const topMenuItemSelected = useSelector((state) => state.nav);
  const selectedToolTitleKeyword = useSelector((state) => state.tool.toolName);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const role = useSelector((state) => state.userSession.user.roles);

  useEffect(() => {
    //Set the redux state if the tool was opened from URL
    const pathArr = window.location.href.split("/");

    const lastNonEmptyPath = pathArr[pathArr.length - 1]
      ? pathArr[pathArr.length - 1]
      : pathArr[pathArr.length - 2];

    const path = lastNonEmptyPath.split("?")[0];

    let toolWithPath = tools.find((tool) => tool.path === path);

    if (toolWithPath) {
      if (!canUserSeeTool(toolWithPath, role, userAuthenticated)) {
        toolWithPath = toolsHome;

        const url = new URL(
          `/popup.html#/app/${toolsHome.path}`,
          window.location.href,
        ).href;

        window.location.replace(url);
      }

      dispatch(selectTool(toolWithPath.titleKeyword));

      //Now we open the drawer for the tool selected
      const toolFromPath = listItems.find(
        (i) => i.titleKeyword === toolWithPath.category,
      );

      if (toolFromPath) {
        toolFromPath.handleOpenCategoryDrawer(true);
      }
    }
  }, [navigate]);

  const handleToolChange = (tool) => {
    if (tool.toolGroup === TOOL_GROUPS.VERIFICATION)
      dispatch(selectTopMenuItem(TOP_MENU_ITEMS[0].title));

    dispatch(selectTool(tool.titleKeyword));
  };

  const currentLang = useSelector((state) => state.language);
  const userAuthenticated = useSelector(
    (state) => state.userSession && state.userSession.userAuthenticated,
  );
  // const role = useSelector((state) => state.userSession.user.roles);

  // Set UI direction based on language reading direction
  const direction = currentLang !== "ar" ? "ltr" : "rtl";

  const [isSideMenuOpen, setIsSideMenuOpen] = useState(true);

  const drawerRef = useRef(null);

  const [classWidthToolbar, setClassWidthToolbar] = useState(
    classes.drawerWidth,
  );

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);

    if (classWidthToolbar === classes.drawerWidth) {
      setClassWidthToolbar(classes.drawerWidthClose);
      setTimeout(function () {}, 194);
    } else {
      setClassWidthToolbar(classes.drawerWidth);
    }
  };

  /**
   * Fires when the user clicks on a topMenuItem
   * @param tool {Tool}
   */
  const handleSideMenuToolClick = (tool) => {
    if (
      !userAuthenticated &&
      tool.rolesNeeded &&
      tool.rolesNeeded.includes(ROLES.REGISTERED_USER)
    ) {
      setOpenAlert(true);
      return;
    }

    if (
      tool.path === "csvSna" ||
      tool.path === "factcheck" ||
      tool.path === "xnetwork"
    ) {
      window.open(
        process.env.REACT_APP_TSNA_SERVER + tool.path + "?lang=" + currentLang,
        "_blank",
      );
      return;
    }

    if (tool.category === TOOLS_CATEGORIES.OTHER) {
      navigate("/app/tools/" + tool.path);
      handleToolChange(tool);
      return;
    }

    navigate("/app/tools/" + tool.path);

    handleToolChange(tool);
  };

  const toolsItem = tools.find((tool) => tool.titleKeyword === "navbar_tools");
  const drawerItemsMore = tools.filter(
    (tool) => tool.toolGroup === TOOL_GROUPS.MORE,
  );

  //Video items
  const drawerItemsVideo = tools.filter(
    (tool) => tool.category === TOOLS_CATEGORIES.VIDEO,
  );
  const [openListVideo, setOpenListVideo] = useState(() => {
    const tool = tools.filter(
      (tool) => tool.titleKeyword === selectedToolTitleKeyword,
    )[0];
    return tool.category === TOOLS_CATEGORIES.VIDEO;
  });

  const handleClickListVideo = (setOpen) => {
    if (setOpen) setOpenListVideo(setOpen);
    else setOpenListVideo((prevState) => !prevState);
  };

  //Image items
  const drawerItemsImage = tools.filter(
    (tool) => tool.category === TOOLS_CATEGORIES.IMAGE,
  );
  const [openListImage, setOpenListImage] = useState(false);

  const handleClickListImage = (setOpen) => {
    if (setOpen) setOpenListImage(setOpen);
    else setOpenListImage((prev) => !prev);
  };

  //Audio items
  const drawerItemsAudio = tools.filter(
    (tool) => tool.category === TOOLS_CATEGORIES.AUDIO,
  );
  const [openListAudio, setOpenListAudio] = useState(false);

  const handleClickListAudio = (setOpen) => {
    if (setOpen) setOpenListAudio(setOpen);
    else setOpenListAudio((prevState) => !prevState);
  };

  //Search items
  const drawerItemsSearch = tools.filter(
    (tool) => tool.category === TOOLS_CATEGORIES.SEARCH,
  );
  const [openListSearch, setOpenListSearch] = useState(false);

  const handleClickListSearch = (setOpen) => {
    if (setOpen) setOpenListSearch(setOpen);
    else setOpenListSearch((prevState) => !prevState);
  };

  //Data items
  const drawerItemsData = tools.filter(
    (tool) => tool.category === TOOLS_CATEGORIES.DATA_ANALYSIS,
  );

  const [openListData, setOpenListData] = useState(false);

  const handleClickListData = (setOpen) => {
    if (setOpen) setOpenListData(setOpen);
    else setOpenListData((prevState) => !prevState);
  };

  const drawerItemsOtherTools = tools.filter(
    (tool) => tool.category === TOOLS_CATEGORIES.OTHER,
  );
  const [openListOtherTools, setOpenListOtherTools] = useState(false);

  const handleClickListOtherTools = (setOpen) => {
    if (setOpen) setOpenListOtherTools(setOpen);
    else setOpenListOtherTools((prevState) => !prevState);
  };

  let listItems = [];

  const tmpListItems = [
    {
      titleKeyword: TOOLS_CATEGORIES.VIDEO,
      icon: (
        <VideoIcon
          width="24px"
          height="24px"
          style={{ fill: "var(--mui-palette-text-secondary)" }}
          title={TOOLS_CATEGORIES.VIDEO}
        />
      ),
      list: drawerItemsVideo,
      variableOpen: openListVideo,
      setVariableOpen: setOpenListVideo,
      handleOpenCategoryDrawer: handleClickListVideo,
    },
    {
      titleKeyword: TOOLS_CATEGORIES.IMAGE,
      icon: (
        <ImageIcon
          width="24px"
          height="24px"
          style={{ fill: "var(--mui-palette-text-secondary)" }}
          title={TOOLS_CATEGORIES.IMAGE}
        />
      ),
      list: drawerItemsImage,
      variableOpen: openListImage,
      setVariableOpen: setOpenListImage,
      handleOpenCategoryDrawer: handleClickListImage,
    },
    {
      titleKeyword: TOOLS_CATEGORIES.AUDIO,
      icon: (
        <Audiotrack
          width="24px"
          height="24px"
          style={{ fill: "var(--mui-palette-text-secondary)" }}
          title={TOOLS_CATEGORIES.AUDIO}
        />
      ),
      list: drawerItemsAudio,
      variableOpen: openListAudio,
      setVariableOpen: setOpenListAudio,
      handleOpenCategoryDrawer: handleClickListAudio,
    },
    {
      titleKeyword: TOOLS_CATEGORIES.SEARCH,
      icon: (
        <SearchIcon
          width="24px"
          height="24px"
          style={{ fill: "var(--mui-palette-text-secondary)" }}
          title={TOOLS_CATEGORIES.SEARCH}
        />
      ),
      list: drawerItemsSearch,
      variableOpen: openListSearch,
      setVariableOpen: setOpenListSearch,
      handleOpenCategoryDrawer: handleClickListSearch,
    },
    {
      titleKeyword: TOOLS_CATEGORIES.DATA_ANALYSIS,
      icon: (
        <DataIcon
          width="24px"
          height="24px"
          style={{ fill: "var(--mui-palette-text-secondary)" }}
          title={TOOLS_CATEGORIES.DATA_ANALYSIS}
        />
      ),
      list: drawerItemsData,
      variableOpen: openListData,
      setVariableOpen: setOpenListData,
      handleOpenCategoryDrawer: handleClickListData,
    },
    {
      titleKeyword: TOOLS_CATEGORIES.OTHER,
      icon: <MoreHoriz style={{ fill: "var(--mui-palette-text-secondary)" }} />,
      list: drawerItemsOtherTools,
      variableOpen: openListOtherTools,
      setVariableOpen: setOpenListOtherTools,
      handleOpenCategoryDrawer: handleClickListOtherTools,
    },
  ];

  tmpListItems.map((items) => {
    const listTools = items.list;

    for (let i = 0; i < listTools.length; i++) {
      if (!listTools[i].rolesNeeded || listTools[i].rolesNeeded.length === 0) {
        listItems.push(items);
        break;
      } else if (
        listTools[i].rolesNeeded.some((roles) => role.includes(roles))
      ) {
        listItems.push(items);
        break;
      } else if (listTools[i].rolesNeeded.includes(TOOL_STATUS_ICON.LOCK)) {
        listItems.push(items);
        break;
      }
    }
  });

  /**
   * Changes the color of the icon dynamically if the topMenuItem is selected
   * @param tool {Tool}
   * @returns {{fontSize: string, fill: (string)}|{fontSize: string}}
   */
  const iconConditionalStyling = (tool) => {
    if (!tool.titleKeyword)
      return {
        fontSize: "24px",
      };

    let isSelected;

    // Case for the about topMenuItem
    if (!tool.category) {
      isSelected =
        selectedToolTitleKeyword === tool.titleKeyword ||
        topMenuItemSelected === tool.titleKeyword;
    } else if (tool.category !== TOOLS_CATEGORIES.OTHER) {
      isSelected =
        selectedToolTitleKeyword === tool.titleKeyword &&
        topMenuItemSelected === "navbar_tools";
    } else {
      isSelected = selectedToolTitleKeyword === tool.titleKeyword;
    }

    return {
      fill: isSelected ? "#00926c" : "var(--mui-palette-text-secondary)",
      color: isSelected ? "#00926c" : "var(--mui-palette-text-secondary)",
      fontSize: "24px",
    };
  };

  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: isSideMenuOpen,
        [classes.drawerClose]: !isSideMenuOpen,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: isSideMenuOpen,
          [classes.drawerClose]: !isSideMenuOpen,
        }),
      }}
      ref={drawerRef}
      open={isSideMenuOpen}
    >
      <List
        style={{
          marginTop: "80px",
        }}
      >
        <ListSubheader
          style={{
            paddingTop: "16px",
            paddingBottom: "16px",
            backgroundColor: "var(--mui-palette-background-paper)",
            textAlign: "start",
          }}
        >
          <Typography
            style={{
              fontWeight: "500",
              fontSize: "10px",
              color: "#B0B0B0",
              textTransform: "uppercase",
            }}
          >
            {isSideMenuOpen
              ? keyword("navbar_verification")
              : keyword("navbar_verification_short")}
          </Typography>
        </ListSubheader>
        <ListItemButton
          selected={
            topMenuItemSelected === toolsItem.titleKeyword &&
            selectedToolTitleKeyword === toolsItem.titleKeyword
          }
          onClick={() => handleSideMenuToolClick(toolsItem)}
          component={Link}
          to={toolsItem.path}
        >
          {isSideMenuOpen ? (
            <>
              <ListItemIcon
                sx={{
                  marginRight: "12px",
                  minWidth: "unset",
                }}
              >
                <toolsItem.icon sx={iconConditionalStyling(toolsItem)} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    color={
                      topMenuItemSelected === toolsItem.titleKeyword &&
                      selectedToolTitleKeyword === toolsItem.titleKeyword
                        ? "primary"
                        : ""
                    }
                    className={`${
                      isSideMenuOpen ? classes.drawerListText : classes.hidden
                    }`}
                  >
                    {keyword(toolsItem.titleKeyword)}
                  </Typography>
                }
              />
            </>
          ) : (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              width="100%"
            >
              <toolsItem.icon sx={iconConditionalStyling(toolsItem)} />
            </Stack>
          )}
        </ListItemButton>
        {listItems.map((item, key) => {
          const element = (
            <Box>
              <ListItemButton onClick={() => item.handleOpenCategoryDrawer()}>
                {isSideMenuOpen ? (
                  <>
                    <ListItemIcon
                      sx={{
                        marginRight: "12px",
                        minWidth: "unset",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography className={classes.drawerListText}>
                          {keyword(item.titleKeyword)}
                        </Typography>
                      }
                    />
                    {item.variableOpen ? <ExpandLess /> : <ExpandMore />}
                  </>
                ) : (
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    width="100%"
                  >
                    {item.icon}
                  </Stack>
                )}
              </ListItemButton>

              <Collapse in={item.variableOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.list.map((itemList, keyList) => {
                    if (
                      itemList.rolesNeeded &&
                      !canUserSeeTool(itemList, role, userAuthenticated)
                    ) {
                      return null;
                    } else {
                      return (
                        <SideMenuElement
                          tool={itemList}
                          key={keyList}
                          onClick={() => handleSideMenuToolClick(itemList)}
                          isSideMenuOpen={isSideMenuOpen}
                          isElementSelected={
                            topMenuItemSelected === toolsItem.titleKeyword &&
                            selectedToolTitleKeyword === itemList.titleKeyword
                          }
                          keyword={keyword}
                          level={1}
                        />
                      );
                    }
                  })}
                </List>
              </Collapse>
            </Box>
          );

          return <Box key={key}>{element}</Box>;
        })}
        <Box m={2} />
        <ListSubheader style={{ paddingTop: "16px", paddingBottom: "16px" }}>
          <Typography
            style={{
              fontWeight: "500",
              fontSize: "10px",
              color: "#B0B0B0",
              textTransform: "uppercase",
            }}
          >
            {isSideMenuOpen
              ? keyword("navbar_more")
              : keyword("navbar_more_short")}
          </Typography>
        </ListSubheader>
        {drawerItemsMore.map((item, key) => {
          return (
            <SideMenuElement
              tool={item}
              key={key}
              onClick={() => handleSideMenuToolClick(item)}
              isSideMenuOpen={isSideMenuOpen}
              isElementSelected={
                topMenuItemSelected === item.titleKeyword ||
                selectedToolTitleKeyword === item.titleKeyword
              }
              keyword={keyword}
              level={0}
            />
          );
        })}
      </List>

      <div className={classes.grow} />

      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          position: "sticky",
          bottom: "0px",
          backgroundColor: "var(--mui-palette-background-paper)",
          zIndex: "9",
        }}
      >
        <Box p={1}>
          <Divider />
        </Box>

        <Button
          onClick={toggleSideMenu}
          style={{ alignSelf: "center" }}
          startIcon={
            isSideMenuOpen ? (
              direction === "ltr" ? (
                <ChevronLeft />
              ) : (
                <ChevronRight />
              )
            ) : null
          }
        >
          {isSideMenuOpen ? (
            keyword("navbar_collapse")
          ) : direction === "ltr" ? (
            <ChevronRight />
          ) : (
            <ChevronLeft />
          )}
        </Button>

        <Box m={1} />
      </Box>
    </Drawer>
  );
};

export default SideMenu;
