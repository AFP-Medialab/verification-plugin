import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";
import React from "react";
import {useSelector} from "react-redux";

import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import tsv from "../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";

const AssistantImageResult = () => {
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);
    const resultUrl = useSelector(state => state.assistant.processUrl);
    
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
                    <img src={resultUrl} height={"100%"} width={"100%"}/>
                </CardMedia>
            </Card>
        </Grid>
    );
}
export default AssistantImageResult;