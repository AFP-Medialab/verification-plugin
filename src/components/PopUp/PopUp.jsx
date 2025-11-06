import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useColorScheme } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import { changeLanguage } from "@/redux/reducers/languageReducer";
import { getSupportedBrowserLanguage } from "@Shared/Languages/getSupportedBrowserLanguage";
import useMyStyles from "@Shared/MaterialUiStyles/useMyStyles";
import {
  RecordingWindow,
  getRecordingInfo,
} from "components/NavItems/tools/SNA/components/Recording";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { ROLES } from "constants/roles";

import LogoEuComWhite from "../NavBar/images/SVG/Navbar/ep-logo-white.svg?url";
import LogoEuCom from "../NavBar/images/SVG/Navbar/ep-logo.svg?url";
import LogoInVidWeverify from "../NavBar/images/SVG/Navbar/invid_weverify.svg?url";
import LogoVeraBlack from "../NavBar/images/SVG/Navbar/vera-logo_black.svg?url";
import LogoVeraWhite from "../NavBar/images/SVG/Navbar/vera-logo_white.svg?url";

const navigator = window.browser ? window.browser : window.chrome;

const PopUp = () => {
  const classes = useMyStyles();
  const dispatch = useDispatch();
  const keyword = i18nLoadNamespace("components/PopUp");
  const currentLang = useSelector((state) => state.language);
  const defaultLanguage = useSelector((state) => state.defaultLanguage);
  const LOGO_EU = process.env.REACT_APP_LOGO_EU;
  const [pageUrl, setPageUrl] = useState(null);

  //SNA Recording props
  const [recording, setRecording] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [collections, setCollections] = useState(["Default Collection"]);
  const [selectedCollection, setSelectedCollection] =
    useState("Default Collection");
  const [newCollectionName, setNewCollectionName] = useState("");
  const [selectedSocialMedia, setSelectedSocialMedia] = useState([]);

  useEffect(() => {
    getRecordingInfo(setCollections, setRecording, setSelectedCollection);
  }, []);

  const urlOpenAssistant = () => {
    window.open("/popup.html#/app/assistant/" + encodeURIComponent(pageUrl));
  };

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

  const { systemMode, mode } = useColorScheme();
  const resolvedMode = systemMode || mode;

  return (
    <div className={classes.popUp}>
      <Grid container>
        {LOGO_EU ? (
          <>
            <Grid
              size={{ xs: 6 }}
              container
              sx={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={resolvedMode === "light" ? LogoEuCom : LogoEuComWhite}
                alt={"European Parliament Logo"}
                style={{ width: "128px" }}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <img
                src={resolvedMode === "light" ? LogoVeraBlack : LogoVeraWhite}
                alt={"logo_vera"}
                style={{ width: "96px" }}
              />
            </Grid>
          </>
        ) : (
          <>
            <Grid
              size={{ xs: 7 }}
              container
              sx={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={LogoInVidWeverify}
                alt={LogoInVidWeverify}
                style={{ width: "150px" }}
              />
            </Grid>
            <Grid size={{ xs: 5 }}>
              <img
                src={resolvedMode === "light" ? LogoVeraBlack : LogoVeraWhite}
                alt={"logo_vera"}
                style={{ width: "100px" }}
              />
            </Grid>
          </>
        )}
        <Box
          sx={{
            m: 1,
          }}
        />
        <Grid size={{ xs: 12 }}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth={true}
            onClick={() => window.open("/popup.html#/app/tools")}
          >
            {keyword("open_website")}
          </Button>
        </Grid>
        <Box
          sx={{
            m: 1,
          }}
        />
        <Grid size={{ xs: 12 }}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth={true}
            onClick={() => window.open("/popup.html#/app/assistant/")}
          >
            {keyword("open_assistant")}
          </Button>
        </Grid>
        <Box
          sx={{
            m: 1,
          }}
        />
        <Grid size={{ xs: 12 }}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth={true}
            // onMouseOver={() => loadData()} //TODO: loadData() is not defined?
            onClick={() => urlOpenAssistant()}
          >
            {keyword("open_assistant_on_page")}
          </Button>
        </Grid>
        <Box
          sx={{
            m: 1,
          }}
        />
        <Grid size={{ xs: 12 }}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth={true}
            onClick={() => window.open("/popup.html#/app/classroom/")}
          >
            {keyword("open_classroom")}
          </Button>
        </Grid>
        <Box
          sx={{
            m: 1,
          }}
        />
        {userRoles.includes(ROLES.EVALUATION) ? (
          <Grid size={{ xs: 12 }}>
            <RecordingWindow
              recording={recording}
              setRecording={setRecording}
              expanded={expanded}
              setExpanded={setExpanded}
              selectedCollection={selectedCollection}
              setSelectedCollection={setSelectedCollection}
              collections={collections}
              setCollections={setCollections}
              newCollectionName={newCollectionName}
              setNewCollectionName={setNewCollectionName}
              selectedSocialMedia={selectedSocialMedia}
              setSelectedSocialMedia={setSelectedSocialMedia}
            />
          </Grid>
        ) : null}
        <Box
          sx={{
            m: 1,
          }}
        />
        {userRoles.includes(ROLES.ARCHIVE) ? (
          <Grid size={{ xs: 12 }}>
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
          </Grid>
        ) : null}
      </Grid>
    </div>
  );
};
export default PopUp;
