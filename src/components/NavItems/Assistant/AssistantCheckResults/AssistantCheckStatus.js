import React from "react";
import {useDispatch, useSelector} from "react-redux";

import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Collapse from "@material-ui/core/Collapse";
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Grid from "@material-ui/core/Grid";
import {IconButton} from "@material-ui/core";
import PlaylistAddCheckIconOutlined from '@material-ui/icons/PlaylistAddCheck';
import Typography from "@material-ui/core/Typography";

import tsv from "../../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";

import {setStateExpanded} from "../../../../redux/actions/tools/assistantActions";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";


const AssistantCheckStatus = () => {

    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);
    const dispatch = useDispatch()
    const stateExpanded = useSelector(state => state.assistant.stateExpanded)

    const hpTitle = keyword("hyperpartisan_title")
    const hpFailState = useSelector(state => state.assistant.hpFail)
    const scTitle = keyword("source_cred_title")
    const scFailState = useSelector(state => state.assistant.inputSCFail)
    const dbkfTextTitle = keyword("dbkf_text_title")
    const dbkfTextFailState = useSelector(state => state.assistant.dbkfTextMatchFail)
    const dbkfMediaTitle = keyword("dbkf_media_title")
    const dbkfMediaFailState = useSelector(state => state.assistant.dbkfMediaMatchFail)
    const neTitle = keyword("ne_title")
    const neFailState = useSelector(state => state.assistant.neFail)

    const failStates = [
        {"title": hpTitle, "failed": hpFailState},
        {"title": scTitle, "failed": scFailState},
        {"title": dbkfMediaTitle, "failed": dbkfMediaFailState},
        {"title": dbkfTextTitle, "failed": dbkfTextFailState},
        {"title": neTitle, "failed": neFailState}]


    return (
        <Grid item xs={12}>
            <Card variant={"outlined"} style={{"borderColor": "orange", "borderStyle": "solid", "borderWidth": "3px"}}>
                <div style={{"display": "flex"}}>
                    <CardMedia style={{backgroundColor: "orange"}}>
                        <Box m={1}>
                            <PlaylistAddCheckIconOutlined fontSize={"large"}/>
                        </Box>
                    </CardMedia>
                    <Box m={1}/>
                    <div>
                        <Typography component={"span"} variant={"h6"} style={{color: "orange"}}><Box
                            fontWeight="fontWeightBold">{keyword("status_title")}</Box></Typography>
                        <Typography component={"span"}><Box color={"black"}
                                                            fontStyle="italic">{keyword("status_subtitle")} </Box></Typography>
                    </div>
                    <IconButton style={{"marginLeft": "auto"}}
                                onClick={() => dispatch(setStateExpanded(!stateExpanded))}><ExpandMoreIcon
                        style={{"color": "orange"}}/></IconButton>
                </div>
            </Card>


            <Collapse in={stateExpanded} style={{"backgroundColor": "transparent"}}>
                <Box m={3}/>
                <List disablePadding={true}>
                    {failStates.map((value, key) => (
                        value.failed ?
                            <ListItem key={key}>
                                <ListItemText
                                    primary={
                                        <Typography component={"div"} align={"left"}>
                                            <Box fontWeight="fontWeightBold">
                                                {value.title}
                                            </Box>
                                        </Typography>}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end">
                                        <ErrorOutlineIcon color={"error"}/>
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem> : null
                    ))}
                </List>
            </Collapse>
        </Grid>
    )
}
export default AssistantCheckStatus;