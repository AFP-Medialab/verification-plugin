import React from "react";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import TextField from "@material-ui/core/TextField";
import * as moment from "moment";

const DateTimePicker = (props) => {

    const checkIfDate = (e) => {
        if (moment.isMoment(e))
            props.handleChange(new Date(e.format("YYYY-MM-DD HH:mm:ss")));
        else
            props.handleChange(null)
    };

    const renderInput = (newProps) => {
        return (
            <div>
                <TextField
                    {...newProps}
                    type={"dateTime"}
                    id="standard-full-width"
                    label={props.label}
                    placeholder={"ex : (need tsv changes)"}
                    fullWidth
                    autoComplete='off'
                    error={props.error}
                    disabled={props.disabled}
                    variant="outlined"
                />
            </div>
        )
    };

    return (
        <Datetime
            {...props}
            onChange={checkIfDate}
            renderInput={renderInput}
        />
    )
};
export default DateTimePicker;