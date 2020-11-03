import React from "react";
import {useSelector} from "react-redux";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";

import AssistantImageResult from "./AssistantImageResult";
import AssistantVideoResult from "./AssistantVideoResult";
import {CONTENT_TYPE} from "./AssistantRuleBook";
import history from "../../Shared/History/History";
import tsv from "../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";

const AssistantProcessUrlActions = () => {

    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);

    const inputUrl = useSelector(state => state.assistant.inputUrl);
    const processUrl = useSelector(state => state.assistant.processUrl);
    const processUrlActions = useSelector(state => state.assistant.processUrlActions);
    const resultProcessType = useSelector(state => state.assistant.processUrlType);
    const resultIsImage = resultProcessType === CONTENT_TYPE.IMAGE

    const handleClick = (path, resultUrl) => {
        if(resultUrl!=null) {
            history.push("/app/" + path + "/" + encodeURIComponent(resultUrl))}
        else{
            history.push("/app/" + path + "/" + resultProcessType)
        }
    };


    return (
        processUrlActions.length>0 ?

            <Grid container spacing = {2}>
                {(processUrl!==null) ?
                    <Grid item xs={6}>
                        {resultIsImage ? <AssistantImageResult/> : <AssistantVideoResult/>}
                    </Grid>
                    : null
                }

                <Grid  item xs = {6}>

                    <Card variant = {"outlined"}>
                        <Box m = {2}/>

                        <Typography variant="h5" component="h2">
                            {keyword("things_you_can_do_header")}
                        </Typography>
                        <Typography className={classes.title} color="primary">
                            {keyword("things_you_can_do")}
                        </Typography>

                        <Box m = {2}/>

                        <Grid container spacing={2}>
                            {processUrlActions.map((action, index) => {return (
                                <Grid container m = {4} key={index}>
                                    <Card className={classes.assistantCards}  variant = "outlined"
                                          onClick={
                                              () => handleClick(action.path, action.useInputUrl ? inputUrl : processUrl)
                                          }>
                                        <CardContent>
                                            <Typography className={classes.title} m={2}>{keyword(action.text)}</Typography>
                                            <Button aria-colspan={2} size = "medium">
                                                {<Icon className={classes.iconRootDrawer} fontSize={"large"}>
                                                    <img className={classes.imageIconDrawer} alt="" src={action.icon}/>
                                                </Icon>}
                                                {keyword(action.title)}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )})}
                        </Grid>

                    </Card>
                </Grid>
            </Grid>
            :null
    );
};
export default AssistantProcessUrlActions;