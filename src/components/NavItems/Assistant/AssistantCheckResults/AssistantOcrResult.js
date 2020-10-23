import React from "react";
import {useSelector} from "react-redux";
import Card from "@material-ui/core/Card";
import {CardHeader} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import FormatQuoteIcon from "@material-ui/icons/FormatQuote";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";

import tsv from "../../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";

const AssistantOcrResult = () => {

    // necessary components
    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);
    const classes = useMyStyles()

    // state related
    const text = useSelector(state => state.assistant.ocrResult);
    const ocrLoading = useSelector(state => state.assistant.ocrLoading);


    return (
        <Grid item xs={12}>
            <Card>
                <CardHeader className={classes.assistantCardHeader}
                            title={keyword("media_text_title")}
                />
                <LinearProgress hidden={!ocrLoading}/>
                <CardContent>
                    <Typography align={"center"}>
                        <FormatQuoteIcon fontSize={"large"}/>{text}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    )
}
export default AssistantOcrResult;