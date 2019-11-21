import {Paper} from "@material-ui/core";
import useMyStyles from "../../../utility/MaterialUiStyles/useMyStyles";
import React from "react";
import Typography from "@material-ui/core/Typography";

const VideoRightsResults = (props) => {

    const classes = useMyStyles();

    const result = props.result;

    console.log(result);

    /*
    "youTubeVideos"
    "facebookVideos"
    "twitterVideos"
    */

    return (
        <Paper className={classes.root}>
            <Typography variant={"h5"}>{"Reuse Conditions"}</Typography>
        </Paper>
    )
};
export default VideoRightsResults;
