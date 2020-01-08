import {Paper} from "@material-ui/core";
import {useSelector} from "react-redux";
import CustomTile from "../../../Shared/CustomTitle/CustomTitle";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import React, {useState} from "react";
import useVideoRightsTreatment from "./Hooks/useVideoRightsTreatment";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import VideoRightsResults from "./Results/VideoRightsResults";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/VideoRights.tsv";
import {submissionEvent} from "../../../Shared/GoogleAnalytics/GoogleAnalytics";

const VideoRights = () => {
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/VideoRights.tsv", tsv);

    const resultUrl = useSelector(state => state.videoRights.url);
    const resultResult = useSelector(state => state.videoRights.result);
    const isLoading = useSelector(state => state.videoRights.loading);

    const [input, setInput] = useState(resultUrl);
    const [submitted, setSubmitted] = useState(null);
    useVideoRightsTreatment(submitted);

    const submitForm = () => {
        if (!isLoading) {
            submissionEvent(input);
            setSubmitted(input);
        }
    };

    return (
        <div>
            <Paper className={classes.root}>
                <CustomTile text={keyword("copyright_title")}/>
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