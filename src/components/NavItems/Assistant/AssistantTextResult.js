import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FormatQuoteIcon from "@material-ui/icons/FormatQuote";
import Grid from "@material-ui/core/Grid";
import HelpOutlineOutlinedIcon from "@material-ui/icons/HelpOutlineOutlined";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";

import tsv from "../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import useDBKFApi from "./useDBKFApi";
import {setDbkfClaims} from "../../../redux/actions/tools/assistantActions";


const AssistantTextResult = (props) => {
    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);
    const text = useSelector(state => state.assistant.urlText);
    const claimResults = useSelector(state => state.assistant.dbkfClaims);

    const existingResult = props.existingResult

    const classes = useMyStyles()
    const dbkfApi = useDBKFApi()
    const dispatch = useDispatch()
    const uiUrl = process.env.REACT_APP_DBKF_UI
    const [inProgress, setInProgress] = useState(false);
    const [jsonResult, setJsonResult] = useState(null);


    if((claimResults === null && !inProgress)){
        setInProgress(true)

        dbkfApi.callSearchApi(text.substring(0, 50))
            .then(result=>{
                setInProgress(false)
                setJsonResult((result))
                dispatch(setDbkfClaims(JSON.stringify(result)))
            })

    }

    useEffect(()=>{
        if (existingResult!=null) {
            let existingJson = JSON.parse(existingResult)
            setJsonResult(existingJson)
        }
    }, [existingResult])


    return (
        <Grid item xs={12}>
            <Card>
                <Grid container>
                    <Grid item xs={6}>
                        <Typography className={classes.twitterHeading}>
                            <ChatBubbleOutlineIcon className={classes.twitterIcon}/>Text
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
                        <Typography className={classes.heading}>The following text has been found on the page</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container>
                            <Grid item xs={12}>
                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                        <Typography>Expand Text</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant={"subtitle1"}>
                                            <FormatQuoteIcon fontSize={"large"}/>{text}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                            {jsonResult !== null ?
                                <Grid item xs={12}>
                                    <Accordion>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                            <Typography col ={"red"}>DBKF Check</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Grid container xs={12}>
                                            {jsonResult.map((value, key) => (
                                                <Grid container xs={12}>
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
                                                </Grid>
                                                )
                                            )}
                                            </Grid>
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid> : null
                            }
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Card>
        </Grid>
    )
}
export default AssistantTextResult;