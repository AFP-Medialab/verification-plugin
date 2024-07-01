import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Collapse,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Stack,
  Typography,
} from "@mui/material";
import clsx from "clsx";
import { Link, useNavigate } from "react-router-dom";
import {
  Audiotrack,
  ChevronLeft,
  ChevronRight,
  ExpandLess,
  ExpandMore,
  MoreHoriz,
} from "@mui/icons-material";
import useMyStyles from "../Shared/MaterialUiStyles/useMyStyles";
import { i18nLoadNamespace } from "../Shared/Languages/i18nLoadNamespace";
import { useDispatch, useSelector } from "react-redux";
import VideoIcon from "../NavBar/images/SVG/Video/Video.svg";
import ImageIcon from "../NavBar/images/SVG/Image/Images.svg";
import SearchIcon from "../NavBar/images/SVG/Search/Search.svg";
import DataIcon from "../NavBar/images/SVG/DataAnalysis/Data_analysis.svg";
import {
  ROLES,
  TOOL_GROUPS,
  TOOL_STATUS_ICON,
  TOOLS_CATEGORIES,
} from "../../constants/tools";
import { selectTopMenuItem } from "../../redux/reducers/navReducer";
import { TOP_MENU_ITEMS } from "../../constants/topMenuItems";
import { selectTool } from "../../redux/reducers/tools/toolReducer";

