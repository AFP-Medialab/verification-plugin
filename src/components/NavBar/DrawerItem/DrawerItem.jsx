import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Container } from "@mui/material";
import Fade from "@mui/material/Fade";
import { useSelector, useDispatch } from "react-redux";
import { selectTool } from "../../../redux/reducers/tools/toolReducer";
import AllTools from "../../NavItems/tools/Alltools/AllTools";
import Analysis from "../../NavItems/tools/Analysis/Analysis";
import Keyframes from "../../NavItems/tools/Keyframes/Keyframes";
import Thumbnails from "../../NavItems/tools/Thumbnails/Thumbnails";
import TwitterAdvancedSearch from "../../NavItems/tools/TwitterAdvancedSearch/TwitterAdvancedSearch";
import Magnifier from "../../NavItems/tools/Magnifier/Magnifier";
import Metadata from "../../NavItems/tools/Metadata/Metadata";
import VideoRights from "../../NavItems/tools/VideoRights/VideoRights";
import Forensic from "../../NavItems/tools/Forensic/Forensic";
import { Route, Routes, useLocation } from "react-router-dom";
import Footer from "../../Shared/Footer/Footer";
import TwitterSna from "../../NavItems/tools/TwitterSna/TwitterSna";
import OCR from "../../NavItems/tools/OCR/OCR";
import CheckGif from "../../NavItems/tools/Gif/CheckGif";
import DeepfakeImage from "../../NavItems/tools/Deepfake/DeepfakeImage";
import DeepfakeVideo from "../../NavItems/tools/Deepfake/DeepfakeVideo";
import Geolocation from "../../NavItems/tools/Geolocation/Geolocation";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AnalysisImg from "../../NavItems/tools/Analysis_images/Analysis";
import {
  //trackPageView,
  getclientId,
} from "../../Shared/GoogleAnalytics/MatomoAnalytics";
import { useTrackPageView } from "../../../Hooks/useAnalytics";

const DrawerItem = ({ drawerItems }) => {
  const drawerItemsContent = [
    {
      content: <AllTools tools={drawerItems} />,
      footer: <div />,
    },
    {
      content: <Analysis />,
      footer: <Footer type={"iti"} />,
    },
    {
      content: <Keyframes />,
      footer: <Footer type={"iti"} />,
    },
    {
      content: <Thumbnails />,
      footer: <Footer type={"afp"} />,
    },
    {
      content: <VideoRights />,
      footer: <Footer type={"GRIHO"} />,
    },
    {
      content: <Metadata mediaType={"video"} />,
      footer: <Footer type={"afp"} />,
    },
    {
      content: <DeepfakeVideo />,
      footer: <Footer type={"iti"} />,
    },
    {
      content: <AnalysisImg />,
      footer: <Footer type={"iti"} />,
    },
    {
      content: <Magnifier />,
      footer: <Footer type={"afp"} />,
    },
    {
      content: <Metadata mediaType={"image"} />,
      footer: <Footer type={"afp"} />,
    },

    {
      content: <Forensic />,
      footer: <Footer type={"iti-borelli-afp"} />,
    },
    {
      content: <OCR />,
      footer: <Footer type={"usfd"} />,
    },
    {
      content: <CheckGif />,
      footer: <Footer type={"borelli-afp"} />,
    },
    {
      content: <DeepfakeImage />,
      footer: <Footer type={"iti"} />,
    },
    {
      content: <Geolocation />,
      footer: <Footer type={"afp"} />,
    },
    {
      content: <TwitterAdvancedSearch />,
      footer: <Footer type={"afp"} />,
    },
    {
      content: <TwitterSna />,
      footer: <Footer type={"afp-usfd-eudisinfolab"} />,
    },
  ];

  return (
    <Routes>
      <Route
        path={"*"}
        element={
          <DrawerItemContent index={0} drawContent={drawerItemsContent} />
        }
      />
      {drawerItems.map((item, index) => {
        if (item.path) {
          return (
            <Route path={item.path} key={index}>
              <Route
                index
                element={
                  <DrawerItemContent
                    index={index}
                    drawContent={drawerItemsContent}
                  />
                }
              />
              <Route
                path={":url"}
                element={
                  <DrawerItemContent
                    index={index}
                    drawContent={drawerItemsContent}
                  />
                }
              />
              <Route
                path={":url/:type"}
                element={
                  <DrawerItemContent
                    index={index}
                    drawContent={drawerItemsContent}
                  />
                }
              />
            </Route>
          );
        }
        return null;
      })}
    </Routes>
  );
};
const DrawerItemContent = ({ index, drawContent }) => {
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
            minWidth: "25%!important",
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
  const uid = session && session.user ? session.user.email : null;
  useTrackPageView(path, client_id, uid, index);
  useEffect(() => {
    //trackPageView(path, client_id, uid);
    dispatch(selectTool(index));
  }, [index]);

  return (
    <Container key={index} className={classes.noMargin} maxWidth={false}>
      <Fade in={true}>
        <div>
          <ThemeProvider theme={theme}>
            {drawContent[index].content}
            {drawContent[index].footer}
          </ThemeProvider>
        </div>
      </Fade>
    </Container>
  );
};

DrawerItem.propTypes = {
  drawerItems: PropTypes.any,
};

DrawerItemContent.propTypes = {
  drawContent: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
};

export default DrawerItem;
