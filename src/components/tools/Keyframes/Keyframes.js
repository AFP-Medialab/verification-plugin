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

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
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

    const [job, setJob] = useState(null);
    const [result, setResult] = useState(null);

    console.log(process.env.REACT_APP_KEYFRAME_TOKEN);

    useEffect(() => {
        const interval = setInterval(() => {

            if (job === null || job["status"] === "VIDEO_SEGMENTATION_ANALYSIS_COMPLETED") {
                console.log("finished");
                clearInterval(interval);
            }
            else if (job["status"] === "VIDEO_DOWNLOAD_FAILED"){
                console.log("error download fail");
            }
            else {
                axios.post("http://multimedia2.iti.gr/video_analysis/segmentation",
                    {
                        "video_url": url,
                        "user_key": process.env.REACT_APP_KEYFRAME_TOKEN,
                        "overwrite": 0

                    })
                    .then(response => {})
                    .catch(errors => {});
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [job]);

    return (
        <Paper className={classes.root}>
            <CustomTile> {keyword("keyframes_title")}  </CustomTile>
            <br/>
            <Box display={localFile ? "none" : "block"}>
                <TextField
                    id="standard-full-width"
                    label={keyword("keyframes_input")}
                    style={{margin: 8}}
                    placeholder="URL"
                    fullWidth
                    disabled={false}
                    onChange={(e) => urlChange(e)}
                />
                <Box m={2}/>
                <Button variant="contained" color="primary" onClick={toggleLocal}>
                    {keyword("button_localfile")}
                </Button>
                <Box m={2}/>
                <Button variant="contained" color="primary">
                    {keyword("button_submit")}
                </Button>
            </Box>
            <Box display={!localFile ? "none" : "block"}>
                <Button variant="contained" color="primary" onClick={toggleLocal}>
                    {keyword("forensic_card_back")}
                </Button>
                <LocalFile/>
            </Box>
        </Paper>
    );
};
export default Keyframes;