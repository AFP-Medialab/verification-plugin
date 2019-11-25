import React, {useState} from "react";
import useMyStyles from "../../../utility/MaterialUiStyles/useMyStyles";
import {useDispatch, useSelector} from "react-redux";
import {Paper} from "@material-ui/core";
import CustomTile from "../../../utility/customTitle/customTitle";
import TextField from "@material-ui/core/TextField";
import {KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import FormControl from "@material-ui/core/FormControl";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Box from "@material-ui/core/Box";
import FormLabel from "@material-ui/core/FormLabel";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import ListItem from "@material-ui/core/ListItem";
import {setError} from "../../../../redux/actions/errorActions";

const TwitterSna = () => {
    const classes = useMyStyles();
    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };

    const request = useSelector(state => state.twitterSna.request);
    const result = useSelector(state => state.twitterSna.result);
    const dispatch = useDispatch();

    const [hashTagInput, setHashTagInput] = useState(request ? request.hashTag : "");
    const [hashTagError, setHashTagError] = useState(false);

    const [andInput, setAndInput] = useState(request ? request.and : "");
    const [orInput, setOrInput] = useState(request ? request.or : "");
    const [notInput, setNotInput] = useState(request ? request.not : "");
    const [usersInput, setUsersInput] = useState(request ? request.users : "");
    const [since, setSince] = useState(request ? request.since : null);
    const [until, setUntil] = useState(request ? request.until : null);
    const [langInput, setLangInput] = useState(request ? request.lang : null);
    const [filters, setFilers] = useState(request ? request.filters : "none");
    const [verifiedUsers, setVerifiedUsers] = useState("false");
    const [localTime, setLocalTime] = useState("true");

    const handleEror = (e) => {
        dispatch(setError(e))
    };


    const makeRequest = () => {
        const newRequest = {};
        //Mandatory Fields
        if (hashTagInput !== "")
            newRequest.hashTag = hashTagInput;
        else{
            dispatch(setError(keyword("twitterStatsErrorMessage")));
            setHashTagError(true);
            return;
        }
        if (since === null || since === ""){
            dispatch(setError(keyword("twitterStatsErrorMessage")));
            setSince("");
            return;
        }
        else {
            newRequest.since = since;
        }
        if (until === null || until === ""){
            dispatch(setError(keyword("twitterStatsErrorMessage")));
            setUntil("");
            return;
        }
        else {
            newRequest.since = since;
        }

        //Optional Fields
        if (andInput !== "")
            newRequest.and = andInput;
        if (orInput !== "")
            newRequest.and = orInput;
        if (notInput !== "")
            newRequest.and = notInput;
        if (usersInput !== "")
            newRequest.and = usersInput;

        //handle TimeZone


        console.log(newRequest);
    };

    const handleSinceDateChange = (date) => {
        setSince(date);
    };

    const handleUntilDateChange = (date) => {
        setUntil(date);
    };

    const handleFiltersChange = event => {
        setFilers(event.target.value);
    };

    const handleVerifiedUsersChange = event => {
        setVerifiedUsers(event.target.value)
    };

    const onSubmit = () => {
        makeRequest()
    };

    return (
        <Paper className={classes.root}>
            <CustomTile> {keyword("twitter_sna_title")}  </CustomTile>
            <Box m={3}/>
            <Grid container spacing={1}>
                <Grid item className={classes.grow}>
                    <TextField
                        error={hashTagError}
                        value={hashTagInput}
                        onChange={e => {
                            setHashTagInput(e.target.value);
                            setHashTagError(false);
                        }}
                        id="standard-full-width"
                        label={keyword("twitter_sna_search")}
                        style={{margin: 8}}
                        placeholder={"#example"}
                        fullWidth
                    />
                </Grid>
                <Grid item className={classes.grow}>
                    <TextField
                        value={andInput}
                        onChange={e => setAndInput(e.target.value)}
                        id="standard-full-width"
                        label={keyword("twitter_sna_and")}
                        style={{margin: 8}}
                        placeholder={"word1 word2"}
                        fullWidth
                    />
                </Grid>
            </Grid>
            <Grid container spacing={1}>
                <Grid item className={classes.grow}>
                    <TextField
                        value={orInput}
                        onChange={e => setOrInput(e.target.value)}
                        id="standard-full-width"
                        label={keyword("twitter_sna_or")}
                        style={{margin: 8}}
                        placeholder={"word3 word4"}
                        fullWidth
                    />
                </Grid>
                <Grid item className={classes.grow}>
                    <TextField
                        value={notInput}
                        onChange={e => setNotInput(e.target.value)}
                        id="standard-full-width"
                        label={keyword("twitter_sna_not")}
                        style={{margin: 8}}
                        placeholder={"word6 word7"}
                        fullWidth
                    />
                </Grid>
            </Grid>
            <TextField
                value={notInput}
                onChange={e => setNotInput(e.target.value)}
                id="standard-full-width"
                label={keyword("twitter_sna_user")}
                style={{margin: 8}}
                placeholder={"word6 word7"}
                fullWidth
            />
            <Grid container spacing={1}>
                <Grid item className={classes.grow}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            margin="normal"
                            id="date-picker-dialog"
                            label={keyword("twitter_sna_from_date")}
                            format="MM-dd-yyyy"
                            value={since}
                            onChange={handleSinceDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                        <KeyboardTimePicker
                            margin="normal"
                            id="time-picker"
                            label="time (add to tsv)"
                            value={since}
                            onChange={handleSinceDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change time',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </Grid>
                <Grid item className={classes.grow}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            margin="normal"
                            id="date-picker-dialog"
                            label={keyword("twitter_sna_until_date")}
                            format="MM-dd-yyyy"
                            value={until}
                            onChange={handleUntilDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                        <KeyboardTimePicker
                            margin="normal"
                            id="time-picker"
                            label="time (add to tsv)"
                            value={until}
                            onChange={handleUntilDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change time',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </Grid>
            </Grid>
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
            <Grid container justify={"space-around"} spacing={5}>
                <Grid item>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">{keyword("twitter_sna_media")}</FormLabel>
                        <RadioGroup aria-label="position" name="position" value={filters} onChange={handleFiltersChange}
                                    row>
                            <FormControlLabel
                                value={"none"}
                                control={<Radio color="primary"/>}
                                label={keyword("twitterStats_media_none")}
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value={"pictures"}
                                control={<Radio color="primary"/>}
                                label={keyword("twitterStats_media_images")}
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value={"videos"}
                                control={<Radio color="primary"/>}
                                label={keyword("twitterStats_media_videos")}
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value={"both"}
                                control={<Radio color="primary"/>}
                                label={keyword("twitterStats_media_both")}
                                labelPlacement="end"
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">{keyword("twitter_sna_verified")}</FormLabel>
                        <RadioGroup aria-label="position" name="position" value={verifiedUsers}
                                    onChange={handleVerifiedUsersChange} row>
                            <FormControlLabel
                                value={"false"}
                                control={<Radio color="primary"/>}
                                label={keyword("twitterStats_verified_no")}
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value={"true"}
                                control={<Radio color="primary"/>}
                                label={keyword("twitterStats_verified_yes")}
                                labelPlacement="end"
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>
            </Grid>
            <Box m={2}/>
            <Button variant="contained" color="primary" onClick={onSubmit}>
                {keyword("button_submit")}
            </Button>
        </Paper>)
};
export default TwitterSna;