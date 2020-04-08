import "react-devtools";
import {useParams} from 'react-router-dom'
import React, {useEffect, useState} from "react";
import {Paper, Box, TextField, Button} from "@material-ui/core";
import FaceIcon from "@material-ui/icons/Face";
import Typography from "@material-ui/core/Typography";
import {useDispatch, useSelector} from "react-redux";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";
import CustomTile from "../../Shared/CustomTitle/CustomTitle";
import {submissionEvent} from "../../Shared/GoogleAnalytics/GoogleAnalytics";
import 'tui-image-editor/dist/tui-image-editor.css'

import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import AssistantResult from "./AssistantResult";
import {setAssistantResult} from "../../../redux/actions/tools/assistantActions";
import tsv from "../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";

import analysisIconOff from "../../NavBar/images/tools/video_logoOff.png";
import keyframesIconOff from "../../NavBar/images/tools/keyframesOff.png";
import thumbnailsIconOff from "../../NavBar/images/tools/youtubeOff.png";
import twitterSearchIconOff from "../../NavBar/images/tools/twitterOff.png";
import magnifierIconOff from "../../NavBar/images/tools/magnifierOff.png";
import metadataIconOff from "../../NavBar/images/tools/metadataOff.png";
import videoRightsIconOff from "../../NavBar/images/tools/copyrightOff.png";
import forensicIconOff from "../../NavBar/images/tools/forensic_logoOff.png";
import twitterSnaIconOff from "../../NavBar/images/tools/twitter-sna-off.png";
import {setError} from "../../../redux/actions/errorActions";

