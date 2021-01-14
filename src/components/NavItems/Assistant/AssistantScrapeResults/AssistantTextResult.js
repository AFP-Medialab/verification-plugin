import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import {CardHeader} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import {ExpandLessOutlined, ExpandMoreOutlined, WarningOutlined} from "@material-ui/icons";
import FormatQuoteIcon from "@material-ui/icons/FormatQuote";
import Grid from "@material-ui/core/Grid";
import HelpOutlineOutlinedIcon from "@material-ui/icons/HelpOutlineOutlined";
import LinearProgress from "@material-ui/core/LinearProgress";
import SpeakerNotesIcon from '@material-ui/icons/SpeakerNotes';
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";

import {runTranslation, setWarningExpanded} from "../../../../redux/actions/tools/assistantActions";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import IconButton from "@material-ui/core/IconButton";

const AssistantTextResult = () => {

    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);
    const classes = useMyStyles()
    const dispatch = useDispatch()

    // assistant media states
    const text = useSelector(state => state.assistant.urlText);
    const textLang = useSelector(state => state.assistant.textLang);
    const translatedText = useSelector(state => state.assistant.mtResult);

    // third party check states
    const dbkfMatch = useSelector(state => state.assistant.dbkfTextMatch)
    const hpLoading = useSelector(state => state.assistant.hpLoading)
    const mtLoading = useSelector(state => state.assistant.mtLoading)
    const dbkfMatchLoading = useSelector(state => state.assistant.dbkfTextMatchLoading)
    const warningExpanded = useSelector(state => state.assistant.warningExpanded);

    // display states
    const textBox = document.getElementById("element-to-check")
    const [expanded, setExpanded] = useState(false);
    const [displayExpander, setDisplayExpander] = useState(false);


    // figure out if component displaying text needs collapse icon
    useEffect(()=>{
        const elementToCheck = document.getElementById("element-to-check")
        if (elementToCheck.offsetHeight < elementToCheck.scrollHeight){
            setDisplayExpander(true)
        }
    },[textBox])

    return (
        <Grid item xs={12}>
            <Card>
                <CardHeader
                    className= {classes.assistantCardHeader}
                    title={keyword("text_title")}
                    action={
                        <div style={{"display": "flex"}}>
                            <div hidden={dbkfMatch === null}>
                                <Tooltip title={keyword("text_warning")}>
                                    <WarningOutlined
                                        className={classes.toolTipWarning}
                                        onClick={()=>{
                                            dispatch(setWarningExpanded(!warningExpanded))
                                            window.scrollTo(0, 0)
                                        }}/>
                                </Tooltip>
                            </div>
                            <Tooltip title= {
                                <div className={"content"} dangerouslySetInnerHTML={{__html: keyword("text_tooltip")}}/> }
                                     classes={{ tooltip: classes.assistantTooltip }}>
                                <HelpOutlineOutlinedIcon className={classes.toolTipIcon}/>
                            </Tooltip>
                        </div>
                    }
                />
                <LinearProgress variant={"indeterminate"}
                                color = {"secondary"}
                                hidden={!dbkfMatchLoading && !hpLoading && !mtLoading}
                />
                <CardContent>
                        <Collapse in={expanded}
                                  collapsedHeight={100}
                                  id={"element-to-check"}>
                            <Typography align={"center"}>
                                <FormatQuoteIcon fontSize={"large"}/>{translatedText ? translatedText : text}
                            </Typography>
                        </Collapse>
                </CardContent>

                <Box m={1.5}>
                    <Divider/>
                    <Grid container>
                        <Grid item xs={6} style={{"display": "flex"}}>
                            <Typography className={classes.toolTipIcon}>{textLang}</Typography>
                            {textLang === "EN" ?
                                <Tooltip title={keyword("translate_to_french")}>
                                    <IconButton className={classes.toolTipIcon} onClick={()=>dispatch(runTranslation("fr", text))}>
                                        <SpeakerNotesIcon/>
                                    </IconButton>
                                </Tooltip> : null
                            }
                        </Grid>
                        <Grid item xs={6} align={"right"}>
                            {displayExpander ?
                                expanded ?
                                    <ExpandLessOutlined className={classes.toolTipIcon} onClick={()=> {setExpanded(!expanded)}}/> :
                                    <ExpandMoreOutlined className={classes.toolTipIcon} onClick={()=> {setExpanded(!expanded)}}/>
                                : null
                            }
                        </Grid>
                    </Grid>
                </Box>
            </Card>
        </Grid>
    )
}
export default AssistantTextResult;