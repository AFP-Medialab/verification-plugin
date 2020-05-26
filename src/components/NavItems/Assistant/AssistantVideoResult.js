import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";
import Iframe from "react-iframe";
import React from "react";
import {useSelector} from "react-redux";

import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import tsv from "../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";

const AssistantVideoResult = () => {
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);
    const resultUrl = useSelector(state => state.assistant.processUrl);

    const preprocessLinkForEmbed = (resultUrl) => {
        let embedURL = resultUrl;
        if (!embedURL.includes("/embed/")) {
            let ids = embedURL.match("(v=|youtu.be\/)([a-zA-Z0-9_-]+)[&|\?]?");
            if (ids) {
                let id = ids[ids.length-1];
                embedURL = "http://www.youtube.com/embed/" + id;
            }
        }
        return embedURL;
    }

    return (
        <Grid item xs = {6} hidden={resultUrl==""}>
            <Card variant = "outlined">
                <CardContent>
                    <Typography variant="h5" component="h2">
                        {keyword("media_to_process")}
                    </Typography>
                    <Typography className={classes.title} color="primary">
                        {<a href={resultUrl} target="_blank"> {resultUrl} </a>}
                    </Typography>
                </CardContent>
                <CardMedia>
                    <Iframe
                        frameBorder="0"
                        url = {preprocessLinkForEmbed(resultUrl)}
                        allow="fullscreen"
                        height="400"
                        width="100%"
                    />
                </CardMedia>
            </Card>
        </Grid>
    );
}
export default AssistantVideoResult;