import React from "react";
import {useDispatch, useSelector} from "react-redux";

import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Grid from "@material-ui/core/Grid";
import {IconButton} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

import tsv from "../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";

import {setWarningExpanded} from "../../../redux/actions/tools/assistantActions";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import SourceCredibilityResults from "./AssistantCheckResults/SourceCredibilityResults";
import DbkfTextResults from "./AssistantCheckResults/DbkfTextResults";
import DbkfMediaResults from "./AssistantCheckResults/DbkfMediaResults";


const AssistantWarnings = () => {

    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);
    const dispatch = useDispatch()
    const warningExpanded = useSelector(state => state.assistant.warningExpanded)


    return (
        <Grid item xs={12}>

            <Card variant={"outlined"} style={{"borderColor": "red", "borderStyle": "solid", "borderWidth": "3px"}}>
                <div style={{"display": "flex"}}>
                    <CardMedia style={{backgroundColor: "red"}}>
                        <Box m={1}>
                            <ErrorOutlineOutlinedIcon fontSize={"large"}/>
                        </Box>
                    </CardMedia>
                    <Box m={1}/>
                    <div>
                        <Typography component={"span"} variant={"h6"} style={{color: "red"}}><Box fontWeight="fontWeightBold">{keyword("warning_title")}</Box></Typography>
                        <Typography component={"span"}><Box color={"black"} fontStyle="italic">{keyword("warning_subtitle")} </Box></Typography>
                    </div>
                    <IconButton style={{"marginLeft": "auto"}}
                                onClick={() => dispatch(setWarningExpanded(!warningExpanded))}><ExpandMoreIcon
                        style={{"color": "red"}}/></IconButton>
                </div>
            </Card>


            <Collapse in={warningExpanded} style={{"backgroundColor": "transparent"}}>
                <Box m={3}/>
                <SourceCredibilityResults/>

                <DbkfTextResults/>

                <DbkfMediaResults/>
            </Collapse>

            <Divider/>
        </Grid>
    )
}
export default AssistantWarnings;