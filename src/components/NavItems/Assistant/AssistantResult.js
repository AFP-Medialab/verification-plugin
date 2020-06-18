import React from "react";
import {useDispatch, useSelector} from "react-redux";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import FaceIcon from "@material-ui/icons/Face";
import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import {Paper} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";

import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import CloseResult from "../../Shared/CloseResult/CloseResult";
import {
    cleanAssistantState,
    setImageVideoSelected,
    setProcessUrl,
    setProcessUrlActions
} from "../../../redux/actions/tools/assistantActions";
import history from "../../Shared/History/History";
import tsv from "../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";
import AssistantImageResult from "./AssistantImageResult";
import AssistantVideoResult from "./AssistantVideoResult";


const AssistantResult = () => {

    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);
    const inputUrl = useSelector(state => state.assistant.inputUrl);
    const processUrl = useSelector(state => state.assistant.processUrl);
    const processUrlActions = useSelector(state => state.assistant.processUrlActions);
    const resultProcessType = useSelector(state => state.assistant.processUrlType);
    const imageVideoSelected = useSelector(state => state.assistant.imageVideoSelected);
    const resultIsImage = resultProcessType === "Image";

    const dispatch = useDispatch();

    const handleClick = (path, resultUrl) => {
        if(resultUrl!=null) {history.push("/app/" + path + "/" + encodeURIComponent(resultUrl))}
        // in case of image/video upload being selected
        else{history.push("/app/" + path)}
    };

    const cleanAssistantResult = () => {
        dispatch(setProcessUrl(null));
        dispatch(setImageVideoSelected(false));
        dispatch(setProcessUrlActions(null, []))
    }

    return (
        <Paper className={classes.root}>
            <CloseResult onClick={() => cleanAssistantResult()}/>
            <Grid container spacing={2}>

                {(!imageVideoSelected) ? ((resultIsImage) ? <AssistantImageResult/> : <AssistantVideoResult/>) : null}

                <Grid  item xs = {6}>
                    <Card variant = "outlined">
                        <Box m = {2}/>
                        <Typography variant="h5" component="h2">
                            {keyword("things_you_can_do_header")}
                        </Typography>
                        <Typography className={classes.title} color="primary">
                            {keyword("things_you_can_do")}
                        </Typography>
                        <Box m = {2}/>

                        <Grid container spacing={2}>
                            {processUrlActions.map((action) => {return (
                                <Grid container m = {4}>
                                    <Card className={classes.assistantCards}  variant = "outlined"
                                          onClick={
                                              () => handleClick(action.path, action.use_known_url ? inputUrl : processUrl)
                                          }>
                                        <CardActionArea><CardContent>
                                                <Typography className={classes.title} m={2}>{keyword(action.text)}</Typography>
                                                <Button aria-colspan={2} size = "medium">
                                                    {<Icon className={classes.iconRootDrawer} fontSize={"large"}>
                                                        <img className={classes.imageIconDrawer} src={action.icon}/>
                                                    </Icon>}
                                                    {keyword(action.title)}
                                                </Button>
                                        </CardContent></CardActionArea>
                                    </Card>
                                </Grid>
                            )})}
                        </Grid>

                    </Card>
                </Grid>
            </Grid>
        </Paper>
    );
};
export default AssistantResult;