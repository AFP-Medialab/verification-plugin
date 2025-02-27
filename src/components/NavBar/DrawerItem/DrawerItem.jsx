import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Fade from "@mui/material/Fade";

import { getclientId } from "@Shared/GoogleAnalytics/MatomoAnalytics";

import { useTrackPageView } from "../../../Hooks/useAnalytics";
import { TOOL_GROUPS, toolsHome } from "../../../constants/tools";
import { TOP_MENU_ITEMS } from "../../../constants/topMenuItems";
import { selectTopMenuItem } from "../../../redux/reducers/navReducer";
import { selectTool } from "../../../redux/reducers/tools/toolReducer";

/**
 *
 * @param toolsList {Tool[]}
 * @returns {Element}
 */
const DrawerItem = ({ tools }) => {
  return (
    <Routes>
      {tools.map((tool, index) => {
        if (tool.path === toolsHome.path) {
          return (
            <Route
              path={"*"}
              key={index}
              element={<DrawerItemContent tool={tool} />}
            />
          );
        } else if (tool.path) {
          return (
            <Route path={tool.path} key={index}>
              <Route index element={<DrawerItemContent tool={tool} />} />
              <Route
                path={":url"}
                element={<DrawerItemContent tool={tool} />}
              />
              <Route
                path={":url/:type"}
                element={<DrawerItemContent tool={tool} />}
              />
            </Route>
          );
        }
        return null;
      })}
    </Routes>
  );
};
const DrawerItemContent = ({ tool }) => {
  const dispatch = useDispatch();

  const path = useLocation();
  const client_id = getclientId();

  const session = useSelector((state) => state.userSession);
  const uid = session && session.user ? session.user.id : null;

  const handleToolChange = (tool) => {
    if (tool.toolGroup === TOOL_GROUPS.VERIFICATION)
      dispatch(selectTopMenuItem(TOP_MENU_ITEMS[0].title));

    if (tool.toolGroup === TOOL_GROUPS.MORE)
      dispatch(selectTopMenuItem(TOP_MENU_ITEMS[5].title));

    dispatch(selectTool(tool.titleKeyword));
  };

  useTrackPageView(path, client_id, uid, tool);
  useEffect(() => {
    //trackPageView(path, client_id, uid);
    handleToolChange(tool);
  }, [tool]);

  return (
    <Container key={tool.titleKeyword} maxWidth={false}>
      <Fade in={true}>
        <Box>
          {tool.content}
          {tool.footer}
        </Box>
      </Fade>
    </Container>
  );
};

export default DrawerItem;
