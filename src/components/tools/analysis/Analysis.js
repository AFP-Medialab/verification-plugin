import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import axios from 'axios'
import {Paper} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import {green} from "@material-ui/core/colors";
import makeStyles from "@material-ui/core/styles/makeStyles";
import LinearProgress from "@material-ui/core/LinearProgress";

import CustomTile from "../../customTitle/customTitle"

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
        marginTop: 5,
        textAlign: "center",
    },
    textFiledError: {
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: theme.palette.error.main,
            },
            '&:hover fieldset': {
                borderColor: 'yellow',
            },
        },
    },
    textFiledChanged: {},
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
}));


const Analysis = () => {
    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };

    const classes = useStyles();

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("undefined");
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState("");
    const [reprocess, setReprocess] = useState(false);
    const [validUrl, setValidUrl] = useState(true);
    const [url, setUrl] = useState("");

    const [job, setJob] = useState(null);
    const [report, setReport] = useState(null);

    const reprocessToggle = () => {
        setReprocess(!reprocess);
    };

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const urlChange = (event) => {
        setUrl(event.target.value);
        setValidUrl(true);
    };

    const handleErrors = (errors) => {
        setErrors(errors.toString());
        setSuccess(false);
        setLoading(false);
        setValidUrl(false);
    };

    const handleCreateJobs = (response) => {
        if (keyword("table_error_" + response["data"]["status"]) !== undefined) {
            handleErrors(keyword("table_error_" + response["data"]["status"]));
        } else {
            console.log("set job id to =" + response["data"]["id"]);
            setJob({"id" : response["data"]["id"]});

        }
    };

    const handleJobsStatus = (response) => {
        if (keyword("table_error_" + response["data"]["status"]) !== undefined ) {
            handleErrors(keyword("table_error_" + response["data"]["status"]));
        }
        else if (response["data"]["status"] === "unavailable"){
            handleErrors("bad url");
        }
        else {
            setJob(response["data"]);
            axios.get("http://mever.iti.gr/caa/api/v4/videos/reports/" + response["data"]["media_id"])
                .then(response => handleMedia(response))
                .catch(errors => handleErrors(errors));
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (job === null || job["status"] === "done" || job["status"] === "unavailable") {
                console.log("finished");
                clearInterval(interval);
            } else {
                axios.get("http://mever.iti.gr/caa/api/v4/videos/jobs/" + job["id"])
                    .then(response => handleJobsStatus(response))
                    .catch(errors => handleErrors(errors));
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [job]);

    const handleMedia = (response) => {
        if (keyword("table_error_" + response["data"]["status"]) !== undefined) {
            handleErrors(keyword("table_error_" + response["data"]["status"]));
        } else {
            setReport(response["data"]);
            setSuccess(true);
            setLoading(false);
        }
    };


    const submitForm = () => {
        if (!loading) {
            setSuccess(false);
            setLoading(true);
            setJob(null);
            setReport(null);
            setErrors("");

            //encode video to avoid & problem arguments
            let video_url = url.replace("&", "%26");
            // construct the url for request
            let analysis_url = "http://mever.iti.gr/caa/api/v4/videos/jobs?url=" + video_url;
            if (reprocess)
                analysis_url += "&reprocess=1";

            axios.post(analysis_url)
                .then(response => handleCreateJobs(response))
                .catch(errors => handleErrors(errors));
        }
    };


    return (
        <div>
            <Paper className={classes.root}>
                <CustomTile> {keyword("api_title")}  </CustomTile>
                <br/>
                <TextField
                    error={!validUrl}
                    id="standard-full-width"
                    label={keyword("api_input")}
                    style={{margin: 8}}
                    placeholder="URL"
                    helperText=""
                    fullWidth
                    disabled={loading}
                    onChange={(e) => urlChange(e)}
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={reprocess}
                            onChange={reprocessToggle}
                            disabled={loading}
                            value="checkedBox"
                            color="primary"
                        />
                    }
                    label={keyword("api_repro")}
                />
                <Button
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    onClick={submitForm}
                >
                    {keyword("button_submit")}
                </Button>
                {loading && <LinearProgress/>}

            </Paper>
            <div>
                {
                    success && <Paper className={classes.root}>
                        <span>{report["video"]["title"]}</span>
                    </Paper>
                }
            </div>
            <div>
                {
                    (errors !== "") && <Paper className={classes.root}>
                        <span>{errors}</span>
                    </Paper>
                }
            </div>
        </div>);
};
export default Analysis;