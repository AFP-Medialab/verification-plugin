import React, { useCallback } from "react";

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

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowRight";

import { handleAddCollection } from "../utils/snaUtils";
import { CollectionSelect } from "./CollectionSelect";

// Re-export for backward compatibility with other components
export { getRecordingInfo } from "../utils/snaUtils";

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

const renderSelectedValue = (selected) => (
  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
    {selected.map((value) => (
      <Chip key={value} label={value} />
    ))}
  </Box>
);

const MultipleSelectChip = ({
  selectedSocialMedia,
  setSelectedSocialMedia,
  keyword,
}) => {
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
          renderValue={renderSelectedValue}
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
};

const handleMainButtonClick = (recording, setRecording, setExpanded) => {
  if (recording) {
    setRecording(false);
    setExpanded(false);
    browser.runtime.sendMessage({ prompt: "stopRecording" });
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
  browser.runtime.sendMessage({
    prompt: "startRecording",
    currentCollectionName: selectedCollection,
    platforms: selectedSocialMedia,
  });
  setRecording(true);
  setExpanded(false);
};

const CollectionSelector = ({
  keyword,
  selectedCollection,
  setSelectedCollection,
  collections,
  newCollectionName,
  setNewCollectionName,
  selectedSocialMedia,
  setSelectedSocialMedia,
  onAddCollection,
  onStartRecording,
}) => {
  return (
    <>
      <Box mt={1} display="flex" flexDirection="column" gap={2}>
        <MultipleSelectChip
          selectedSocialMedia={selectedSocialMedia}
          setSelectedSocialMedia={setSelectedSocialMedia}
          keyword={keyword}
        />
        <CollectionSelect
          keyword={keyword}
          selectedCollection={selectedCollection}
          setSelectedCollection={setSelectedCollection}
          collections={collections}
          newCollectionName={newCollectionName}
          setNewCollectionName={setNewCollectionName}
          onAddCollection={onAddCollection}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={onStartRecording}
          disabled={selectedSocialMedia.length === 0}
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
  keyword,
}) => {
  const handleMainClick = useCallback(() => {
    handleMainButtonClick(recording, setRecording, setExpanded);
  }, [recording, setRecording, setExpanded]);

  const handleAddCollectionClick = useCallback(() => {
    handleAddCollection(
      newCollectionName,
      setCollections,
      setSelectedCollection,
      setNewCollectionName,
    );
  }, [
    newCollectionName,
    setCollections,
    setSelectedCollection,
    setNewCollectionName,
  ]);

  const handleStartRecordingClick = useCallback(() => {
    handleStartRecording(
      selectedCollection,
      setRecording,
      setExpanded,
      selectedSocialMedia,
    );
  }, [selectedCollection, setRecording, setExpanded, selectedSocialMedia]);

  return (
    <>
      <Grid size={{ xs: 12 }}>
        <Box display="flex" flexDirection="column">
          <Button
            variant="outlined"
            color="primary"
            onClick={handleMainClick}
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
            <CollectionSelector
              keyword={keyword}
              selectedCollection={selectedCollection}
              setSelectedCollection={setSelectedCollection}
              collections={collections}
              newCollectionName={newCollectionName}
              setNewCollectionName={setNewCollectionName}
              selectedSocialMedia={selectedSocialMedia}
              setSelectedSocialMedia={setSelectedSocialMedia}
              onAddCollection={handleAddCollectionClick}
              onStartRecording={handleStartRecordingClick}
            />
          </Collapse>
        </Box>
      </Grid>
    </>
  );
};
