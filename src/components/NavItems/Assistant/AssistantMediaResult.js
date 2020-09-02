import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";

import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Divider from "@material-ui/core/Divider";
import DuoOutlinedIcon from '@material-ui/icons/DuoOutlined';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FaceIcon from "@material-ui/icons/Face";
import Grid from "@material-ui/core/Grid";
import HelpOutlineOutlinedIcon from "@material-ui/icons/HelpOutlineOutlined";
import ImageIcon from "@material-ui/icons/Image";
import ImageSearchOutlinedIcon from '@material-ui/icons/ImageSearchOutlined';
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";

import AssistantProcessUrlActions from "./AssistantProcessUrlActions";
import {CONTENT_TYPE, KNOWN_LINK_PATTERNS, matchPattern, selectCorrectActions} from "./AssistantRuleBook";
import ImageGridList from "../../Shared/ImageGridList/ImageGridList";
import {setProcessUrl, setProcessUrlActions} from "../../../redux/actions/tools/assistantActions";
import tsv from "../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";
import VideoGridList from "../../Shared/VideoGridList/VideoGridList";

const AssistantMediaResult = () => {

    const classes = useMyStyles();
    const dispatch = useDispatch();
    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);

    const inputUrl = useSelector(state => state.assistant.inputUrl);
    const processUrl = useSelector(state => state.assistant.processUrl);
    const imageList = useSelector(state => state.assistant.imageList);
    const videoList = useSelector(state => state.assistant.videoList);


    // select the correct media to process, then load actions possible
    const submitMediaToProcess = (url) => {
        dispatch(setProcessUrl(url));
    }

    // load possible actions for selected media url
    const loadProcessUrlActions = () => {
        let contentType = null;

        if(imageList.includes(processUrl)) {contentType = CONTENT_TYPE.IMAGE}
        else if (videoList.includes(processUrl)) {contentType = CONTENT_TYPE.VIDEO};

        let knownInputLink = matchPattern(inputUrl, KNOWN_LINK_PATTERNS);
        let knownProcessLink = matchPattern(processUrl, KNOWN_LINK_PATTERNS);

        let actions = selectCorrectActions(contentType, knownInputLink, knownProcessLink, processUrl);
        dispatch(setProcessUrlActions(contentType, actions))
    }


    // if the processUrl changes, load any actions that can be taken on this new url
    useEffect(() => {
        if (processUrl!==null){loadProcessUrlActions();}
    }, [processUrl]);



    return (
        <Grid item xs={12}>
            <Card>
                <Grid container>
                    <Grid item xs={6}>
                        <Typography className={classes.twitterHeading}>
                            <ImageSearchOutlinedIcon className={classes.twitterIcon}/>{keyword("media_title")}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} align={"right"}>
                        <Tooltip title= {<div className={"content"} dangerouslySetInnerHTML={{__html: keyword("media_tooltip")}}></div> }
                                 classes={{ tooltip: classes.assistantTooltip }}>
                            <HelpOutlineOutlinedIcon className={classes.toolTipIcon}/>
                        </Tooltip>
                    </Grid>
                </Grid>
                <Accordion expandicon={<ExpandMoreIcon/>} defaultExpanded={true}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                        <Typography className={classes.heading}>
                            {keyword("media_found")}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>

                        <Grid container>
                            {imageList.length > 1 || videoList.length > 1 || (imageList.length===1 && videoList.length===1) ?
                                <Grid item xs={12}
                                      className={classes.newAssistantGrid}>
                                    <Box m={5}/>
                                    <Typography component={"span"} variant={"h6"}>
                                        <FaceIcon fontSize={"small"}/> {keyword("media_below")}
                                    </Typography>
                                    <Box m={2}/>
                                </Grid>
                            : null}


                            <Grid item xs = {12}>
                                {imageList.length>1 || (imageList.length>0 && videoList.length>0) ?
                                    <Grid item xs = {6}
                                      className={classes.newAssistantGrid}>
                                        <Card>
                                            <Typography component={"span"} className={classes.twitterHeading}>
                                                <ImageIcon className={classes.twitterIcon}/> {keyword("images_label")}
                                                <Divider variant={"middle"}/>
                                            </Typography>
                                            <Box m={2}/>
                                            <ImageGridList list={imageList} height={60} cols={5}
                                                           handleClick={(event)=>{submitMediaToProcess(event.target.src)}}/>
                                        </Card>
                                        <Box m={2}/>
                                    </Grid>
                                : null}

                                {videoList.length>1 || (imageList.length>0 && videoList.length>0) ?
                                    <Grid item xs = {6}
                                          className={classes.newAssistantGrid}>
                                        <Card>
                                            <Typography component={"span"} className={classes.twitterHeading}>
                                                <DuoOutlinedIcon className={classes.twitterIcon}/> {keyword("videos_label")}
                                                <Divider variant={"middle"}/>
                                            </Typography>
                                            <Box m={2}/>
                                            <VideoGridList list={videoList} handleClick={(vidLink)=>{submitMediaToProcess(vidLink)}}/>
                                        </Card>
                                        <Box m={2}/>
                                    </Grid>
                                :null}
                            </Grid>

                            {processUrl !==null && videoList.length === 0 && imageList.length === 0 ?
                                <Grid item xs={12}>
                                    <Card><CardContent className={classes.assistantText}>
                                        <Typography variant={"h6"} align={"left"}>
                                            <FaceIcon size={"small"}/> {keyword("assistant_error")}
                                        </Typography>
                                    </CardContent></Card>
                                </Grid> : null
                            }

                            <AssistantProcessUrlActions/>

                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Card>
        </Grid>
    );
};
export default AssistantMediaResult;