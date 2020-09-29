import React from "react";
import {useSelector} from "react-redux";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Grid from "@material-ui/core/Grid";
import HelpOutlineOutlinedIcon from "@material-ui/icons/HelpOutlineOutlined";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";

import tsv from "../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";


const AssistantDBKFResult = () => {

    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);
    const classes = useMyStyles()


    const uiUrl = process.env.REACT_APP_DBKF_UI

    const dbkfImageMatch = useSelector(state => state.assistant.dbkfImageMatch);
    const claimResults = useSelector(state => state.assistant.dbkfClaims);

    return (
        <Grid item xs={12}>
            <Card>
                <Grid container>
                    <Grid item xs={6}>
                        <Typography className={classes.twitterHeading}>
                            <ErrorOutlineOutlinedIcon className={classes.warningIcon}/>{"DBKF Check"}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} align={"right"}>
                        <Tooltip title= {<div className={"content"} dangerouslySetInnerHTML={{__html: keyword("text_tooltip")}}></div> }
                                 classes={{ tooltip: classes.assistantTooltip }}>
                            <HelpOutlineOutlinedIcon className={classes.toolTipIcon}/>
                        </Tooltip>
                    </Grid>
                </Grid>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>{"Some elements of this post have been matched against claims in the DBKF"}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container>
                            <Grid item xs={12}>
                                {dbkfImageMatch !== null && dbkfImageMatch.length !== 0 ?
                                    <Grid container>
                                        {dbkfImageMatch.map((value, key) => (
                                            <Grid container key={key}>
                                                <Card className={classes.dbkfCards} variant={"outlined"}>
                                                    <CardContent>
                                                        <Typography variant={"subtitle1"}>
                                                            {value.dbkfObjects[0].claimUrl}
                                                        </Typography>
                                                        <Typography variant={"subtitle1"}>
                                                            <a href={uiUrl +  value.dbkfObjects[0].claimUrl}
                                                               key={key} target="_blank" rel="noopener noreferrer">
                                                                {uiUrl +  value.dbkfObjects[0].claimUrl}}
                                                            </a>
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>)
                                        )}
                                    </Grid> : null
                                }
                            </Grid>

                            <Grid item xs={12}>
                                {claimResults !== null && Object.keys(claimResults).length !== 0 ?
                                    <Grid container>
                                        {claimResults.map((value, key) => (
                                            <Grid container key={key}>
                                                <Card className={classes.dbkfCards} variant={"outlined"}>
                                                    <CardContent>
                                                        <Typography variant={"subtitle1"}>
                                                            {value.text}
                                                        </Typography>
                                                        <Typography variant={"subtitle1"}>
                                                            <a href={uiUrl + value.claimUrl}
                                                               key={key} target="_blank" rel="noopener noreferrer">
                                                                {uiUrl + value.claimUrl}
                                                            </a>
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>)
                                        )}
                                    </Grid>: null
                                }
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Card>
        </Grid>
    )
}
export default AssistantDBKFResult;