const SideMenu = ({ tools, setOpenAlert }) => {
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavBar");

  const topMenuItemSelected = useSelector((state) => state.nav);
  const selectedToolTitleKeyword = useSelector((state) => state.tool.toolName);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    //Set the redux state if the tool was opened from URL
    const pathArr = window.location.href.split("/");

    const lastNonEmptyPath = pathArr[pathArr.length - 1]
      ? pathArr[pathArr.length - 1]
      : pathArr[pathArr.length - 2];

    const path = lastNonEmptyPath.split("?")[0];

    const toolWithPath = tools.find((tool) => tool.path === path);

    if (toolWithPath) {
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

    if (tool.toolGroup === TOOL_GROUPS.MORE)
      dispatch(selectTopMenuItem(TOP_MENU_ITEMS[5].title));

    dispatch(selectTool(tool.titleKeyword));
  };

  const currentLang = useSelector((state) => state.language);
  const userAuthenticated = useSelector(
    (state) => state.userSession && state.userSession.userAuthenticated,
  );
  const role = useSelector((state) => state.userSession.user.roles);
  const betaTester = role.includes("BETA_TESTER");

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
    if (tool.category === TOOLS_CATEGORIES.OTHER) {
      navigate("/app/" + tool.path);
      handleToolChange(tool);
      return;
    }

    if (
      !userAuthenticated &&
      tool.rolesNeeded &&
      tool.rolesNeeded.includes(ROLES.LOCK)
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

    tool.toolGroup === TOOL_GROUPS.MORE
      ? navigate("/app/" + tool.path)
      : navigate("/app/tools/" + tool.path);

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
  const [classBorderVideo, setClassBorderVideo] = useState(null);

  const handleClickListVideo = (setOpen) => {
    if (setOpen) setOpenListVideo(setOpen);
    else setOpenListVideo((prevState) => !prevState);
    if (!classBorderVideo) {
      setClassBorderVideo(classes.drawerCategoryBorder);
    } else {
      setClassBorderVideo(null);
    }
  };

  //Image items
  const drawerItemsImage = tools.filter(
    (tool) => tool.category === TOOLS_CATEGORIES.IMAGE,
  );
  const [openListImage, setOpenListImage] = useState(false);
  const [classBorderImage, setClassBorderImage] = useState(null);

  const handleClickListImage = (setOpen) => {
    if (setOpen) setOpenListImage(setOpen);
    else setOpenListImage((prev) => !prev);
    if (!openListImage) {
      setClassBorderImage(classes.drawerCategoryBorder);
    } else {
      setClassBorderImage(null);
    }
  };

  //Audio items
  const drawerItemsAudio = tools.filter(
    (tool) => tool.category === TOOLS_CATEGORIES.AUDIO,
  );
  const [openListAudio, setOpenListAudio] = useState(false);
  const [classBorderAudio, setClassBorderAudio] = useState(null);

  const handleClickListAudio = (setOpen) => {
    if (setOpen) setOpenListAudio(setOpen);
    else setOpenListAudio((prevState) => !prevState);
    if (!openListAudio) {
      setClassBorderAudio(classes.drawerCategoryBorder);
    } else {
      setClassBorderAudio(null);
    }
  };

  //Search items
  const drawerItemsSearch = tools.filter(
    (tool) => tool.category === TOOLS_CATEGORIES.SEARCH,
  );
  const [openListSearch, setOpenListSearch] = useState(false);
  const [classBorderSearch, setClassBorderSearch] = useState(null);

  const handleClickListSearch = (setOpen) => {
    if (setOpen) setOpenListSearch(setOpen);
    else setOpenListSearch((prevState) => !prevState);
    if (!openListSearch) {
      setClassBorderSearch(classes.drawerCategoryBorder);
    } else {
      setClassBorderSearch(null);
    }
  };

  //Data items
  const drawerItemsData = tools.filter(
    (tool) => tool.category === TOOLS_CATEGORIES.DATA_ANALYSIS,
  );

  const [openListData, setOpenListData] = useState(false);
  const [classBorderData, setClassBorderData] = useState(null);

  const handleClickListData = (setOpen) => {
    if (setOpen) setOpenListData(setOpen);
    else setOpenListData((prevState) => !prevState);
    if (!openListData) {
      setClassBorderData(classes.drawerCategoryBorder);
    } else {
      setClassBorderData(null);
    }
  };

  const drawerItemsOtherTools = tools.filter(
    (tool) => tool.category === TOOLS_CATEGORIES.OTHER,
  );
  const [openListOtherTools, setOpenListOtherTools] = useState(false);
  const [classBorderOtherTools, setClassBorderOtherTools] = useState(null);

  const handleClickListOtherTools = (setOpen) => {
    if (setOpen) setOpenListOtherTools(setOpen);
    else setOpenListOtherTools((prevState) => !prevState);
    if (!openListOtherTools) {
      setClassBorderOtherTools(classes.drawerCategoryBorder);
    } else {
      setClassBorderOtherTools(null);
    }
  };

  let listItems = [];

  const tmpListItems = [
    {
      titleKeyword: TOOLS_CATEGORIES.VIDEO,
      icon: (
        <VideoIcon
          width="24px"
          height="24px"
          style={{ fill: "#4c4c4c" }}
          title={TOOLS_CATEGORIES.VIDEO}
        />
      ),
      list: drawerItemsVideo,
      variableOpen: openListVideo,
      setVariableOpen: setOpenListVideo,
      handleOpenCategoryDrawer: handleClickListVideo,
      classBorder: classBorderVideo,
    },
    {
      titleKeyword: TOOLS_CATEGORIES.IMAGE,
      icon: (
        <ImageIcon
          width="24px"
          height="24px"
          style={{ fill: "#4c4c4c" }}
          title={TOOLS_CATEGORIES.IMAGE}
        />
      ),
      list: drawerItemsImage,
      variableOpen: openListImage,
      setVariableOpen: setOpenListImage,
      handleOpenCategoryDrawer: handleClickListImage,
      classBorder: classBorderImage,
    },
    {
      titleKeyword: TOOLS_CATEGORIES.AUDIO,
      icon: (
        <Audiotrack
          width="24px"
          height="24px"
          style={{ fill: "#4c4c4c" }}
          title={TOOLS_CATEGORIES.AUDIO}
        />
      ),
      list: drawerItemsAudio,
      variableOpen: openListAudio,
      setVariableOpen: setOpenListAudio,
      handleOpenCategoryDrawer: handleClickListAudio,
      classBorder: classBorderAudio,
    },
    {
      titleKeyword: TOOLS_CATEGORIES.SEARCH,
      icon: (
        <SearchIcon
          width="24px"
          height="24px"
          style={{ fill: "#4c4c4c" }}
          title={TOOLS_CATEGORIES.SEARCH}
        />
      ),
      list: drawerItemsSearch,
      variableOpen: openListSearch,
      setVariableOpen: setOpenListSearch,
      handleOpenCategoryDrawer: handleClickListSearch,
      classBorder: classBorderSearch,
    },
    {
      titleKeyword: TOOLS_CATEGORIES.DATA_ANALYSIS,
      icon: (
        <DataIcon
          width="24px"
          height="24px"
          style={{ fill: "#4c4c4c" }}
          title={TOOLS_CATEGORIES.DATA_ANALYSIS}
        />
      ),
      list: drawerItemsData,
      variableOpen: openListData,
      setVariableOpen: setOpenListData,
      handleOpenCategoryDrawer: handleClickListData,
      classBorder: classBorderData,
    },
    {
      titleKeyword: TOOLS_CATEGORIES.OTHER,
      icon: <MoreHoriz style={{ fill: "#4c4c4c" }} />,
      list: drawerItemsOtherTools,
      variableOpen: openListOtherTools,
      setVariableOpen: setOpenListOtherTools,
      handleOpenCategoryDrawer: handleClickListOtherTools,
      classBorder: classBorderOtherTools,
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
      fill: isSelected ? "#00926c" : "#4c4c4c",
      color: isSelected ? "#00926c" : "#4c4c4c",
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
            backgroundColor: "#ffffff",
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
                    let element = (
                      <ListItemButton
                        selected={
                          topMenuItemSelected === toolsItem.titleKeyword &&
                          selectedToolTitleKeyword === itemList.titleKeyword
                        }
                        key={keyList}
                        onClick={() => handleSideMenuToolClick(itemList)}
                      >
                        {isSideMenuOpen ? (
                          <>
                            <ListItemIcon
                              className={classes.drawerListNested}
                              sx={{
                                marginRight: "12px",
                                minWidth: "unset",
                              }}
                            >
                              <itemList.icon
                                sx={iconConditionalStyling(itemList)}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography
                                  color={
                                    topMenuItemSelected ===
                                      toolsItem.titleKeyword &&
                                    selectedToolTitleKeyword ===
                                      itemList.titleKeyword
                                      ? "primary"
                                      : ""
                                  }
                                  className={classes.drawerListText}
                                >
                                  {keyword(itemList.titleKeyword)}
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
                            <itemList.icon
                              sx={iconConditionalStyling(itemList)}
                            />
                          </Stack>
                        )}
                      </ListItemButton>
                    );

                    if (
                      itemList.rolesNeeded &&
                      itemList.rolesNeeded.includes("BETA_TESTER")
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
            <ListItemButton
              selected={
                topMenuItemSelected === item.titleKeyword ||
                selectedToolTitleKeyword === item.titleKeyword
              }
              key={key}
              onClick={() => handleSideMenuToolClick(item)}
            >
              {isSideMenuOpen ? (
                <>
                  <ListItemIcon
                    sx={{
                      marginRight: "12px",
                      minWidth: "unset",
                    }}
                  >
                    <item.icon sx={iconConditionalStyling(item)} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        color={
                          topMenuItemSelected === item.titleKeyword ||
                          selectedToolTitleKeyword === item.titleKeyword
                            ? "primary"
                            : ""
                        }
                        className={`${
                          isSideMenuOpen
                            ? classes.drawerListText
                            : classes.hidden
                        }`}
                      >
                        {keyword(item.titleKeyword)}
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
                  <item.icon sx={iconConditionalStyling(item)} />
                </Stack>
              )}
            </ListItemButton>
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
          backgroundColor: "#ffffff",
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
