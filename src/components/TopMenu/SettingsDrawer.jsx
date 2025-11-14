import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
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
import useAuthenticationAPI from "../Shared/Authentication/useAuthenticationAPI";
import ColorModeSelect from "./ColorModeSelect";

const environment = process.env.REACT_APP_ENVIRONMENT;
const isStaging = environment !== "production";

const SettingsDrawer = ({ isPanelOpen, handleClosePanel }) => {
  const keyword = i18nLoadNamespace("components/NavBar");
  const keywordNewSna = i18nLoadNamespace("components/NavItems/tools/NewSNA");
  const authKeyword = i18nLoadNamespace("components/Shared/Authentication");

  const dispatch = useDispatch();

  const interactiveExplanation = useSelector(
    (state) => state.interactiveExplanation,
  );
  const cookiesUsage = useSelector((state) => state.cookies.active);
  const gaUsage = useSelector((state) => state.cookies.analytics);
  const userRoles = useSelector((state) => state.userSession.user.roles);
  const userAuthenticated = useSelector(
    (state) => state.userSession && state.userSession.userAuthenticated,
  );

  //SNA Recording props
  const [recording, setRecording] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [collections, setCollections] = useState(["Default Collection"]);
  const [selectedCollection, setSelectedCollection] =
    useState("Default Collection");
  const [newCollectionName, setNewCollectionName] = useState("");
  const [selectedSocialMedia, setSelectedSocialMedia] = useState([]);

  // Authentication API
  const authenticationAPI = useAuthenticationAPI();

  const handleLogout = () => {
    authenticationAPI.logout().catch((error) => {
      console.error("Logout error:", error);
    });
  };

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
          marginTop: "86px",
          height: "-webkit-fill-available",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box
        sx={{ p: 2, display: "flex", flexDirection: "column", height: "100%" }}
      >
        <Stack direction="column" spacing={3} sx={{ flexGrow: 1 }}>
          {/* Header */}
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6">
              {keyword("drawer_settings_title")}
            </Typography>
            <Box>
              <IconButton sx={{ p: 1 }} onClick={handleClosePanel}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Stack>

          {/* APPEARANCE SECTION */}
          <Box>
            <Typography
              variant="overline"
              sx={{
                fontWeight: 700,
                color: "primary.main",
                display: "block",
                marginBottom: 2,
                letterSpacing: 1.2,
              }}
            >
              Appearance
            </Typography>

            <Stack spacing={2} sx={{ alignItems: "flex-start" }}>
              {/* Language */}
              <Box sx={{ pl: 1 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  {keyword("drawer_settings_language")}
                </Typography>
                <Languages />
              </Box>

              {/* Theme */}
              <Box sx={{ pl: 1 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  {keyword("drawer_settings_theme")}
                </Typography>
                <ColorModeSelect />
              </Box>

              {/* Font Size */}
              <Box sx={{ pl: 1 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  {keyword("drawer_settings_font_size")}
                </Typography>
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
                      const newSize = Math.max(MIN_FONT_SIZE, currentSize - 1);
                      localStorage.setItem("fontSize", newSize.toString());
                      window.dispatchEvent(new Event("storage"));
                    }}
                    disabled={getStoredFontSize() === MIN_FONT_SIZE}
                    sx={{ p: 1 }}
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
              </Box>
            </Stack>
          </Box>

          <Divider />

          {/* PREFERENCES SECTION */}
          <Box>
            <Typography
              variant="overline"
              sx={{
                fontWeight: 700,
                color: "primary.main",
                display: "block",
                marginBottom: 2,
                letterSpacing: 1.2,
              }}
            >
              {keyword("drawer_settings_other_preferences")}
            </Typography>

            <Box
              sx={{
                pl: 2,
                py: 1.5,
                backgroundColor: "action.hover",
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack spacing={1}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={interactiveExplanation}
                      onChange={() =>
                        dispatch(toggleUnlockExplanationCheckBox())
                      }
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
                        onChange={() =>
                          dispatch(toggleAnalyticsCheckBox(gaUsage))
                        }
                        value="checkedBox"
                        color="primary"
                      />
                    }
                    label={keyword("cookies_usage")}
                  />
                )}
              </Stack>
            </Box>
          </Box>

          {/* ADVANCED TOOLS SECTION (Conditional) */}
          {userRoles.includes(ROLES.EVALUATION) && (
            <>
              <Divider />
              <Box>
                <Typography
                  variant="overline"
                  sx={{
                    fontWeight: 700,
                    color: "primary.main",
                    display: "block",
                    marginBottom: 2,
                    letterSpacing: 1.2,
                  }}
                >
                  Advanced Tools
                </Typography>

                <Box sx={{ pl: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    {keyword("snaRecord_settingsTitle")}
                  </Typography>
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
                </Box>
              </Box>
            </>
          )}

          {/* ACCOUNT SECTION (Conditional) */}
          {userAuthenticated && (
            <>
              <Divider />
              <Box>
                <Typography
                  variant="overline"
                  sx={{
                    fontWeight: 700,
                    color: "primary.main",
                    display: "block",
                    marginBottom: 2,
                    letterSpacing: 1.2,
                  }}
                >
                  Account
                </Typography>

                <Box sx={{ pl: 1 }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    sx={{ alignSelf: "flex-start" }}
                  >
                    {authKeyword("LOGUSER_LOGOUT_LABEL")}
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Stack>

        {/* Footer */}
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
