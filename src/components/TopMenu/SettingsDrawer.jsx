import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Collapse from "@mui/material/Collapse";
import Drawer from "@mui/material/Drawer";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowRight";
import RemoveIcon from "@mui/icons-material/Remove";

import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";

import { toggleUnlockExplanationCheckBox } from "../../redux/actions";
import {
  toggleAnalyticsCheckBox,
  toggleState,
} from "../../redux/reducers/cookiesReducers";
import { MAX_FONT_SIZE, MIN_FONT_SIZE, getStoredFontSize } from "../../theme";
import Languages from "../NavItems/languages/languages";
import ColorModeSelect from "./ColorModeSelect";

const SettingsDrawer = ({ isPanelOpen, handleClosePanel }) => {
  const keyword = i18nLoadNamespace("components/NavBar");

  const dispatch = useDispatch();

  const interactiveExplanation = useSelector(
    (state) => state.interactiveExplanation,
  );
  const cookiesUsage = useSelector((state) => state.cookies.active);
  const gaUsage = useSelector((state) => state.cookies.analytics);

  const [recording, setRecording] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const [collections, setCollections] = useState(["Default Collection"]);
  const [selectedCollection, setSelectedCollection] =
    useState("Default Collection");
  const [newCollectionName, setNewCollectionName] = useState("");

  const handleAddCollection = () => {
    if (newCollectionName.trim() && !collections.includes(newCollectionName)) {
      chrome.runtime.sendMessage({
        prompt: "addCollection",
        newCollectionName: newCollectionName,
      });
      setCollections([...collections, newCollectionName]);
      setSelectedCollection(newCollectionName);
      setNewCollectionName("");
    }
  };

  const handleMainButtonClick = () => {
    if (recording) {
      // Stop recording and collapse
      setRecording(false);
      setExpanded(false);
      chrome.runtime.sendMessage({ prompt: "stopRecording" });
    } else {
      // If already expanded, collapse without starting
      setExpanded((prev) => !prev);
    }
  };

  const handleStartRecording = () => {
    chrome.runtime.sendMessage({
      prompt: "startRecording",
      currentCollectionName: selectedCollection,
    });
    setRecording(true);
    setExpanded(false);
  };

  return (
    <Drawer
      anchor="right"
      open={isPanelOpen}
      onClose={handleClosePanel}
      sx={{
        width: "300px",
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: "300px",
          boxSizing: "border-box",
          marginTop: "86px", // Add padding to the top to avoid overlap with the AppBar
          height: "-webkit-fill-available",
        },
      }}
    >
      <Box p={2}>
        <Stack direction="column" spacing={4}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">
              {keyword("drawer_settings_title")}
            </Typography>
            <Box pr={1}>
              <IconButton sx={{ p: 1 }} onClick={handleClosePanel}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Stack>

          <Stack direction="column" alignItems="start" spacing={1}>
            <Typography>{keyword("drawer_settings_language")}</Typography>
            <Languages />
          </Stack>

          <Stack direction="column" alignItems="start" spacing={1}>
            <Typography>{keyword("drawer_settings_theme")}</Typography>
            <ColorModeSelect />
          </Stack>

          <Stack direction="column" alignItems="start" spacing={1}>
            <Typography>{keyword("drawer_settings_font_size")}</Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
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
          <Stack direction="column" spacing={1}>
            <Typography>Record X for SNA</Typography>
            <Box display="flex" flexDirection="column">
              <Button
                variant="outlined"
                color="primary"
                onClick={handleMainButtonClick}
                endIcon={
                  !recording ? (
                    expanded ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )
                  ) : null
                }
              >
                {recording
                  ? `Stop Recording:  ${selectedCollection}`
                  : "Start recording"}
              </Button>

              <Collapse in={expanded}>
                <Box mt={1} display="flex" flexDirection="column" gap={2}>
                  <FormControl fullWidth>
                    <InputLabel>Select Collection</InputLabel>
                    <Select
                      value={selectedCollection}
                      onChange={(e) => setSelectedCollection(e.target.value)}
                      label="Select Collection"
                    >
                      {collections.map((name) => (
                        <MenuItem key={name} value={name}>
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Box display="flex" gap={1}>
                    <TextField
                      label="New Collection"
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      fullWidth
                    />
                    <Button
                      variant="outlined"
                      onClick={handleAddCollection}
                      color="primary"
                    >
                      Add
                    </Button>
                  </Box>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleStartRecording}
                  >
                    Start
                  </Button>
                </Box>
              </Collapse>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Drawer>
  );
};

export default SettingsDrawer;
