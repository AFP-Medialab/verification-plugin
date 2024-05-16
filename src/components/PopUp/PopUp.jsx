import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import LogoVera from "../NavBar/images/SVG/Navbar/vera-logo_black.svg?url";
import LogoInVidWeverify from "../NavBar/images/SVG/Navbar/invid_weverify.svg?url";
import LogoEuCom from "../NavBar/images/SVG/Navbar/ep-logo.svg?url";

import useMyStyles from "../Shared/MaterialUiStyles/useMyStyles";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { changeLanguage } from "../../redux/reducers/languageReducer";
import { getSupportedBrowserLanguage } from "../Shared/Languages/getSupportedBrowserLanguage";

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

  const createScript = () => {
    let script =
      'var images = document.getElementsByTagName("img")\n' +
      "var image_meta = document.querySelector('meta[property=\"og:image\"]') \n" +
      "var video_meta = document.querySelector('meta[property=\"og:video\"]') \n" +
      "var text_meta = document.querySelector('meta[property=\"og:title\"]') \n" +
      'var text_found = text_meta ? text_meta.content : ""\n' +
      'var video_found = video_meta ?  video_meta.content : ""\n' +
      'var image = image_meta ?  image_meta.content : ""\n' +
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
    <div className={classes.popUp}>
      <Grid container>
        {LOGO_EU ? (
          <>
            <Grid
              item
              xs={6}
              container
              alignItems="center"
              justifyContent="center"
            >
              <img src={LogoEuCom} alt={LogoEuCom} style={{ width: "100px" }} />
            </Grid>
            <Grid item xs={6}>
              <img src={LogoVera} alt={LogoVera} style={{ width: "100px" }} />
            </Grid>
          </>
        ) : (
          <>
            <Grid
              item
              xs={7}
              container
              alignItems="center"
              justifyContent="center"
            >
              <img
                src={LogoInVidWeverify}
                alt={LogoInVidWeverify}
                style={{ width: "150px" }}
              />
            </Grid>
            <Grid item xs={5}>
              <img src={LogoVera} alt={LogoVera} style={{ width: "100px" }} />
            </Grid>
          </>
        )}
        <Box m={1} />
        <Grid item xs={12}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth={true}
            onClick={() => window.open("/popup.html#/app/tools/all")}
          >
            {keyword("open_website")}
          </Button>
        </Grid>
        <Box m={1} />
        <Grid item xs={12}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth={true}
            onClick={() => window.open("/popup.html#/app/assistant/")}
          >
            {keyword("open_assistant")}
          </Button>
        </Grid>
        <Box m={1} />
        <Grid item xs={12}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth={true}
            onMouseOver={() => loadData()}
            onClick={() => urlOpenAssistant()}
          >
            {keyword("open_assistant_on_page")}
          </Button>
        </Grid>
        <Box m={1} />
        <Grid item xs={12}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth={true}
            onClick={() => window.open("/popup.html#/app/classroom/")}
          >
            {keyword("open_classroom")}
          </Button>
        </Grid>
      </Grid>

      <Box m={1} />
    </div>
  );
};
export default PopUp;
