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
import {cleanAssistantState} from "../../../redux/actions/tools/assistantActions";
import history from "../../Shared/History/History";
import tsv from "../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";
import AssistantImageResult from "./AssistantImageResult";
import AssistantVideoResult from "./AssistantVideoResult";

const AssistantResult = () => {

    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);
    const resultUrl = useSelector(state => state.assistant.url);
    const resultData = useSelector(state => state.assistant.result);
    const resultProcessType = useSelector(state => state.assistant.processType);
    const resultIsImage = resultProcessType === "Image";

    const dispatch = useDispatch();

    const checkIfTwitterStatus = (url) => {
        return url.match("((https?:/{2})?(www.)?twitter.com/\\w{1,15}/status/\\d*)")!=null;
    };

    if (resultData.length == 0) {
        if (checkIfTwitterStatus(resultUrl)) { return null }
        else {
            return (
                <Paper>
                    <Box m={3}/>
                    <CloseResult onClick={() => dispatch(cleanAssistantState())}/>
                    <Card><CardContent className={classes.assistantText}>
                        <Typography variant={"h6"} align={"left"}>
                            <FaceIcon size={"small"}/> {keyword("assistant_error")}
                        </Typography>
                    </CardContent></Card>
                </Paper>
            );
        }
        }
    //}

    const handleClick = (path, resultUrl) => {
        history.push("/app/" + path + "/" + encodeURIComponent(resultUrl))
    };

    // some .. very nested code for results
    // explore cleaner code!
    return (
        <Paper className={classes.root}>
            <Grid container spacing={2}>
                {(resultIsImage) ? <AssistantImageResult/> : <AssistantVideoResult/>}
                <Grid  item xs = {6}>
                    <Card variant = "outlined">
                        <Box m = {2} >
                            <Typography variant="h5" component="h2">
                                {keyword("things_you_can_do_header")}
                            </Typography>
                            <Typography className={classes.title} color="primary">
                                {keyword("things_you_can_do")}
                            </Typography>
                        </Box>
                        <Box m = {2}>
                            <Grid container spacing={2}>
                                {resultData.map((action) => {
                                    return (
                                        <Grid container m = {4}>
                                            <Card className={classes.assistantCards}  variant = "outlined"
                                                  onClick={() => handleClick(action.path, resultUrl) }>
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
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Paper>
    );
};
export default AssistantResult;