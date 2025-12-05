import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";

/**
 * CollectionSelect - Reusable component for selecting collections and adding new ones
 *
 * @param {Object} props
 * @param {Function} props.keyword - Translation function for i18n
 * @param {string} props.selectedCollection - Currently selected collection value
 * @param {Function} props.setSelectedCollection - Function to update selected collection
 * @param {Array<string>} props.collections - List of available collection names
 * @param {string} props.newCollectionName - New collection name input value
 * @param {Function} props.setNewCollectionName - Function to update new collection name
 * @param {Function} props.onAddCollection - Callback when adding a new collection
 */
export const CollectionSelect = ({
  keyword,
  selectedCollection,
  setSelectedCollection,
  collections,
  newCollectionName,
  setNewCollectionName,
  onAddCollection,
}) => {
  return (
    <>
      <FormControl fullWidth>
        <InputLabel>{keyword("snaRecording_selectCollectionLabel")}</InputLabel>
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
          onClick={onAddCollection}
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
    </>
  );
};
