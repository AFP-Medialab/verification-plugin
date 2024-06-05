import { Route, Routes, useLocation } from "react-router-dom";
import { Container } from "@mui/material";
import Fade from "@mui/material/Fade";
import React, { useEffect } from "react";
import DrawerItem from "../DrawerItem/DrawerItem";
import { useDispatch, useSelector } from "react-redux";
import { selectPage } from "../../../redux/reducers/navReducer";
import { useTrackPageView } from "../../../Hooks/useAnalytics";

/**
 * Represents the group of tools to display and their tabs in the MainContentMenu
 *
 * @param tabItems {} An array with the list of tools categories
 * @param toolsList {[]} An array with the list of tools
 * @returns {React.JSX.Element|null}
 *
 */
const MainContentMenuTabItems = ({ tabItems, toolsList }) => {
  if (!tabItems || tabItems.length === 0) return null;
  return (
    <Routes>
      {tabItems.map((item, index) => {
        return (
          <Route
            key={index}
            path={item.path + "/*"}
            element={
              <TabContent
                index={index}
                path={item.path}
                tabItems={tabItems}
                toolsList={toolsList}
              />
            }
          />
        );
      })}
    </Routes>
  );
};

const TabContent = ({ index, path, toolsList, tabItems }) => {
  //console.log("path .... ", path);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(selectPage(index));
  }, [index]);

  switch (path) {
    case "tools":
      return <DrawerItem toolsList={toolsList} />;
    case "assistant":
      return (
        <Routes>
          <Route path={"*"}>
            <Route
              index
              element={<ContentContainer tabItems={tabItems} index={index} />}
            />
            <Route
              path={":url"}
              element={<ContentContainer tabItems={tabItems} index={index} />}
            />
          </Route>
        </Routes>
      );
    default:
      return <ContentContainer tabItems={tabItems} index={index} />;
  }
};

const ContentContainer = ({ tabItems, index }) => {
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
          {tabItems[index].content}
          {tabItems[index].footer}
        </div>
      </Fade>
    </Container>
  );
};

export default MainContentMenuTabItems;
