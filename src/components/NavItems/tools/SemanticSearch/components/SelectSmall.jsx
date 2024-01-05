import React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function SelectSmall(props) {
  const [valueSelected, setValueSelected] = React.useState(
    props.initialValue ?? "",
  );

  const handleChange = (event) => {
    setValueSelected(event.target.value);
  };

  return (
    <FormControl
      sx={{ m: 1, minWidth: 275 }}
      // size="small"
    >
      <InputLabel id="demo-select-small-label">Search Engine</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={valueSelected}
        label="Search Engine"
        onChange={handleChange}
        disabled={props.disabled}
      >
        {props.items.map((item, index) => {
          return (
            <MenuItem value={item.name} key={index}>
              {item.name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
