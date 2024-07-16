import { Route, Routes, useLocation } from "react-router-dom";
import { Container } from "@mui/material";
import Fade from "@mui/material/Fade";
import React, { useEffect } from "react";
import DrawerItem from "../DrawerItem/DrawerItem";
import { useDispatch, useSelector } from "react-redux";
import { useTrackPageView } from "../../../Hooks/useAnalytics";
import { toolsHome } from "../../../constants/tools";
import { TOP_MENU_ITEMS } from "../../../constants/topMenuItems";
import { selectTopMenuItem } from "../../../redux/reducers/navReducer";

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
    <Container key={index}>
      <Fade in={true}>
        <div>
          {topMenuItems[index].content}
          {topMenuItems[index].footer}
        </div>
      </Fade>
    </Container>
  );
};

export default MainContentMenuTopMenuItems;