/*
* TODO: figure out weird navbar issue with translations
*  try new tab/get all images and videos
*  fix issue where not all redirects set url on state
*  change
* */
const Assistant = () => {

    const {url} = useParams();
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);

    const resultUrl = useSelector(state => state.assistant.url);
    const resultData = useSelector(state => state.assistant.result);
    const dispatch = useDispatch();

    const [input, setInput] = useState(resultUrl);

    const getErrorText = (error) => {
        if (keyword(error) !== "")
            return keyword(error);
        return keyword("please_give_a_correct_link");
    };

    const submitUrl = (src) => {
        submissionEvent(src);
        try {
            let parsed_url = new URL(src);

            let content_type = matchPattern(src, ctypePatterns);
            let domain = matchPattern(parsed_url.host, domainPatterns);
            let actions = loadActions(domain, content_type);

            dispatch(setAssistantResult(src, actions, false, false));
        }
        catch(error){
            dispatch((setError(getErrorText(error))));
        }
    };

    const matchPattern = (to_match, patternArray) => {
        let match = null;
        outer: for (let i = 0; i < patternArray.length; i++) {
            const patterns = patternArray[i].patterns;
            for (let j = 0; j < patterns.length; j++) {
                const pattern = patterns[j];
                if (to_match.match(pattern)) {
                    match = patternArray[i].key;
                    break outer;
                }
            }
        }
        return match;
    }

    const loadActions = (domainEnum, cTypeEnum) => {
        let possibleActions = [];
        for (let i = 0; i < drawerItems.length; i++) {
            let currentAction = drawerItems[i];
            //check if the domains are matching
            const domains = currentAction.domains;
            if (domains.includes(DOMAIN.ALL) || domains.includes(domainEnum)) {
                const ctypes = currentAction.ctypes;
                if (ctypes.includes(CTYPE.ALL) || ctypes.includes(cTypeEnum)) {
                    possibleActions.push(currentAction);
                }
            }
        }
        //if there is no action can be taken, then display noAction available option.
        if (possibleActions.length == 0) {
            //get no action option.
            const currentAction = drawerItems.find(
                x => x.title === "navbar_no_action"
            );
            possibleActions.push(currentAction);
        }
        return possibleActions;
    }


    useEffect(() => {
        if (url !== undefined) {
            const uri = (url !== null) ? decodeURIComponent(url) : undefined;
            setInput(uri);
            submitUrl(uri)
        }
    }, [url]);

    const CTYPE = Object.freeze({
        VIDEO: "Video",
        IMAGE: "Image",
        PDF: "PDF",
        AUDIO: "Audio",
        TEXT: "Text",
        ALL: "All"
    });

    const DOMAIN = Object.freeze({
        FACEBOOK: { type: "FACEBOOK", name: "Facebook"},
        YOUTUBE: { type: "YOUTUBE", name: "Youtube"},
        TWITTER: { type: "TWITTER", name: "Twitter"},
        ALL: { type: "ALL", name: "website"}
    });

    const ctypePatterns = [
        {
            key: CTYPE.VIDEO,
            patterns: [/(mp4|webm|avi|mov|wmv|ogv|mpg|flv|mkv)(\?.*)?$/i,
                /(facebook\.com\/.*\/videos\/)/,/(twitter\.com\/.*\/video)/,
                /((y2u|youtube|youtu\.be).*(?!\')[0-9A-Za-z_-]{10}[048AEIMQUYcgkosw](?=))/]
        },
        {
            key: CTYPE.IMAGE,
            patterns: [
                /(jpg|jpeg|png|gif|svg)(\?.*)?$/i,
                /(facebook\.com\/.*\/photos\/)/,
                /(pbs\.twimg\.com\/)/, /(twitter\.com\/.*\/photo)/,
                /(i\.ytimg\.com)/]
        },
        {
            key: CTYPE.PDF,
            patterns: [/^.*\.pdf(\?.*)?(\#.*)?/]
        },
        {
            key: CTYPE.AUDIO,
            patterns: [/(mp3|wav|m4a)(\?.*)?$/i]
        }
    ];

    const domainPatterns = [
        {
            key: DOMAIN.FACEBOOK,
            patterns: ["^(https?:/{2})?(www.)?facebook.com|fbcdn.net"]
        },
        {
            key: DOMAIN.YOUTUBE,
            patterns: ["^(https?:/{2})?(www.)?youtube|youtu.be|i\.ytimg"]
        },
        {
            key: DOMAIN.TWITTER,
            patterns: ["^(https?:/{2})?(www.)?twitter.com|twimg.com"]
        }
    ];


    const drawerItems = [
        {
            title: "navbar_analysis",
            icon: analysisIconOff,
            domains: new Array(DOMAIN.YOUTUBE, DOMAIN.FACEBOOK, DOMAIN.TWITTER),
            ctypes: [CTYPE.VIDEO],
            text: "analysis_text",
            tsvPrefix: "api",
            path: "tools/analysis",
        },
        {
            title: "navbar_keyframes",
            icon:  keyframesIconOff,
            domains: new Array(DOMAIN.YOUTUBE, DOMAIN.FACEBOOK, DOMAIN.TWITTER),
            ctypes: [CTYPE.VIDEO],
            text: "keyframes_text",
            tsvPrefix: "keyframes",
            path: "tools/keyframes",
        },
        {
            title: "navbar_thumbnails",
            icon: thumbnailsIconOff,
            domains: new Array(DOMAIN.YOUTUBE),
            ctypes: [CTYPE.VIDEO],
            text: "thumbnails_text",
            tsvPrefix: "thumbnails",
            path: "tools/thumbnails",
        },
        {
            title: "navbar_twitter",
            icon: twitterSearchIconOff,
            domains: new Array(DOMAIN.TWITTER),
            ctypes: [CTYPE.TEXT],
            text: "twitter_text",
            tsvPrefix: "twitter",
            path: "tools/twitter",
        },
        {
            title: "navbar_magnifier",
            icon: magnifierIconOff,
            domains: new Array(DOMAIN.ALL),
            ctypes: [CTYPE.IMAGE],
            text: "magnifier_text",
            tsvPrefix: "magnifier",
            path: "tools/magnifier",
        },
        {
            title: "navbar_metadata",
            icon: metadataIconOff,
            domains: new Array(DOMAIN.ALL),
            ctypes: [CTYPE.IMAGE, CTYPE.VIDEO],
            text: "metadata_text",
            tsvPrefix: "metadata",
            path: "tools/metadata",
        },
        {
            title: "navbar_rights",
            icon:  videoRightsIconOff,
            domains: new Array(DOMAIN.YOUTUBE, DOMAIN.FACEBOOK, DOMAIN.TWITTER),
            ctypes: [CTYPE.VIDEO],
            text: "rights_text",
            tsvPrefix: "copyright",
            path: "tools/copyright",
        },
        {
            title: "navbar_forensic",
            icon: forensicIconOff,
            domains: new Array(DOMAIN.ALL),
            ctypes: [CTYPE.IMAGE],
            text: "forensic_text",
            tsvPrefix: "forensic",
            path: "tools/forensic",
        },
        {
            title: "navbar_twitter_sna",
            domains: new Array(),
            ctypes: [],
            text: "sna_text",
            icon:  twitterSnaIconOff,
            tsvPrefix: "twitter_sna",
            path: "tools/twitterSna"
        },
        {
            title: "navbar_no_action",
            domains: new Array(),
            ctypes: [],
            text: "no_action_text",
            icon: twitterSnaIconOff,
            tsvPrefix: "twitter_sna",
            path: "assistant"
        },
    ];


    return (
        <div>
            <Paper className={classes.root}>
                <CustomTile text={keyword("assistant_title")}/>
                <Box m={5}/>
                <div className={classes.assistantText}>
                    <Typography variant={"h6"} >
                        <FaceIcon fontSize={"small"}/> {keyword("assistant_intro")}
                    </Typography>

                    <Box m={2}/>
                    <TextField
                        id="standard-full-width"
                        label={keyword("assistant_urlbox")}
                        style={{margin: 8}}
                        placeholder={""}
                        fullWidth
                        value={input}
                        onChange={e => setInput(e.target.value)}
                    />
                    <Box m={2}/>
                </div>
                <Button variant="contained" color="primary" onClick={() => submitUrl(input)}>
                    {keyword("button_submit") || ""}
                </Button>
            </Paper>
        {
            (resultData) ?
                (<AssistantResult result={resultData} image={resultUrl}/>) : null
        }
        </div>
    )
};
export default Assistant;