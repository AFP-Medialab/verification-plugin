import React from "react";
import {useDispatch, useSelector} from "react-redux";

import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import {CardHeader} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";

import {CONTENT_TYPE, KNOWN_LINKS, selectCorrectActions} from "./AssistantRuleBook";
import history from "../../Shared/History/History";
import tsv from "../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";
import {submitUpload} from "../../../redux/actions/tools/assistantActions";

const AssistantFileSelected = () => {

    const classes = useMyStyles();
    const dispatch = useDispatch();
    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);

    const inputUrl = useSelector(state => state.assistant.inputUrl);
    const processUrl = useSelector(state => state.assistant.processUrl);
    const contentType = useSelector(state => state.assistant.processUrlType);

    const getActionList = (contentType) => {
        let known_link = KNOWN_LINKS.OWN;
        return selectCorrectActions(contentType, known_link, known_link, "");
    }

    const imageActions = getActionList(CONTENT_TYPE.IMAGE)
    const videoActions = getActionList(CONTENT_TYPE.VIDEO)

    const handleClick = (path) => {
        history.push("/app/" + path + "/" + KNOWN_LINKS.OWN + "/" + contentType)
    };

    const generateList = (title, contentType, actionList) => {return (
        <Grid item xs={6}>
            <Box mx={2} my={0.5}>
                <Typography variant={"h6"} style={{"fontWeight": "bold"}}>
                    {title}
                </Typography>
            </Box>
            <List>
                {actionList.map((action, index) => {
                    return (
                        <Box m={2} key={index}>
                            <Card className={classes.assistantCards} variant={"outlined"}>
                                <ListItem
                                    onClick={() => {
                                        dispatch(submitUpload(contentType))
                                        handleClick(action.path, action.useInputUrl ? inputUrl : processUrl)
                                    }}>
                                    <ListItemAvatar>
                                        <Avatar variant={"square"} src={action.icon}/>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography component={"span"}>
                                                <Box fontWeight="fontWeightBold">
                                                    {keyword(action.title)}
                                                </Box>
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography color={"textSecondary"} component={"span"}>
                                                <Box fontStyle="italic">{keyword(action.text)}</Box>
                                            </Typography>
                                        }/>
                                </ListItem>
                            </Card>
                        </Box>)
                })}
            </List>
        </Grid>
    )}

    return (
        <Box my={3} boxShadow={3}>
            <Card variant={"outlined"}>
                <CardHeader
                    className={classes.assistantCardHeader}
                    title={
                        <Typography style={{fontWeight: "bold", fontSize: 20}}>
                            {keyword("assistant_choose_tool")}
                        </Typography>}
                />
                <CardContent>
                    <Grid container spacing={2}>
                        {generateList(keyword("upload_image"), CONTENT_TYPE.IMAGE, imageActions)}
                        {generateList(keyword("upload_video"), CONTENT_TYPE.VIDEO, videoActions)}
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};
export default AssistantFileSelected;