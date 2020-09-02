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
import {setError} from "../../../redux/actions/errorActions";


const AssistantTextResult = (props) => {

    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);
    const classes = useMyStyles()
    const dispatch = useDispatch()
    const dbkfApi = useDBKFApi()

    const uiUrl = process.env.REACT_APP_DBKF_UI

    const existingResult = props.existingResult
    const text = useSelector(state => state.assistant.urlText);
    const claimResults = useSelector(state => state.assistant.dbkfClaims);
    const [done, setDone] = useState(false);
    const [jsonResult, setJsonResult] = useState(null);


    if((claimResults === null && !(done))){
        let textToUse = text.length > 500 ? text.substring(0,500) : text
        dbkfApi.callSearchApi(textToUse)
            .then(result=>{
                setDone(true)
                setJsonResult((result))
                dispatch(setDbkfClaims(JSON.stringify(result)))
            })
            .catch(()=>{
                dispatch(setDbkfClaims("{}"))
                setDone(true)
                dispatch(setError(keyword("dbkf_error")));
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
                            <ChatBubbleOutlineIcon className={classes.twitterIcon}/>{keyword("text_title")}
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
                        <Typography className={classes.heading}>{keyword("text_intro")}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container>
                            <Grid item xs={12}>
                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                        <Typography>{keyword("text_title")}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant={"subtitle1"}>
                                            <FormatQuoteIcon fontSize={"large"}/>{text}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>

                            <Grid item xs={12}>
                                {jsonResult !== null && Object.keys(jsonResult).length !== 0 ?
                                    <Accordion>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                            <Typography>{keyword("dbkf_title")}</Typography>
                                        </AccordionSummary>

                                        <AccordionDetails>
                                            <Grid container>
                                            {jsonResult.map((value, key) => (
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
                                            </Grid>
                                        </AccordionDetails>
                                    </Accordion> : null
                                }
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Card>
        </Grid>
    )
}
export default AssistantTextResult;