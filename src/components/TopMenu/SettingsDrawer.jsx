import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Drawer from "@mui/material/Drawer";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";

import { toggleUnlockExplanationCheckBox } from "@/redux/actions";
import {
  toggleAnalyticsCheckBox,
  toggleState,
} from "@/redux/reducers/cookiesReducers";
import { MAX_FONT_SIZE, MIN_FONT_SIZE, getStoredFontSize } from "@/theme";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import {
  RecordingWindow,
  getRecordingInfo,
} from "components/NavItems/tools/SNA/components/Recording";
import { ROLES } from "constants/roles";

import manifest from "../../../public/manifest.json";
import Languages from "../NavItems/languages/languages";
import ColorModeSelect from "./ColorModeSelect";

const environment = process.env.REACT_APP_ENVIRONMENT;
const isStaging = environment !== "production";

const SettingsDrawer = ({ isPanelOpen, handleClosePanel }) => {
  const keyword = i18nLoadNamespace("components/NavBar");
  const keywordNewSna = i18nLoadNamespace("components/NavItems/tools/NewSNA");

  const dispatch = useDispatch();

  const interactiveExplanation = useSelector(
    (state) => state.interactiveExplanation,
  );
  const cookiesUsage = useSelector((state) => state.cookies.active);
  const gaUsage = useSelector((state) => state.cookies.analytics);
  const userRoles = useSelector((state) => state.userSession.user.roles);

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

  const version = manifest.version;

  return (
    <Drawer
      anchor="right"
      open={isPanelOpen}
      onClose={handleClosePanel}
      variant="temporary"
      closeAfterTransition={false}
      sx={{
        width: "300px",
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: "300px",
          boxSizing: "border-box",
          marginTop: "86px", // Add padding to the top to avoid overlap with the AppBar
          height: "-webkit-fill-available",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box
        sx={{ p: 2, display: "flex", flexDirection: "column", height: "100%" }}
      >
        <Stack direction="column" spacing={4} sx={{ flexGrow: 1 }}>
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">
              {keyword("drawer_settings_title")}
            </Typography>
            <Box
              sx={{
                pr: 1,
              }}
            >
              <IconButton sx={{ p: 1 }} onClick={handleClosePanel}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Stack>
          <Stack
            direction="column"
            spacing={1}
            sx={{
              alignItems: "start",
            }}
          >
            <Typography>{keyword("drawer_settings_language")}</Typography>
            <Languages />
          </Stack>

          <Stack
            direction="column"
            spacing={1}
            sx={{
              alignItems: "start",
            }}
          >
            <Typography>{keyword("drawer_settings_theme")}</Typography>
            <ColorModeSelect />
          </Stack>

          <Stack
            direction="column"
            spacing={1}
            sx={{
              alignItems: "start",
            }}
          >
            <Typography>{keyword("drawer_settings_font_size")}</Typography>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                alignItems: "center",
              }}
            >
              <IconButton
                onClick={() => {
                  const currentSize = getStoredFontSize();
                  const newSize = Math.max(MIN_FONT_SIZE, currentSize - 1); // Set a minimum font size of 10px
                  localStorage.setItem("fontSize", newSize.toString());
                  window.dispatchEvent(new Event("storage"));
                }}
                disabled={getStoredFontSize() === MIN_FONT_SIZE}
                sx={{
                  p: 1,
                }}
                color="primary"
              >
                <RemoveIcon />
              </IconButton>
              <Typography>{getStoredFontSize()} px</Typography>
              <IconButton
                onClick={() => {
                  const currentSize = getStoredFontSize();
                  const newSize = Math.min(MAX_FONT_SIZE, currentSize + 1);
                  localStorage.setItem("fontSize", newSize.toString());
                  window.dispatchEvent(new Event("storage"));
                }}
                sx={{ p: 1 }}
                color="primary"
                disabled={getStoredFontSize() === MAX_FONT_SIZE}
              >
                <AddIcon />
              </IconButton>
            </Stack>
          </Stack>

          <Stack direction="column" spacing={1}>
            <Typography>
              {keyword("drawer_settings_other_preferences")}
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={interactiveExplanation}
                  onChange={() => dispatch(toggleUnlockExplanationCheckBox())}
                  value="checkedBox"
                  color="primary"
                />
              }
              label={keyword("quiz_unlock_explanations")}
            />
            {cookiesUsage !== null && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={cookiesUsage}
                    onChange={() => dispatch(toggleState(cookiesUsage))}
                    value="checkedBox"
                    color="primary"
                  />
                }
                label={keyword("storage_usage")}
              />
            )}
            {gaUsage !== null && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={gaUsage}
                    onChange={() => dispatch(toggleAnalyticsCheckBox(gaUsage))}
                    value="checkedBox"
                    color="primary"
                  />
                }
                label={keyword("cookies_usage")}
              />
            )}
          </Stack>
          {userRoles.includes(ROLES.BETA_TESTER) ? (
            <Stack direction="column" spacing={1}>
              <Typography>{keyword("snaRecord_settingsTitle")}</Typography>
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
                keyword={keywordNewSna}
              />
            </Stack>
          ) : null}
        </Stack>
        <Stack spacing={1} sx={{ alignItems: "center", mt: 2 }}>
          {isStaging && (
            <Typography variant="caption" color="warning.main" align="center">
              STAGING
            </Typography>
          )}
          <Typography variant="caption" color="textSecondary" align="center">
            v{version}
          </Typography>
        </Stack>
      </Box>
    </Drawer>
  );
};

export default SettingsDrawer;
