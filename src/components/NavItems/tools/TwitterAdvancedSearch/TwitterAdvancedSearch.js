import {Box, Paper} from "@material-ui/core";
import React, {useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useSelector} from "react-redux";
import CustomTile from "../../../utility/customTitle/customTitle";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {useInput} from "../../../Hooks/useInput";
import {createUrl} from "./createUrl";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import FormControl from "@material-ui/core/FormControl";
import DateTimePicker from "../../../DateTimePicker/DateTimePicker";

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
    const [localTime, setLocalTime] = useState("true");

    const largeInputList = [
        {
            label: "twitter_termbox",
            props: term
        },
        {
            label: "twitter_tw-account",
            props: account
        },
        {
            label: "twitter_filter",
            props: filter
        },
        {
            label: "twitter_lang",
            props: tweetLang
        },
        {
            label: "twitter_geocode",
            props: geocode
        },
        {
            label: "twitter_near",
            props: near
        },
        {
            label: "twitter_within",
            props: within
        },
    ];

    const [fromDate, setSelectedFromDate] = useState(null);
    const [fromDatError, setSelectedFromDateError] = useState(false);

    const handleFromDateChange = (date) => {
        setSelectedFromDateError(date === null);
        if (toDate && date >= toDate)
            setSelectedFromDateError(true);
        setSelectedFromDate(date);
    };

    const fromDateIsValid = (momentDate) => {
        const itemDate = momentDate.toDate();
        const currentDate = new Date();
        if (toDate)
            return itemDate <= currentDate && itemDate < toDate;
        return itemDate <= currentDate;
    };
    const [toDate, setSelectedToDate] = useState(null);
    const [toDateError, setSelectedToDateError] = useState(null);

    const handleToDateChange = (date) => {
        setSelectedToDateError(date === null);
        if (fromDate && date <= fromDate)
            setSelectedToDateError(true);
        setSelectedToDate(date);
    };

    const toDateIsValid = (momentDate) => {
        const itemDate = momentDate.toDate();
        const currentDate = new Date();
        if (fromDate)
            return itemDate <= currentDate && fromDate < itemDate ;
        return itemDate <= currentDate;
    };

    const onSubmit = () => {
        let url = createUrl(term.value, account.value, filter.value, tweetLang.value, geocode.value, near.value, within.value, fromDate, toDate, localTime);
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
                    <DateTimePicker
                        input={true}
                        isValidDate={fromDateIsValid}
                        label={keyword("twitter_from-date")}
                        dateFormat={"YYYY-MM-DD"}
                        timeFormat={"HH:mm:ss"}
                        handleChange={handleFromDateChange}
                        error={fromDatError}
                    />
                </div>
                <div>
                    <DateTimePicker
                        input={true}
                        isValidDate={toDateIsValid}
                        label={keyword("twitter_to-date")}
                        dateFormat={"YYYY-MM-DD"}
                        timeFormat={"HH:mm:ss"}
                        handleChange={handleToDateChange}
                        error={toDateError}
                    />
                </div>
            </Box>
            <FormControl component="fieldset">
                <RadioGroup aria-label="position" name="position" value={localTime}
                            onChange={e => setLocalTime(e.target.value)} row>
                    <FormControlLabel
                        value={"true"}
                        control={<Radio color="primary"/>}
                        label={keyword("twitter_local_time")}
                        labelPlacement="end"
                    />
                    <FormControlLabel
                        value={"false"}
                        control={<Radio color="primary"/>}
                        label={keyword("twitter_sna_gmt")}
                        labelPlacement="end"
                    />
                </RadioGroup>
            </FormControl>
            <Box m={2}/>
            <Button variant="contained" color="primary" onClick={onSubmit}>
                {keyword("button_submit")}
            </Button>
        </Paper>
    )
};
export default TwitterAdvancedSearch;