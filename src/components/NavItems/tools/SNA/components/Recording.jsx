import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowRight";

import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const SocialMediaSelectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const socialMediaPlatforms = ["Twitter", "Tiktok"];

function MultipleSelectChip(
  selectedSocialMedia,
  setSelectedSocialMedia,
  keyword,
) {
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedSocialMedia(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value,
    );
  };

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id="demo-multiple-chip-label">
          {keyword("snaRecord_socialMediaSelectlabel")}
        </InputLabel>
        <Select
          labelId="socialMediaSelect-multiple-chip-label"
          id="socialMediaSelect-multiple-chip"
          multiple
          value={selectedSocialMedia}
          onChange={handleChange}
          input={
            <OutlinedInput
              id="select-multiple-chip"
              label={keyword("snaRecord_socialMediaSelectlabel")}
            />
          }
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={SocialMediaSelectMenuProps}
        >
          {socialMediaPlatforms.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export const getRecordingInfo = async (
  setCollections,
  setRecording,
  setSelectedCollection,
) => {
  let recInfo = await chrome.runtime.sendMessage({
    prompt: "getRecordingInfo",
  });
  setCollections(recInfo.collections.map((x) => x.id).flat());
  setRecording(recInfo.recording[0].state !== false);
  recInfo.recording[0].state !== false
    ? setSelectedCollection(recInfo.recording[0].state)
    : {};
};

const handleAddCollection = (
  newCollectionName,
  collections,
  setCollections,
  setSelectedCollection,
  setNewCollectionName,
) => {
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

const handleMainButtonClick = (recording, setRecording, setExpanded) => {
  if (recording) {
    setRecording(false);
    setExpanded(false);
    chrome.runtime.sendMessage({ prompt: "stopRecording" });
  } else {
    setExpanded((prev) => !prev);
  }
};

const handleStartRecording = (
  selectedCollection,
  setRecording,
  setExpanded,
  selectedSocialMedia,
) => {
  chrome.runtime.sendMessage({
    prompt: "startRecording",
    currentCollectionName: selectedCollection,
    platforms: selectedSocialMedia,
  });
  setRecording(true);
  setExpanded(false);
};

const CollectionSelector = (
  keyword,
  selectedCollection,
  setSelectedCollection,
  collections,
  setCollections,
  newCollectionName,
  setNewCollectionName,
  setRecording,
  setExpanded,
  selectedSocialMedia,
  setSelectedSocialMedia,
) => {
  return (
    <>
      <Box mt={1} display="flex" flexDirection="column" gap={2}>
        {MultipleSelectChip(
          selectedSocialMedia,
          setSelectedSocialMedia,
          keyword,
        )}
        <FormControl fullWidth>
          <InputLabel>
            {keyword("snaRecording_selectCollectionLabel")}
          </InputLabel>
          <Select
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
            label={keyword("snaRecording_selectCollectionLabel")}
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
            label={keyword("snaTools_newCollectionLabel")}
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            fullWidth
          />
          <Button
            variant="outlined"
            onClick={() =>
              handleAddCollection(
                newCollectionName,
                collections,
                setCollections,
                setSelectedCollection,
                setNewCollectionName,
              )
            }
            color="primary"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              justifyContent: "flex-start",
              textAlign: "left",
            }}
          >
            {keyword("snaTools_addNewCollectionLabel")}
          </Button>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            handleStartRecording(
              selectedCollection,
              setRecording,
              setExpanded,
              selectedSocialMedia,
            )
          }
        >
          {keyword("snaRecording_startRecordingButton")}
        </Button>
      </Box>
    </>
  );
};

export const RecordingWindow = ({
  recording,
  setRecording,
  expanded,
  setExpanded,
  selectedCollection,
  setSelectedCollection,
  collections,
  setCollections,
  newCollectionName,
  setNewCollectionName,
  selectedSocialMedia,
  setSelectedSocialMedia,
}) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/NewSNA");

  return (
    <>
      <Grid size={{ xs: 12 }}>
        <Box display="flex" flexDirection="column">
          <Button
            variant="outlined"
            color="primary"
            onClick={() =>
              handleMainButtonClick(recording, setRecording, setExpanded)
            }
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
              ? `${keyword("snaRecording_stopRecording")}:  ${selectedCollection}`
              : keyword("snaRecording_startRecording")}
          </Button>

          <Collapse in={expanded}>
            {CollectionSelector(
              keyword,
              selectedCollection,
              setSelectedCollection,
              collections,
              setCollections,
              newCollectionName,
              setNewCollectionName,
              setRecording,
              setExpanded,
              selectedSocialMedia,
              setSelectedSocialMedia,
            )}
          </Collapse>
        </Box>
      </Grid>
    </>
  );
};
