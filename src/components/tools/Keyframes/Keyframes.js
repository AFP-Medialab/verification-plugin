import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {Paper} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";

import LocalFile from "./LocalFile/LocalFile";
import CustomTile from "../../customTitle/customTitle"
import axios from "axios";
import MySnackbar from "../../MySnackbar/MySnackbar";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import Divider from '@material-ui/core/Divider';
import KeyFramesResults from "./Results/KeyFramesResults";

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

const Keyframes = () => {
    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };

    const classes = useStyles();

    const [url, setUrl] = React.useState("");
    const urlChange = (event) => {
        setUrl(event.target.value)
    };

    const [localFile, setLocalFile] = useState(false);
    const toggleLocal = () => {
        setLocalFile(!localFile);
    };

    const [videoId, setVideoId] = useState(null);
    const [job, setJob] = useState(null);
    const [result, setResult] = useState(null);
    const [errors, setErrors] = useState("");
    const [loadingMessage, setLoadingMessage] = useState(null);

    const updateJob = () => {
        if (videoId === null)
            return;
        axios.get("http://multimedia2.iti.gr/video_analysis/status/" + videoId)
            .then(response => {
                setJob(response["data"]);
                updateLoadingMessage(response["data"]);
            })
            .catch(errors => {
                console.log("status error" + errors);
                updateErrors(errors)
            });
    };

    const updateErrors = (string) => {
        if (keyword("keyframes_error_" + string) !== undefined)
            setErrors(keyword("keyframes_error_" + string));
        else
            setErrors(keyword("keyframes_error_default"));
        setLoadingMessage(null);
    };

    const updateLoadingMessage = (newJob) => {
        if (keyword("keyframes_wait_" + newJob["status"]) !== undefined) {
            setLoadingMessage(keyword("keyframes_wait_" + newJob["status"]));
        } else if (newJob["status"].endsWith("STARTED")) {
            setLoadingMessage(keyword("keyframes_wait_STARTED") + newJob["step"] + " (" + newJob["process"] + ") " + (newJob["progress"] === "N/A" ? "" : newJob["progress"]))
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (job === null) {
                clearInterval(interval);
            } else if (job["status"] !== undefined && keyword("keyframes_error_" + job["status"]) !== undefined) {
                updateErrors(job["status"])
            } else if (job["status"] === "VIDEO_SEGMENTATION_ANALYSIS_COMPLETED") {
                axios.get("http://multimedia2.iti.gr/video_analysis/result/" + videoId + "_json")
                    .then(response => {
                        setResult(response["data"])
                        setLoadingMessage(null);
                    })
                    .catch(errors => {
                        console.log(" get result error " + errors);
                        updateErrors(errors["status"])
                    });
                clearInterval(interval);
            } else {
                console.log("update job");
                updateJob();
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [job]);


    const submitUrl = () => {
        setLoadingMessage("");
        axios.post("http://multimedia2.iti.gr/video_analysis/segmentation",
            {
                "video_url": url,
                "user_key": process.env.REACT_APP_KEYFRAME_TOKEN,
                "overwrite": 0

            })
            .then(response => {
                setVideoId(response["data"]["video_id"]);
            })
            .catch((errors) => {
                console.log("segment error" + errors);
                updateErrors("Service Unavailable")
            });
    };

    useEffect(() => {
        if (videoId !== null)
            updateJob();
    }, [videoId]);

    return (
        <div>
            <Paper className={classes.root}>
                <CustomTile> {keyword("keyframes_title")}  </CustomTile>
                <br/>
                <Box display={localFile ? "none" : "block"}>
                    <Button variant="contained" color="primary" onClick={toggleLocal}>
                        {keyword("button_localfile")}
                    </Button>
                    <Box m={2}/>
                    <Divider/>
                    <TextField
                        id="standard-full-width"
                        label={keyword("keyframes_input")}
                        style={{margin: 8}}
                        placeholder="URL"
                        fullWidth
                        disabled={loadingMessage !== null}
                        onChange={(e) => urlChange(e)}
                    />
                    <Box m={2}/>
                    <Button variant="contained" color="primary" onClick={submitUrl} disabled={loadingMessage !== null}>
                        {keyword("button_submit")}
                    </Button>
                    <Box m={1}/>
                    <LinearProgress hidden={loadingMessage === null}/>
                    <Typography variant="body1" hidden={loadingMessage === null || loadingMessage === ""}>
                        {loadingMessage}
                    </Typography>
                </Box>
                <Box display={!localFile ? "none" : "block"}>
                    <Button variant="contained" color="primary" onClick={toggleLocal}>
                        {keyword("forensic_card_back")}
                    </Button>
                    <LocalFile/>
                </Box>
            </Paper>
            <div>
                {
                    result &&
                    <KeyFramesResults result={result}/>
                }
            </div>
            <div>
                {
                    errors && <MySnackbar variant="error" message={errors} onClick={() => setErrors("")}/>
                }
            </div>
        </div>
    );
};
export default Keyframes;