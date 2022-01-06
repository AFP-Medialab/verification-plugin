import React from "react";
import {useDispatch, useSelector} from "react-redux";

import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Collapse from "@material-ui/core/Collapse";
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Grid from "@material-ui/core/Grid";
import {IconButton} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

import tsv from "../../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";

import {setWarningExpanded} from "../../../../redux/actions/tools/assistantActions";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import DbkfTextResults from "../AssistantCheckResults/DbkfTextResults";
import DbkfMediaResults from "../AssistantCheckResults/DbkfMediaResults";
import HpTextResult from "../AssistantCheckResults/HpTextResult";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";


const AssistantWarnings = () => {

    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);
    const classes = useMyStyles()
    const dispatch = useDispatch()

    const warningExpanded = useSelector(state => state.assistant.warningExpanded)

    return (
        <Box mb={2} pl={1}>
            <Card variant={"outlined"}
                  className={classes.assistantWarningBorder}>
                <Grid container>
                    <Grid item xs={12} style={{"display": "flex"}}>
                        <CardMedia>
                            <Box m={1}><ErrorOutlineOutlinedIcon color={"error"} fontSize={"large"}/></Box>
                        </CardMedia>
                        <Box m={1}/>
                        <div>
                            <Typography component={"span"} variant={"h6"} color={"error"}>
                                <Box mt={1.5} fontWeight="fontWeightBold">
                                    {keyword("warning_title")}
                                </Box>
                            </Typography>
                        </div>
                        <IconButton className={classes.assistantIconRight} onClick={() => dispatch(setWarningExpanded(!warningExpanded))}>
                            <ExpandMoreIcon style={{"color": "red"}}/>
                        </IconButton>
                    </Grid>
                    <Grid item xs={12}>
                        <Collapse in={warningExpanded} className={classes.assistantBackground}>
                            <Box m={1}/>
                            <DbkfTextResults/>

                            <DbkfMediaResults/>

                            <HpTextResult/>
                        </Collapse>
                    </Grid>
                </Grid>
            </Card>
        </Box>
    )
}
export default AssistantWarnings;