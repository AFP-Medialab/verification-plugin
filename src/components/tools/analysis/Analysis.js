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
import MySnackbar from "../../MySnackbar/MySnackbar";
import Box from "@material-ui/core/Box";
import YoutubeResults from "./Results/YoutubeResults.js"
import TwitterResults from "./Results/TwitterResults";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
        marginTop: 5,
        textAlign: "center",
    },
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
    error: {
        backgroundColor: theme.palette.error.main,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
    card: {
        maxWidth: "60%",
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
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
    const [errors, setErrors] = useState("");
    const [reprocess, setReprocess] = useState(false);
    const [url, setUrl] = useState("");

    const [job, setJob] = useState(null);
    const [report, setReport] = useState(null);

    const reprocessToggle = () => {
        setReprocess(!reprocess);
    };

    const urlChange = (event) => {
        setUrl(event.target.value);
    };

    const handleErrors = (arg) => {
        setErrors(arg);
        setReport(null);
        setLoading(false);
    };

    const handleCreateJobs = (response) => {
        if (keyword("table_error_" + response["data"]["status"]) !== undefined) {
            handleErrors(keyword("table_error_" + response["data"]["status"]));
        } else {
            axios.get("http://mever.iti.gr/caa/api/v4/videos/jobs/" + response["data"]["id"])
                .then(response => handleJobsStatus(response))
                .catch(errors => handleErrors(errors));
        }
    };

    const handleJobsStatus = (response) => {
        if (keyword("table_error_" + response["data"]["status"]) !== undefined) {
            handleErrors(keyword("table_error_" + response["data"]["status"]));
        } else {
            setJob(response["data"]);
            axios.get("http://mever.iti.gr/caa/api/v4/videos/reports/" + response["data"]["media_id"])
                .then(response => handleMedia(response))
                .catch(errors => handleErrors(errors));
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (job === null || job["status"] === "done" || job["status"] === "unavailable") {
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
            setLoading(false);
        }
    };


    const submitForm = () => {
        if (!loading) {
            setLoading(true);
            setJob(null);
            setReport(null);
            setErrors("");
            if (!url || url === "")
            {
                handleErrors(keyword("table_error_empty_url"));
                return;
            }
            if (url.includes(" "))
            {
                handleErrors(keyword("table_error_unavailable"));
                return;
            }
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
                    id="standard-full-width"
                    label={keyword("api_input")}
                    placeholder="URL"
                    fullWidth
                    disabled={loading}
                    onChange={(e) => urlChange(e)}
                />
                <Box m={2}/>
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
                <Box m={1}/>
                <LinearProgress hidden={!loading}/>
            </Paper>
            {
                report !== null && url != null && url.startsWith("https://www.youtube.com/") &&
                <YoutubeResults report={report}/>
            }
            {
                report !== null && url != null && url.startsWith("https://twitter.com/") &&
                <TwitterResults report={report}/>
            }
            <div>
                {
                    errors && <MySnackbar variant="error" message={errors} onClick={() => setErrors("")}/>
                }
            </div>
        </div>);
};
export default Analysis;