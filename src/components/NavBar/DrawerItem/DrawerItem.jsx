import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Container } from "@mui/material";
import Fade from "@mui/material/Fade";
import { useDispatch, useSelector } from "react-redux";
import { selectTool } from "../../../redux/reducers/tools/toolReducer";
import MainContentMenu from "../../NavItems/tools/Alltools/MainContentMenu";
import Analysis from "../../NavItems/tools/Analysis/Analysis";
import Keyframes from "../../NavItems/tools/Keyframes/Keyframes";
import Thumbnails from "../../NavItems/tools/Thumbnails/Thumbnails";
import TwitterAdvancedSearch from "../../NavItems/tools/TwitterAdvancedSearch/TwitterAdvancedSearch";
import Magnifier from "../../NavItems/tools/Magnifier/Magnifier";
import Metadata from "../../NavItems/tools/Metadata/Metadata";
import VideoRights from "../../NavItems/tools/VideoRights/VideoRights";
import Forensic from "../../NavItems/tools/Forensic/Forensic";
import { Route, Routes, useLocation } from "react-router-dom";
import { Footer, FOOTER_TYPES } from "../../Shared/Footer/Footer";
import TwitterSna from "../../NavItems/tools/TwitterSna/TwitterSna";
import OCR from "../../NavItems/tools/OCR/OCR";
import CheckGif from "../../NavItems/tools/Gif/CheckGif";
import DeepfakeImage from "../../NavItems/tools/Deepfake/DeepfakeImage";
import DeepfakeVideo from "../../NavItems/tools/Deepfake/DeepfakeVideo";
import SyntheticImageDetection from "../../NavItems/tools/SyntheticImageDetection";
import Geolocation from "../../NavItems/tools/Geolocation/Geolocation";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AnalysisImg from "../../NavItems/tools/Analysis_images/Analysis";
import { getclientId } from "../../Shared/GoogleAnalytics/MatomoAnalytics";
import { useTrackPageView } from "../../../Hooks/useAnalytics";
import Archive from "../../NavItems/tools/Archive";
import SemanticSearch from "../../NavItems/tools/SemanticSearch";
import Loccus from "../../NavItems/tools/Loccus";

const DrawerItem = ({ drawerItems }) => {
  const drawerItemsContent = [
    {
      content: <MainContentMenu tools={drawerItems} />,
      footer: <div />,
    },
    {
      content: <Analysis />,
      footer: <Footer type={FOOTER_TYPES.ITI} />,
    },
    {
      content: <Keyframes />,
      footer: <Footer type={FOOTER_TYPES.ITI} />,
    },
    {
      content: <Thumbnails />,
      footer: <Footer type={FOOTER_TYPES.AFP} />,
    },
    {
      content: <VideoRights />,
      footer: <Footer type={FOOTER_TYPES.GRIHO} />,
    },
    {
      content: <Metadata mediaType={"video"} />,
      footer: <Footer type={FOOTER_TYPES.AFP} />,
    },
    {
      content: <DeepfakeVideo />,
      footer: <Footer type={FOOTER_TYPES.ITI} />,
    },
    {
      content: <AnalysisImg />,
      footer: <Footer type={FOOTER_TYPES.ITI} />,
    },
    {
      content: <Magnifier />,
      footer: <Footer type={FOOTER_TYPES.AFP} />,
    },
    {
      content: <Metadata mediaType={"image"} />,
      footer: <Footer type={FOOTER_TYPES.AFP} />,
    },

    {
      content: <Forensic />,
      footer: <Footer type={FOOTER_TYPES.ITI_BORELLI_AFP} />,
    },
    {
      content: <OCR />,
      footer: <Footer type={FOOTER_TYPES.USFD} />,
    },
    {
      content: <CheckGif />,
      footer: <Footer type={FOOTER_TYPES.BORELLI_AFP} />,
    },
    {
      content: <SyntheticImageDetection />,
      footer: <Footer type={FOOTER_TYPES.ITI_UNINA} />,
    },
    {
      content: <DeepfakeImage />,
      footer: <Footer type={FOOTER_TYPES.ITI} />,
    },
    {
      content: <Geolocation />,
      footer: <Footer type={FOOTER_TYPES.AFP} />,
    },
    {
      content: <Loccus />,
      footer: <Footer type={FOOTER_TYPES.LOCCUS} />,
    },
    {
      content: <TwitterAdvancedSearch />,
      footer: <Footer type={FOOTER_TYPES.AFP} />,
    },
    {
      content: <SemanticSearch />,
      footer: <Footer type={FOOTER_TYPES.KINIT} />,
    },
    {
      content: <TwitterSna />,
      footer: <Footer type={FOOTER_TYPES.USFD_AFP_EU_DISINFOLAB} />,
    },
    {
      content: <Archive />,
      footer: <Footer type={FOOTER_TYPES.AFP} />,
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
  useTrackPageView(path, client_id, uid, index);
  useEffect(() => {
    //trackPageView(path, client_id, uid);
    console.log(drawContent[index].content);
    // console.log(drawContent[index].content?.type?.type?.name);
    console.log(index);
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
