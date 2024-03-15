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
        value={
          props.items[props.items.findIndex((item) => item.key === props.value)]
        }
        label={props.label ?? ""}
        onChange={(e) => {
          props.setValue(e.target.value.key);
          if (props.onChange) props.onChange(e.target.value);
        }}
        disabled={props.disabled}
      >
        {props.items.map((item, index) => {
          return (
            <MenuItem value={item} key={index}>
              {item.name ?? item}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
