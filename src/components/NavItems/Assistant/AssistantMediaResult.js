import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {CardHeader} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Grid from "@material-ui/core/Grid";
import HelpOutlineOutlinedIcon from "@material-ui/icons/HelpOutlineOutlined";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";

import {CONTENT_TYPE, KNOWN_LINK_PATTERNS, matchPattern, selectCorrectActions} from "./AssistantRuleBook";
import AssistantImageResult from "./AssistantImageResult";
import AssistantVideoResult from "./AssistantVideoResult";
import AssistantProcessUrlActions from "./AssistantProcessUrlActions";
import ImageGridList from "../../Shared/ImageGridList/ImageGridList";
import {setError} from "../../../redux/actions/errorActions";
import {
    setDbkfImageMatch, setDbkfMediaMatchLoading,
    setDbkfVideoMatch,
    setOcrTextResult,
    setProcessUrl,
    setProcessUrlActions, setWarningExpanded
} from "../../../redux/actions/tools/assistantActions";
import tsv from "../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";
import VideoGridList from "../../Shared/VideoGridList/VideoGridList";
import useDBKFApi from "./useDBKFApi";
import useOcrService from "./useOcrService";
import {WarningOutlined} from "@material-ui/icons";
import LinearProgress from "@material-ui/core/LinearProgress";


const AssistantMediaResult = () => {

    const classes = useMyStyles();
    const dispatch = useDispatch();
    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);

    const dbkfSimilarityApi = useDBKFApi();
    const ocrApi = useOcrService();

    const inputUrl = useSelector(state => state.assistant.inputUrl);
    const processUrl = useSelector(state => state.assistant.processUrl);
    const urlMode = useSelector(state => state.assistant.urlMode);
    const resultProcessType = useSelector(state => state.assistant.processUrlType);
    const singleMediaPresent = useSelector(state => state.assistant.singleMediaPresent);
    const imageList = useSelector(state => state.assistant.imageList);
    const videoList = useSelector(state => state.assistant.videoList);
    const imageReverseSearch = useSelector(state => state.assistant.dbkfImageMatch);
    const videoReverseSearch = useSelector(state => state.assistant.dbkfVideoMatch);

    const warningExpanded = useSelector(state => state.assistant.warningExpanded)

    const [loading, setLoading] = useState(false);
    const [expandMedia, setExpandMedia] = useState(false);
    const resultIsImage = resultProcessType === CONTENT_TYPE.IMAGE

    // select the correct media to process, then load actions possible
    const submitMediaToProcess = (url) => {
        setExpandMedia(false);
        dispatch(setProcessUrl(url));

    }

    // load possible actions for selected media url
    const loadProcessUrlActions = (contentType) => {
        let knownInputLink = matchPattern(inputUrl, KNOWN_LINK_PATTERNS);
        let knownProcessLink = matchPattern(processUrl, KNOWN_LINK_PATTERNS);

        let actions = selectCorrectActions(contentType, knownInputLink, knownProcessLink, processUrl);
        dispatch(setProcessUrlActions(contentType, actions))
    }

    const runSimilaritySearch = (contentType) => {
        dispatch(setDbkfMediaMatchLoading(true))
        if(contentType === CONTENT_TYPE.IMAGE){
           similaritySearch(
               ()=>dbkfSimilarityApi.callImageSimilarityEndpoint(processUrl),
               (result)=>setDbkfImageMatch(result))
        }
        else if (contentType === CONTENT_TYPE.VIDEO){
            similaritySearch(
                ()=>dbkfSimilarityApi.callVideoSimilarityEndpoint(processUrl),
                (result)=>setDbkfVideoMatch(result))
        }
    }

    const similaritySearch = (searchEndpoint, stateStorageFunction) => {
        dispatch(stateStorageFunction(null))

        searchEndpoint().then(result => {
            if (result[1].length !== 0) {
                dispatch(stateStorageFunction(result[1]))
                dispatch(setDbkfMediaMatchLoading(false))
            }
        }).catch(() => {
            dispatch(setError(keyword("dbkf_error")));
            dispatch(setDbkfMediaMatchLoading(false))
        })
    }

    const runOcrService = (contentType) => {
        setLoading(true)
        if(contentType === CONTENT_TYPE.IMAGE){
            ocrApi.callOcrService(processUrl).then(result=>{
                setLoading(false)
                if (result.length!==0) { dispatch(setOcrTextResult(result))}
            }).catch((error)=>{
                dispatch(setError(keyword("ocr_error")));
                dispatch(loading(false))
            })
        }
    }

    // if the processUrl changes, load any actions that can be taken on this new url
    useEffect(() => {
        if (processUrl!==null){
            let contentType = null;
            if(imageList.includes(processUrl)) {contentType = CONTENT_TYPE.IMAGE}
            else if (videoList.includes(processUrl)) {contentType = CONTENT_TYPE.VIDEO};

            loadProcessUrlActions(contentType);
            runSimilaritySearch(contentType);
            runOcrService(contentType);
        }
    }, [processUrl]);

    useEffect(() => {
        if (!singleMediaPresent){
            setExpandMedia(true)
        }
    }, [singleMediaPresent]);


    return (
        <Grid container spacing={2}>

            <Grid item xs={6} hidden={!urlMode}>
                <Card>
                    <CardHeader
                        className= {classes.assistantCardHeader}
                        title={keyword("media_title")}
                        action={
                            <div style={{"display": "flex"}}>
                                <div hidden={imageReverseSearch === null && videoReverseSearch === null}>
                                    <Tooltip title={keyword("image_warning")}>
                                        <WarningOutlined className={classes.toolTipWarning}
                                                         onClick={()=>dispatch(setWarningExpanded(!warningExpanded))}/>
                                    </Tooltip>
                                </div>
                                <div>
                                    <Tooltip title= {<div className={"content"}
                                                 dangerouslySetInnerHTML={{__html: keyword("media_tooltip")}}/> }
                                                 classes={{ tooltip: classes.assistantTooltip }}>
                                        <HelpOutlineOutlinedIcon className={classes.toolTipIcon}/>
                                    </Tooltip>
                                </div>
                            </div>
                        }
                     />
                    <LinearProgress variant={"indeterminate"} color={"secondary"} hidden={!loading}/>
                    <CardContent>
                        {processUrl!==null ? resultIsImage ? <AssistantImageResult/> : <AssistantVideoResult/> : null}
                    </CardContent>
                    <Divider m = {1.5}/>
                    { !singleMediaPresent ?
                        <div>
                            <CardActions disableSpacing>
                                <IconButton onClick={()=>{setExpandMedia(!expandMedia)}}>
                                    <ExpandMoreIcon fontSize={"small"}/>
                                    <Typography>{keyword("media_below")}</Typography>
                                </IconButton>
                            </CardActions>
                            <Collapse in = {expandMedia}>
                               <CardContent>
                                    <ImageGridList list={imageList} height={60} cols={5} handleClick={(event)=>{submitMediaToProcess(event.target.src)}}/>
                               </CardContent>
                                <Divider m = {1.5}/>
                                <CardContent>
                                    <VideoGridList list={videoList} handleClick={(vidLink)=>{submitMediaToProcess(vidLink)}}/>
                                </CardContent>
                            </Collapse>
                        </div>
                        : null
                    }
                </Card>
            </Grid>

            <Grid item xs={6}>
                <AssistantProcessUrlActions/>
            </Grid>
        </Grid>
    );
};
export default AssistantMediaResult;