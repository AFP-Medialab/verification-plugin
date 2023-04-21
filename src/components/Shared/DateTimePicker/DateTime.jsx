import React from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";
import * as moment from "moment";

const DateTime = (props) => {
  const checkIfDate = (e) => {
    if (moment.isMoment(e))
      props.handleChange(new Date(e.format("YYYY-MM-DD HH:mm:ss")));
    else props.handleChange(null);
  };

  const renderInput = (newProps) => {
    return (
      <div>
        <TextField
          {...newProps}
          type={"dateTime"}
          id="standard-full-width"
          label={props.label}
          placeholder={"YYYY-MM-DD hh:mm:ss"}
          fullWidth
          autoComplete="off"
          error={props.error}
          disabled={props.disabled}
          variant="outlined"
        />
      </div>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DateTimePicker
        {...props}
        onChange={checkIfDate}
        renderInput={renderInput}
        ampm={false}
        disableFuture
      />
    </LocalizationProvider>
  );
};
export default DateTime;
