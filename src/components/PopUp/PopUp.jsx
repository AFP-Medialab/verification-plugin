import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid2 from "@mui/material/Grid2";
import { ThemeProvider } from "@mui/material/styles";

import { getSupportedBrowserLanguage } from "@Shared/Languages/getSupportedBrowserLanguage";
import useMyStyles from "@Shared/MaterialUiStyles/useMyStyles";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { ROLES } from "constants/roles";

import { changeLanguage } from "../../redux/reducers/languageReducer";
import { theme } from "../../theme";
import LogoEuCom from "../NavBar/images/SVG/Navbar/ep-logo.svg?url";
import LogoInVidWeverify from "../NavBar/images/SVG/Navbar/invid_weverify.svg?url";
import LogoVera from "../NavBar/images/SVG/Navbar/vera-logo_black.svg?url";

const navigator = window.browser ? window.browser : window.chrome;

const PopUp = () => {
  const classes = useMyStyles();
  const dispatch = useDispatch();
  const keyword = i18nLoadNamespace("components/PopUp");
  const currentLang = useSelector((state) => state.language);
  const defaultLanguage = useSelector((state) => state.defaultLanguage);
  const LOGO_EU = process.env.REACT_APP_LOGO_EU;

  const [pageUrl, setPageUrl] = useState(null);

  const urlOpenAssistant = () => {
    window.open("/popup.html#/app/assistant/" + encodeURIComponent(pageUrl));
  };

  const userAuthenticated = useSelector(
    (state) => state.userSession && state.userSession.userAuthenticated,
  );
  console.log(userAuthenticated);
  const userRoles = useSelector((state) => state.userSession.user.roles);

  const createScript = () => {
    let script =
      'const images = document.getElementsByTagName("img")\n' +
      "const image_meta = document.querySelector('meta[property=\"og:image\"]') \n" +
      "const video_meta = document.querySelector('meta[property=\"og:video\"]') \n" +
      "const text_meta = document.querySelector('meta[property=\"og:title\"]') \n" +
      'const text_found = text_meta ? text_meta.content : ""\n' +
      'const video_found = video_meta ?  video_meta.content : ""\n' +
      'const image = image_meta ?  image_meta.content : ""\n' +
      "results;\n";
    return script;
  };

  const getInstagramUrls = () => {
    const script = createScript();
    navigator.tabs.executeScript(
      {
        code: script,
      },
      (results) => {
        if (results) {
          window.localStorage.setItem("instagram_result", results);
        }
      },
    );
  };

  const loadData = () => {
    //get url of window
    navigator.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      let url = tabs[0].url;
      setPageUrl(url);
      if (url && url.includes("instagram")) {
        getInstagramUrls();
      }
    });
  };

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      setPageUrl(currentTab.url);
    });
  }, []);

  useEffect(() => {
    let supportedBrowserLang = getSupportedBrowserLanguage();

    if (defaultLanguage !== null) {
      if (defaultLanguage !== currentLang)
        dispatch(changeLanguage(defaultLanguage));
    } else if (
      supportedBrowserLang !== undefined &&
      supportedBrowserLang !== currentLang
    ) {
      dispatch(changeLanguage(supportedBrowserLang));
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.popUp}>
        <Grid2 container>
          {LOGO_EU ? (
            <>
              <Grid2
                size={{ xs: 6 }}
                container
                alignItems="center"
                justifyContent="center"
              >
                <img
                  src={LogoEuCom}
                  alt={LogoEuCom}
                  style={{ width: "100px" }}
                />
              </Grid2>
              <Grid2 size={{ xs: 6 }}>
                <img src={LogoVera} alt={LogoVera} style={{ width: "100px" }} />
              </Grid2>
            </>
          ) : (
            <>
              <Grid2
                size={{ xs: 7 }}
                container
                alignItems="center"
                justifyContent="center"
              >
                <img
                  src={LogoInVidWeverify}
                  alt={LogoInVidWeverify}
                  style={{ width: "150px" }}
                />
              </Grid2>
              <Grid2 size={{ xs: 5 }}>
                <img src={LogoVera} alt={LogoVera} style={{ width: "100px" }} />
              </Grid2>
            </>
          )}
          <Box m={1} />
          <Grid2 size={{ xs: 12 }}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth={true}
              onClick={() => window.open("/popup.html#/app/tools")}
            >
              {keyword("open_website")}
            </Button>
          </Grid2>
          <Box m={1} />
          <Grid2 size={{ xs: 12 }}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth={true}
              onClick={() => window.open("/popup.html#/app/assistant/")}
            >
              {keyword("open_assistant")}
            </Button>
          </Grid2>
          <Box m={1} />
          <Grid2 size={{ xs: 12 }}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth={true}
              onMouseOver={() => loadData()}
              onClick={() => urlOpenAssistant()}
            >
              {keyword("open_assistant_on_page")}
            </Button>
          </Grid2>
          <Box m={1} />
          <Grid2 size={{ xs: 12 }}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth={true}
              onClick={() => window.open("/popup.html#/app/classroom/")}
            >
              {keyword("open_classroom")}
            </Button>
          </Grid2>
          <Box m={1} />
          {userRoles.includes(ROLES.ARCHIVE) ? (
            <Grid2 size={{ xs: 12 }}>
              <Button
                variant="outlined"
                color="primary"
                fullWidth={true}
                onClick={() => {
                  window.open(
                    "/popup.html#/app/tools/archive/" +
                      encodeURIComponent(pageUrl),
                  );
                }}
              >
                {keyword("archive_this")}
              </Button>
            </Grid2>
          ) : null}
        </Grid2>

        <Box m={1} />
      </div>
    </ThemeProvider>
  );
};
export default PopUp;
