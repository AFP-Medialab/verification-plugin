import {Paper} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useDispatch, useSelector} from "react-redux";
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


    const resultUrl = useSelector(state => state.tool.videoRights.url);
    const resultResult = useSelector(state => state.tool.videoRights.result);
    const isLoading = useSelector(state => state.tool.videoRights.loading);


    const [input, setInput] = useState(resultUrl);
    const [submitted, setSubmitted] = useState(null);
    useVideoRightsTreatment(submitted);

    const submitForm = () => {
        if (!isLoading)
            setSubmitted(input);
    };

    let res =         {
        kind : "youTubeVideos",
        licence : "youtube",
        user:{
            url: "https://www.youtube.com/channel/UC_x5XG1OV2P6uZZ5FSM9Ttw",
            name: "Google Developers"
        },
        RIGHTS_APP: "https://rights.invid.udl.cat/youtube",
        id: "0fj7avs9k4Q",
        terms: [
            {
                status : "Permitted",
                action : "Embed",
                description : "To insert media in Web pages without requiring authorisation from the content owner. It is based on the rights already granted to YouTube by the owner. Therefore, the embedding should be done following these instructions"
            },
            {
                status : "Prohibited",
                action : "Other reuse",
                description : "Any other kinds of reuse, like re-broadcasting or re-publishing it"
            },
            {
                status : "Required",
                action : "test",
                description : "Any other kinds of reuse, like re-broadcasting or re-publishing it"
            },
        ],
        attribution : "Google Developers (2019, November 21). Sign in with Apple for Firebase Authentication, Go language turns 10, & much more!. Retrieved from https://www.youtube.com/watch?v=0fj7avs9k4Q"

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
                res &&
                <VideoRightsResults result={res}/>
            }
        </div>
    )
};
export default VideoRights;