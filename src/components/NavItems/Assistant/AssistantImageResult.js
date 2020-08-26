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

    const processUrl = useSelector(state => state.assistant.processUrl);
    
    return (
        <Card variant = "outlined">
            <CardContent>
                <Typography variant="h5" component="h2">
                    {keyword("media_to_process")}
                </Typography>
                <Typography className={classes.title} color="primary">
                    {<a href={processUrl}> {processUrl.length>100 ? processUrl.substring(0,100) + "...": processUrl} </a>}
                </Typography>
            </CardContent>
            <CardMedia>
                <img src={processUrl} height={"100%"} alt={processUrl} width={"100%"}/>
            </CardMedia>
        </Card>
    );
}
export default AssistantImageResult;