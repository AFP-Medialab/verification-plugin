import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Card from "@material-ui/core/Card";
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


const AssistantTextResult = () => {

    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);
    const classes = useMyStyles()
    const dispatch = useDispatch()
    const dbkfApi = useDBKFApi()


    const text = useSelector(state => state.assistant.urlText);
    const claimResults = useSelector(state => state.assistant.dbkfClaims);
    const [done, setDone] = useState(false);

    if((claimResults === null && !(done))){
        let textToUse = text.length > 500 ? text.substring(0,500) : text
        dbkfApi.callSearchApi(textToUse)
            .then(result=>{
                setDone(true)
                dispatch(setDbkfClaims((result)))
            })
            .catch(()=>{
                dispatch(setDbkfClaims({}))
                setDone(true)
                dispatch(setError(keyword("dbkf_error")));
            })
    }

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
                                <Typography variant={"subtitle1"}>
                                    <FormatQuoteIcon fontSize={"large"}/>{text}
                                </Typography>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Card>
        </Grid>
    )
}
export default AssistantTextResult;