import React from "react";
import {useDispatch, useSelector} from "react-redux";

import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import FindInPageIcon from '@material-ui/icons/FindInPage'
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {IconButton} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

import tsv from "../../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";

import {setAssuranceExpanded} from "../../../../redux/actions/tools/assistantActions";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import SourceCredibilityResults from "../AssistantCheckResults/SourceCredibilityResults";


const AssistantNeutral = () => {

    //const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);
    const dispatch = useDispatch()
    const assuranceExpanded = useSelector(state => state.assistant.assuranceExpanded)
    const uncredibleSCResults = useSelector(state => state.assistant.inputUrlSourceCredibility)
    const factCheckerList = useSelector(state => state.assistant.inputUrlFactCheckers)


    return (
        <Box mb={2} pl={1}>
            <Card variant={"outlined"}
                  style={{"borderColor": "black", "borderStyle": "solid", "display": "flex"}}>
                <CardMedia style={{backgroundColor: "lightgrey"}}>
                    <Box m={1}><FindInPageIcon fontSize={"large"}/></Box>
                </CardMedia>
                <Box m={1}/>
                <div>
                    <Typography component={"span"} variant={"h6"}><Box
                        fontWeight="fontWeightBold">Source Lookup</Box>
                    </Typography>
                    <Typography component={"span"}>
                        <Box color={"black"} fontStyle="italic">Some details on the domain or account entered have been
                            found</Box>
                    </Typography>
                </div>
                <IconButton style={{"marginLeft": "auto"}}
                            onClick={() => dispatch(setAssuranceExpanded(!assuranceExpanded))}>
                    <ExpandMoreIcon style={{"color": "black"}}/>
                </IconButton>
            </Card>
            <Collapse in={assuranceExpanded} style={{"backgroundColor": "transparent"}}>
                <Box m={3}/>
                <SourceCredibilityResults scResultFiltered={uncredibleSCResults}/>
                <SourceCredibilityResults scResultFiltered={factCheckerList}/>
            </Collapse>

            <Divider/>
        </Box>
    )
}
export default AssistantNeutral;