import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Fade from "@mui/material/Fade";

import { useTrackPageView } from "@/Hooks/useAnalytics";
import { toolsHome } from "@/constants/tools";
import { TOP_MENU_ITEMS } from "@/constants/topMenuItems";
import { selectTopMenuItem } from "@/redux/reducers/navReducer";

import DrawerItem from "../DrawerItem/DrawerItem";

/**
 * Represents the group of tools to display and their tabs in the ToolsMenu
 *
 * @param topMenuItems An array with the list of top menu items
 * @param tools {Tool[]} An array with the list of tools
 * @returns {React.JSX.Element|null}
 *
 */
const MainContentMenuTopMenuItems = ({ topMenuItems, tools }) => {
  if (!topMenuItems || topMenuItems.length === 0) return null;

  return (
    <Routes>
      {topMenuItems.map((topMenuItem, index) => {
        return (
          <Route
            key={index}
            path={topMenuItem.path + "/*"}
            element={
              <TabContent
                index={index}
                topMenuItem={topMenuItem}
                topMenuItems={topMenuItems}
                tools={tools}
              />
            }
          />
        );
      })}
    </Routes>
  );
};

const TabContent = ({ index, topMenuItem, tools, topMenuItems }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const topMenuItemSelected = TOP_MENU_ITEMS.find(
      (t) => t.title === topMenuItem.title,
    );

    dispatch(selectTopMenuItem(topMenuItemSelected.title));
  }, []);

  switch (topMenuItem.path) {
    case toolsHome.path:
      return <DrawerItem tools={tools} />;
    case "assistant":
      return (
        <Routes>
          <Route path={"*"}>
            <Route
              index
              element={
                <ContentContainer topMenuItems={topMenuItems} index={index} />
              }
            />
            <Route
              path={":url"}
              element={
                <ContentContainer topMenuItems={topMenuItems} index={index} />
              }
            />
          </Route>
        </Routes>
      );
    default:
      return <ContentContainer topMenuItems={topMenuItems} index={index} />;
  }
};

const ContentContainer = ({ topMenuItems, index }) => {
  let path = useLocation();
  // const cookies = useSelector((state) => state.cookies);
  // const clientId = cookies !== null ? cookies.id : null;

  const session = useSelector((state) => state.userSession);

  const uid = session && session.user ? session.user.id : null;
  const clientId = uid;
  useTrackPageView(path, clientId, uid);
  useEffect(() => {
    //  trackPageView(path, clientId, uid);
  }, []);

  return (
    <Container
      key={index}
      sx={{
        minHeight: "calc(100vh - 110px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Fade
        in={true}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box>
          <Box sx={{ flex: 1 }}>{topMenuItems[index].content}</Box>
          <Box component="footer" sx={{ mt: "auto" }}>
            {topMenuItems[index].footer}
          </Box>
        </Box>
      </Fade>
    </Container>
  );
};

export default MainContentMenuTopMenuItems;
