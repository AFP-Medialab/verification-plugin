import React from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment-timezone";

const DateTime = (props) => {
  moment.locale("en-gb");
  const checkIfDate = (e) => {
    if (moment.isMoment(e)) {
      props.handleChange(e);
    } else props.handleChange(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DateTimePicker
        {...props}
        onChange={checkIfDate}
        slotProps={{ textField: { variant: "outlined" } }}
        ampm={false}
        disableFuture
      />
    </LocalizationProvider>
  );
};
export default DateTime;
