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
import {setError} from "../../../../redux/actions/errorActions";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import convertToGMT from "../../../utility/DataTimePicker/convertToGMT";
import dateFormat from "dateformat"
import useTwitterSnaRequest from "./useTwitterSnaRequest";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from "@material-ui/core/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Plot from "react-plotly.js";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import CustomTable from "../../../utility/CustomTable/CustomTable";

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


    const [hashTagInput, setHashTagInput] = useState(
        request && request.search.search ?
            request.search.search
            : "#fake"
    );
    const [hashTagError, setHashTagError] = useState(false);

    const [andInput, setAndInput] = useState(
        request && request.search.and ?
                request.search.and.join(" ")
                : ""
    );
    const [orInput, setOrInput] = useState(
        request && request.search.or ?
            request.search.or.join(" ")
            : ""
    );
    const [notInput, setNotInput] = useState(
        request && request.search.not ?
            request.search.not.join(" ")
            : ""
    );
    const [usersInput, setUsersInput] = useState(
        request && request.user_list ?
            request.user_list.join(" ")
            : ""
    );
    const [since, setSince] = useState(request ? request.from : new Date("11-06-2019"));         // change default values
    const [until, setUntil] = useState(request ? request.until : new Date("11-07-2019"));         // change default values
    const [langInput, setLangInput] = useState(request && request.lang ? "lang_" + request.lang : "lang_all");
    const [openLangInput, setLangInputOpen] = React.useState(false);
    const [filters, setFilers] = useState(request && request.media ? request.media : "none");
    const [verifiedUsers, setVerifiedUsers] = useState(request && request.verified ? request.verified : "false");
    const [localTime, setLocalTime] = useState("true");

    const [submittedRequest, setSubmittedRequest] = useState(null);
    useTwitterSnaRequest(submittedRequest);

    const handleErrors = (e) => {
        dispatch(setError(e))
    };

    function stringToList(string) {
        let newStr = string.replace(/@/g, " ");
        let res = newStr.split(" ");
        return res.filter(function (el) {
            return el !== "";
        });
    }

    const makeRequest = () => {
        //Creating Request Object.
        let and_list, or_list, not_list = null;

        if (andInput !== "")
            and_list = andInput.trim().split(" ");
        if (orInput !== "")
            or_list = orInput.trim().split(" ");
        if (notInput !== "")
            not_list = notInput.trim().split(" ");

        let searchObj = {
            "search": hashTagInput,
            "and": and_list,
            "or": or_list,
            "not": not_list
        };

        const newFrom = (localTime === "false") ? convertToGMT(since) : since;
        const newUntil = (localTime === "false") ? convertToGMT(until) : until;

        return {
            "search": searchObj,
            "lang": (langInput === "lang_all") ? null : langInput.replace("lang_", ""),
            "user_list": stringToList(usersInput),
            "from": dateFormat(newFrom, "yyyy-mm-dd hh:MM:ss"),
            "until": dateFormat(newUntil, "yyyy-mm-dd hh:MM:ss"),
            "verified": verifiedUsers === "true",
            "media": (filters === "none") ? null : filters,
            "retweetsHandling": null
        };
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
        //Mandatory Fields errors
        if (hashTagInput === "") {
            handleErrors(keyword("twitterStatsErrorMessage"));
            setHashTagError(true);
            return;
        }
        if (since === null || since === "") {
            handleErrors(keyword("twitterStatsErrorMessage"));
            setSince("");
            return;
        }
        if (until === null || until === "") {
            handleErrors(keyword("twitterStatsErrorMessage"));
            setUntil("");
            return;
        }
        const newRequest = makeRequest();
        setSubmittedRequest(newRequest);
    };

    return (
        <div>
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
                    value={usersInput}
                    onChange={e => setUsersInput(e.target.value)}
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

                <Box m={2}/>
                <Grid container justify={"space-around"} spacing={5}>
                    <Grid item>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">{keyword("twitter_sna_media")}</FormLabel>
                            <RadioGroup aria-label="position" name="position" value={filters}
                                        onChange={handleFiltersChange}
                                        row>
                                <FormControlLabel
                                    value={"none"}
                                    control={<Radio color="primary"/>}
                                    label={keyword("twitterStats_media_none")}
                                    labelPlacement="end"
                                />
                                <FormControlLabel
                                    value={"image"}
                                    control={<Radio color="primary"/>}
                                    label={keyword("twitterStats_media_images")}
                                    labelPlacement="end"
                                />
                                <FormControlLabel
                                    value={"video"}
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
                    <Grid item>
                        <FormControl className={classes.formControl}>
                            <InputLabel id="demo-controlled-open-select-label">{keyword("lang_choices")}</InputLabel>
                            <Select
                                labelid="demo-controlled-open-select-label"
                                id="demo-controlled-open-select"
                                open={openLangInput}
                                onClose={() => setLangInputOpen(false)}
                                onOpen={() => setLangInputOpen(true)}
                                value={langInput}
                                onChange={e => setLangInput(e.target.value)}
                            >
                                <MenuItem value={"lang_all"}>{keyword("lang_all")}</MenuItem>
                                <MenuItem value={"lang_fr"}>{keyword("lang_fr")}</MenuItem>
                                <MenuItem value={"lang_en"}>{keyword("lang_en")}</MenuItem>
                                <MenuItem value={"lang_es"}>{keyword("lang_es")}</MenuItem>
                                <MenuItem value={"lang_ar"}>{keyword("lang_ar")}</MenuItem>
                                <MenuItem value={"lang_de"}>{keyword("lang_de")}</MenuItem>
                                <MenuItem value={"lang_it"}>{keyword("lang_it")}</MenuItem>
                                <MenuItem value={"lang_id"}>{keyword("lang_id")}</MenuItem>
                                <MenuItem value={"lang_pt"}>{keyword("lang_pt")}</MenuItem>
                                <MenuItem value={"lang_ko"}>{keyword("lang_ko")}</MenuItem>
                                <MenuItem value={"lang_tr"}>{keyword("lang_tr")}</MenuItem>
                                <MenuItem value={"lang_ru"}>{keyword("lang_ru")}</MenuItem>
                                <MenuItem value={"lang_nl"}>{keyword("lang_nl")}</MenuItem>
                                <MenuItem value={"lang_hi"}>{keyword("lang_hi")}</MenuItem>
                                <MenuItem value={"lang_no"}>{keyword("lang_no")}</MenuItem>
                                <MenuItem value={"lang_sv"}>{keyword("lang_sv")}</MenuItem>
                                <MenuItem value={"lang_fi"}>{keyword("lang_fi")}</MenuItem>
                                <MenuItem value={"lang_da"}>{keyword("lang_da")}</MenuItem>
                                <MenuItem value={"lang_pl"}>{keyword("lang_pl")}</MenuItem>
                                <MenuItem value={"lang_hu"}>{keyword("lang_hu")}</MenuItem>
                                <MenuItem value={"lang_fa"}>{keyword("lang_fa")}</MenuItem>
                                <MenuItem value={"lang_he"}>{keyword("lang_he")}</MenuItem>
                                <MenuItem value={"lang_ur"}>{keyword("lang_ur")}</MenuItem>
                                <MenuItem value={"lang_th"}>{keyword("lang_th")}</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Box m={2}/>
                <Button variant="contained" color="primary" onClick={onSubmit}>
                    {keyword("button_submit")}
                </Button>
            </Paper>
            {
                result &&
                <Paper className={classes.root}>
                    {
                        result.pieCharts &&
                        result.pieCharts.map((obj, index) => {
                            return (
                                <ExpansionPanel key={index}>
                                    <ExpansionPanelSummary
                                        expandIcon={<ExpandMoreIcon/>}
                                        aria-controls={"panel" + index + "a-content"}
                                        id={"panel" + index + "a-header"}
                                    >
                                        <Typography className={classes.heading}>{keyword(obj.title)}</Typography>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        <Box alignItems="center" justifyContent="center" width={"100%"}>
                                            <Plot data={obj.json} layout={obj.layout} config={obj.config}/>
                                        </Box>
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                            )
                        })
                    }
                    <CustomTable/>
                </Paper>
            }
        </div>)
};
export default TwitterSna;