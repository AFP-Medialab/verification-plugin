import {Box} from "@material-ui/core";
import React, {useState} from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {useInput} from "../../../../Hooks/useInput";
import {createUrl} from "./createUrl";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import FormControl from "@material-ui/core/FormControl";
import DateTimePicker from "../../../Shared/DateTimePicker/DateTimePicker";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/Thumbnails.tsv";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import {submissionEvent} from "../../../Shared/GoogleAnalytics/GoogleAnalytics";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import { ReactComponent as TwitterAdvancedSearchIcon } from '../../../NavBar/images/SVG/Search/Twitter_search.svg';
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";

const TwitterAdvancedSearch = () => {
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/TwitterAdvancedSearch.tsv", tsv);
    const keywordAllTools = useLoadLanguage("components/NavItems/tools/Alltools.tsv", tsv);

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
        submissionEvent(url);
        window.open(url);
    };

    return (
        <div>
            <HeaderTool name={keywordAllTools("navbar_twitter")} description={keywordAllTools("navbar_twitter_description")} icon={<TwitterAdvancedSearchIcon style={{ fill: "#51A5B2" }} />}/>

            <Card className={classes.rootCard}>
                <CardHeader
                    title={keyword("cardheader_parameters")}
                    className={classes.headerUpladedImage}
                />
                <div className={classes.root2}>

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
                            label={keyword("twitter_from_date")}
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
                            label={keyword("twitter_to_date")}
                            dateFormat={"YYYY-MM-DD"}
                            timeFormat={"HH:mm:ss"}
                            handleChange={handleToDateChange}
                            error={toDateError}
                        />
                    </div>
                    
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
                                label={keyword("twitter_gmt")}
                                labelPlacement="end"
                            />
                        </RadioGroup>
                    </FormControl>
                    <Box m={2}/>
                    <Button variant="contained" color="primary" onClick={onSubmit}>
                        {keyword("button_submit")}
                    </Button>

                </div>
            </Card>
        </div>
    )
};
export default TwitterAdvancedSearch;