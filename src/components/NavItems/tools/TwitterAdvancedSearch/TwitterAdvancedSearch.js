import {Box, Paper} from "@material-ui/core";
import React, {useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useSelector} from "react-redux";
import CustomTile from "../../../utility/customTitle/customTitle";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import {
    KeyboardTimePicker,
    KeyboardDatePicker, MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from "@date-io/date-fns";
import {useInput} from "../../../Hooks/useInput";
import {createUrl} from "./createUrl";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
        marginTop: 5,
        textAlign: "center",
    },
    textFiledError: {
        MuiInput: {
            underline: {
                borderBottom: theme.palette.error.main,
            },
            '&:hover fieldset': {
                borderBottom: 'yellow',
            },
        },
    },
    grow: {
        flexGrow: 1,
    },
}));

const TwitterAdvancedSearch = () => {
    const classes = useStyles();

    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };

    const term = useInput("");
    const account = useInput("");
    const filter = useInput("");
    const tweetLang = useInput("");
    const geocode = useInput("");
    const near = useInput("");
    const within = useInput("");

    const largeInputList = [
        {
            label : "twitter_termbox",
            props : term
        },
        {
            label : "twitter_tw-account",
            props : account
        },
        {
            label : "twitter_filter",
            props : filter
        },
        {
            label : "twitter_lang",
            props : tweetLang
        },
        {
            label : "twitter_geocode",
            props : geocode
        },
        {
            label : "twitter_near",
            props : near
        },
        {
            label : "twitter_within",
            props : within
        },
    ];


    const [fromDate, setSelectedFromDate] = useState(null);

    const handleFromDateChange = (date) => {
        setSelectedFromDate(date);
    };
    const [toDate, setSelectedToDate] = useState(null);

    const handleToDateChange = (date) => {
        setSelectedToDate(date);
    };

    const smallInputList = [
        {
            label : "twitter_from-date",
            selectedDate : fromDate,
            handleDateChange : handleFromDateChange,
        },
        {
            label : "twitter_to-date",
            selectedDate : toDate,
            handleDateChange : handleToDateChange,
        }
    ];


    const onSubmit = () => {
        let url = createUrl(term.value, account.value, filter.value, tweetLang.value, geocode.value, near.value, within.value, fromDate, toDate);
        window.open(url);
    };

    return (
        <Paper className={classes.root}>
            <CustomTile> {keyword("twitter_title")}  </CustomTile>
            <Box m={2}>
                {
                    largeInputList.map((value, key) => {
                        return (
                            <TextField
                                key={key}
                                id="standard-full-width"
                                label={keyword(value.label)}
                                style={{margin: 8}}
                                placeholder={"ex : (need tsv changes)"}
                                fullWidth
                                {...value.props}
                            />
                        )
                    })
                }
                <div>
                {
                    smallInputList.map((value, key) => {
                        return (
                            <div key={key}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            margin="normal"
                                            id="date-picker-dialog"
                                            label={keyword(value.label)}
                                            format="MM-dd-yyyy"
                                            value={value.selectedDate}
                                            onChange={value.handleDateChange}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
                                        <KeyboardTimePicker
                                            margin="normal"
                                            id="time-picker"
                                            label="time (add to tsv)"
                                            value={value.selectedDate}
                                            onChange={value.handleDateChange}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change time',
                                            }}
                                        />
                                </MuiPickersUtilsProvider>
                            </div>
                        )
                    })
                }
                </div>
            </Box>
            <Box m={2}/>
            <Button variant="contained" color="primary" onClick={onSubmit}>
                {keyword("button_submit")}
            </Button>
        </Paper>
    )
};
export default TwitterAdvancedSearch;