import React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function SelectSmall(props) {
  return (
    <FormControl sx={{ m: 1, minWidth: props.minWidth }}>
      {props.label && (
        <InputLabel id="demo-select-small-label">{props.label}</InputLabel>
      )}
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={JSON.stringify(props.value)}
        label={props.label ?? ""}
        onChange={(e) => {
          props.setValue(JSON.parse(e.target.value));
          props.onChange(e.target.value);
        }}
        disabled={props.disabled}
      >
        {props.items.map((item, index) => {
          return (
            <MenuItem value={JSON.stringify(item)} key={index}>
              {item.name ?? item}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
