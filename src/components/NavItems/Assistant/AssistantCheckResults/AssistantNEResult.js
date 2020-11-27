import React from "react";
import {useSelector} from "react-redux";
import Card from "@material-ui/core/Card";
import {CardHeader} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";

import tsv from "../../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import ReactWordcloud from "react-wordcloud";

const AssistantNEResult = () => {

    // necessary components
    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);
    const classes = useMyStyles()

    // state related
    const neResult = useSelector(state => state.assistant.neResult);
    const neLoading = useSelector(state => state.assistant.neLoading);

    const options = {
        rotations: 1,
        rotationAngles: [0],
    };

    return (
        <Grid item xs={12}>
            <Card>
                <CardHeader className={classes.assistantCardHeader}
                            title={keyword("named_entity_title")}
                />
                <LinearProgress hidden={!neLoading}/>
                <CardContent>
                    <ReactWordcloud words={neResult} options={options}/>
                </CardContent>
            </Card>
        </Grid>
    )
}
export default AssistantNEResult;