import React from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function CheckboxesTags(props) {
  return (
    <Autocomplete
      multiple
      id="checkboxes-tags-demo"
      value={props.value}
      onChange={(event, newValue) => {
        props.setValue(newValue);
      }}
      options={props.options}
      isOptionEqualToValue={(option, value) => option.code === value.code}
      disabled={props.disabled}
      disableCloseOnSelect
      getOptionLabel={(option) => option.title}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option.title}
        </li>
      )}
      style={{ width: 300 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label}
          placeholder={props.placeholder}
        />
      )}
    />
  );
}
