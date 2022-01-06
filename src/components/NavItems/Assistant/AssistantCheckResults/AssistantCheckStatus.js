import React from "react";
import {useDispatch, useSelector} from "react-redux";

import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {IconButton} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

import tsv from "../../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";

import {setStateExpanded} from "../../../../redux/actions/tools/assistantActions";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";


const AssistantCheckStatus = () => {

    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);
    const classes = useMyStyles()
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
    // const mtTitle = keyword("mt_title")
    // const mtFailState = useSelector(state => state.assistant.mtFail)
    const neTitle = keyword("ne_title")
    const neFailState = useSelector(state => state.assistant.neFail)

    const failStates = [
        {"title": hpTitle, "failed": hpFailState},
        {"title": scTitle, "failed": scFailState},
        {"title": dbkfMediaTitle, "failed": dbkfMediaFailState},
        {"title": dbkfTextTitle, "failed": dbkfTextFailState},
        // {"title": mtTitle, "failed": mtFailState},
        {"title": neTitle, "failed": neFailState}]


    return (
        <Box pl={1}>
            <Typography component={"span"}>
                <Box color={"orange"} fontStyle="italic">
                    {keyword("status_subtitle")}
                    <IconButton className={classes.assistantIconRight}
                                onClick={() => dispatch(setStateExpanded(!stateExpanded))}>
                        <ExpandMoreIcon style={{"color": "orange"}}/>
                    </IconButton>
                </Box>
            </Typography>

            <Collapse in={stateExpanded} className={classes.assistantBackground}>
                <List disablePadding={true}>
                    {failStates.map((value, key) => (
                        value.failed ?
                            <ListItem key={key}>
                                <IconButton>
                                    <ErrorOutlineIcon color={"error"}/>
                                </IconButton>
                                <ListItemText
                                    primary={value.title}
                                />
                            </ListItem> : null
                    ))}
                </List>
            </Collapse>
        </Box>
    )
}
export default AssistantCheckStatus;