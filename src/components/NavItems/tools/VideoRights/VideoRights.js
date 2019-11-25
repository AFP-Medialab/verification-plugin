import {Paper} from "@material-ui/core";
import {useSelector} from "react-redux";
import CustomTile from "../../../utility/customTitle/customTitle";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import React, {useEffect, useState} from "react";
import useVideoRightsTreatment from "./useVideoRightsTreatment";
import useMyStyles from "../../../utility/MaterialUiStyles/useMyStyles";
import VideoRightsResults from "./VideoRightsResults";

const VideoRights = () => {
    const classes = useMyStyles();
    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };


    const resultUrl = useSelector(state => state.videoRights.url);
    const resultResult = useSelector(state => state.videoRights.result);
    const isLoading = useSelector(state => state.videoRights.loading);


    const [input, setInput] = useState(resultUrl);
    const [submitted, setSubmitted] = useState(null);
    useVideoRightsTreatment(submitted);

    const submitForm = () => {
        if (!isLoading)
            setSubmitted(input);
    };

    return (
        <div>
            <Paper className={classes.root}>
                <CustomTile> {keyword("copyright_title")}  </CustomTile>
                <br/>
                <TextField
                    value={input}
                    id="standard-full-width"
                    label={keyword("copyright_input")}
                    placeholder="URL"
                    fullWidth
                    disabled={isLoading}
                    onChange={e => setInput(e.target.value)}
                />
                <Box m={2}/>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                    onClick={submitForm}
                >
                    {keyword("button_submit")}
                </Button>
                <Box m={1}/>
                <LinearProgress hidden={!isLoading}/>
            </Paper>
            {
                resultResult &&
                <VideoRightsResults result={resultResult}/>
            }
        </div>
    )
};
export default VideoRights;