import React, { useEffect } from "react";
import { Container } from "@mui/material";
import Fade from "@mui/material/Fade";
import { useDispatch, useSelector } from "react-redux";
import { selectTool } from "../../../redux/reducers/tools/toolReducer";
import { Route, Routes, useLocation } from "react-router-dom";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getclientId } from "../../Shared/GoogleAnalytics/MatomoAnalytics";
import { useTrackPageView } from "../../../Hooks/useAnalytics";

/**
 *
 * @param toolsList {Tool[]}
 * @returns {Element}
 */
const DrawerItem = ({ toolsList }) => {
  return (
    <Routes>
      {toolsList.map((tool, index) => {
        if (tool.path === "tools") {
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

  //Style elements
  //============================================================================================

  const theme = createTheme({
    components: {
      MuiCardHeader: {
        styleOverrides: {
          root: {
            backgroundColor: "#00926c",
          },
          title: {
            color: "white",
            fontSize: 20,
            fontweight: 500,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          wrapper: {
            fontSize: 12,
          },
          root: {
            minWidth: "15%!important",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "10px!important",
          },
        },
      },
    },
    palette: {
      primary: {
        light: "#00926c",
        main: "#00926c",
        dark: "#00926c",
        contrastText: "#fff",
      },
    },
  });
  const classes = useMyStyles();
  const path = useLocation();
  const client_id = getclientId();

  const session = useSelector((state) => state.userSession);
  const uid = session && session.user ? session.user.id : null;
  useTrackPageView(path, client_id, uid, tool);
  useEffect(() => {
    //trackPageView(path, client_id, uid);
    dispatch(selectTool(tool.titleKeyword));
  }, [tool]);

  return (
    <Container
      key={tool.titleKeyword}
      className={classes.noMargin}
      maxWidth={false}
    >
      <Fade in={true}>
        <div>
          <ThemeProvider theme={theme}>
            {tool.content}
            {tool.footer}
          </ThemeProvider>
        </div>
      </Fade>
    </Container>
  );
};

export default DrawerItem;
