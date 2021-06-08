import React from "react";
import {useDispatch, useSelector} from "react-redux";

import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import Divider from "@material-ui/core/Divider";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {IconButton} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

import tsv from "../../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import Collapse from "@material-ui/core/Collapse";
import SourceCredibilityResults from "../AssistantCheckResults/SourceCredibilityResults";
import {setAssuranceExpanded} from "../../../../redux/actions/tools/assistantActions";


const AssistantAssurances = () => {

    const factCheckerList = useSelector(state => state.assistant.inputUrlFactCheckers)
    const assuranceExpanded = useSelector(state => state.assistant.assuranceExpanded)

    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);
    const dispatch = useDispatch()

    return (
        <Box pl={1} mb={2}>
            <Card variant={"outlined"}
                  style={{"borderColor": "green", "borderStyle": "solid", "display": "flex"}}>
                <CardMedia style={{backgroundColor: "green"}}>
                    <Box m={1}><CheckCircleOutlineIcon fontSize={"large"}/></Box>
                </CardMedia>
                <Box m={1}/>
                <div>
                    <Typography component={"span"} variant={"h6"} style={{"color": "green"}}><Box
                        fontWeight="fontWeightBold">{keyword("assurance_title")}</Box>
                    </Typography>
                    <Typography component={"span"}>
                        <Box color={"black"} fontStyle="italic">{keyword("assurance_subtitle")}</Box>
                    </Typography>
                </div>
                <IconButton style={{"marginLeft": "auto"}}
                            onClick={() => dispatch(setAssuranceExpanded(!assuranceExpanded))}>
                    <ExpandMoreIcon style={{"color": "green"}}/>
                </IconButton>
            </Card>
            <Collapse in={assuranceExpanded} style={{"backgroundColor": "transparent"}}>
                <Box m={1}/>
                <SourceCredibilityResults scResultFiltered={factCheckerList}/>
            </Collapse>

            <Divider/>
        </Box>
    )
}
export default AssistantAssurances;