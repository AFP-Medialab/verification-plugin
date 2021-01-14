import React, {useState} from "react";
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

import {CONTENT_TYPE} from "../AssistantRuleBook";
import AssistantImageResult from "./AssistantImageResult";
import AssistantVideoResult from "./AssistantVideoResult";
import AssistantProcessUrlActions from "./AssistantProcessUrlActions";
import ImageGridList from "../../../Shared/ImageGridList/ImageGridList";
import {setProcessUrl, setWarningExpanded} from "../../../../redux/actions/tools/assistantActions";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import VideoGridList from "../../../Shared/VideoGridList/VideoGridList";
import {WarningOutlined} from "@material-ui/icons";
import LinearProgress from "@material-ui/core/LinearProgress";


const AssistantMediaResult = () => {

    const classes = useMyStyles();
    const dispatch = useDispatch();
    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);

    // assistant media states
    const processUrl = useSelector(state => state.assistant.processUrl);
    const urlMode = useSelector(state => state.assistant.urlMode);
    const resultProcessType = useSelector(state => state.assistant.processUrlType);
    const singleMediaPresent = useSelector(state => state.assistant.singleMediaPresent);
    const imageList = useSelector(state => state.assistant.imageList);
    const videoList = useSelector(state => state.assistant.videoList);

    // third party tool states
    const ocrLoading = useSelector(state=>state.assistant.ocrLoading)
    const dbkfMediaMatchLoading = useSelector(state=>state.assistant.dbkfMediaMatchLoading)
    const dbkfImageMatch = useSelector(state => state.assistant.dbkfImageMatch);
    const dbkfVideoMatch = useSelector(state => state.assistant.dbkfVideoMatch);

    const warningExpanded = useSelector(state => state.assistant.warningExpanded)
    const resultIsImage = resultProcessType === CONTENT_TYPE.IMAGE

    // local control state
    const [expandMedia, setExpandMedia] = useState(!singleMediaPresent || processUrl==null);

    // select the correct media to process, then load actions possible
    const submitMediaToProcess = (url) => {
        setExpandMedia(false)
        let cType = null;
        if (imageList.includes(url)) {
            cType = CONTENT_TYPE.IMAGE
        } else if (videoList.includes(url)) {
            cType = CONTENT_TYPE.VIDEO
        }
        ;
        dispatch(setProcessUrl(url, cType));
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={6} hidden={!urlMode}>
                <Card>
                    <CardHeader
                        className={classes.assistantCardHeader}
                        title={keyword("media_title")}
                        action={
                            <div style={{"display": "flex"}}>
                                <div hidden={dbkfImageMatch === null && dbkfVideoMatch === null}>
                                    <Tooltip title={keyword("image_warning")}>
                                        <WarningOutlined className={classes.toolTipWarning}
                                                         onClick={() => {
                                                             dispatch(setWarningExpanded(!warningExpanded))
                                                             window.scroll(0,0)
                                                         }}/>
                                    </Tooltip>
                                </div>
                                <div>
                                    <Tooltip title={<div className={"content"}
                                                         dangerouslySetInnerHTML={{__html: keyword("media_tooltip")}}/>}
                                             classes={{tooltip: classes.assistantTooltip}}>
                                        <HelpOutlineOutlinedIcon className={classes.toolTipIcon}/>
                                    </Tooltip>
                                </div>
                            </div>
                        }
                    />
                    <LinearProgress variant={"indeterminate"} color={"secondary"} hidden={!ocrLoading && !dbkfMediaMatchLoading}/>
                    <CardContent>
                        {processUrl !== null ? resultIsImage ? <AssistantImageResult/> : <AssistantVideoResult/> : null}
                    </CardContent>
                    <Divider m={1.5}/>
                    {!singleMediaPresent ?
                        <div>
                            <CardActions disableSpacing>
                                <IconButton onClick={() => {
                                    setExpandMedia(!expandMedia)
                                }}>
                                    <ExpandMoreIcon fontSize={"small"}/>
                                    <Typography>{keyword("media_below")}</Typography>
                                </IconButton>
                            </CardActions>
                            <Collapse in={expandMedia}>
                                <CardContent>
                                    <ImageGridList list={imageList} height={60} cols={5} handleClick={(event) => {
                                        submitMediaToProcess(event.target.src)
                                    }}/>
                                </CardContent>
                                <Divider m={1.5}/>
                                <CardContent>
                                    <VideoGridList list={videoList} handleClick={(vidLink) => {
                                        submitMediaToProcess(vidLink)
                                    }}/>
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