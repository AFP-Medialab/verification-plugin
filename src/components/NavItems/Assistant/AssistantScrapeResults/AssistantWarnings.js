import React from "react";
import {useDispatch, useSelector} from "react-redux";

import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {IconButton} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

import tsv from "../../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";

import {setWarningExpanded} from "../../../../redux/actions/tools/assistantActions";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import SourceCredibilityResults from "../AssistantCheckResults/SourceCredibilityResults";
import DbkfTextResults from "../AssistantCheckResults/DbkfTextResults";
import DbkfMediaResults from "../AssistantCheckResults/DbkfMediaResults";
import HpTextResult from "../AssistantCheckResults/HpTextResult";


const AssistantWarnings = () => {

    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);
    const dispatch = useDispatch()
    const warningExpanded = useSelector(state => state.assistant.warningExpanded)

    return (
        <Box pl={1}>
            <Card variant={"outlined"}
                  style={{"borderColor": "red", "borderStyle": "solid", "display": "flex"}}>
                <CardMedia style={{backgroundColor: "red"}}>
                    <Box m={1}><ErrorOutlineOutlinedIcon fontSize={"large"}/></Box>
                </CardMedia>
                <Box m={1}/>
                <div>
                    <Typography component={"span"} variant={"h6"} color={"error"}><Box
                        fontWeight="fontWeightBold">{keyword("warning_title")}</Box>
                    </Typography>
                    <Typography component={"span"}>
                        <Box color={"black"} fontStyle="italic">{keyword("warning_subtitle")} </Box>
                    </Typography>
                </div>
                <IconButton style={{"marginLeft": "auto"}} onClick={() => dispatch(setWarningExpanded(!warningExpanded))}>
                    <ExpandMoreIcon style={{"color": "red"}}/>
                </IconButton>
            </Card>
            <Collapse in={warningExpanded} style={{"backgroundColor": "transparent"}}>
                <Box m={3}/>
                <SourceCredibilityResults/>

                <DbkfTextResults/>

                <DbkfMediaResults/>

                <HpTextResult/>
            </Collapse>

            <Divider/>
        </Box>
    )
}
export default AssistantWarnings;