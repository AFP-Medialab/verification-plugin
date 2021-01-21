import React from "react";
import {useSelector} from "react-redux";

import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardActions from "@material-ui/core/CardActions";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import {IconButton} from "@material-ui/core";
import ImageIcon from "@material-ui/icons/Image";
import Iframe from "react-iframe";
import Link from "@material-ui/core/Link";
import Tooltip from "@material-ui/core/Tooltip";

import {KNOWN_LINK_PATTERNS, KNOWN_LINKS, matchPattern} from "../AssistantRuleBook";

const AssistantVideoResult = () => {

    const processUrl = useSelector(state => state.assistant.processUrl);
    const linkType = matchPattern(processUrl, KNOWN_LINK_PATTERNS);

    const useIframe = () => {
        switch(linkType){
            case KNOWN_LINKS.YOUTUBE:
            case KNOWN_LINKS.VIMEO:
            case KNOWN_LINKS.DAILYMOTION:
            case KNOWN_LINKS.LIVELEAK:
                return true
            default:
                return false
        }
    }

    const preprocessLinkForEmbed = (processUrl) => {
        let embedURL = processUrl;
        let stringToMatch = ""
        let positionOne = 0

        switch(linkType){
            case KNOWN_LINKS.YOUTUBE:
                if (!embedURL.includes("/embed/")) {
                    let ids = embedURL.match("(?<=v=|youtu.be/)([a-zA-Z0-9_-]+)[&|?]?");
                    if (ids) {embedURL = "http://www.youtube.com/embed/" + ids[0];}
                }
                break;
            case KNOWN_LINKS.VIMEO:
                stringToMatch = "vimeo.com/"
                positionOne = processUrl.indexOf(stringToMatch);
                var positionTwo = positionOne + stringToMatch.length;
                embedURL = embedURL.slice(0, positionOne) + "player." + embedURL.slice(positionOne, positionTwo) +
                    "video/"  + embedURL.slice(positionTwo);
                break;
            case KNOWN_LINKS.DAILYMOTION:
                stringToMatch = "dailymotion.com/";
                positionOne = processUrl.indexOf(stringToMatch) + stringToMatch.length;
                embedURL = embedURL.slice(0, positionOne) + "embed/" + embedURL.slice(positionOne);
                break;
            default:
                return embedURL;
        }
        return embedURL;
    }

    const copyUrl = () => {
        navigator.clipboard.writeText(processUrl)
    }

    return (
        <Card variant={"outlined"}>
            <CardMedia>
                {useIframe() ?
                    <Iframe
                        frameBorder="0"
                        url={preprocessLinkForEmbed(processUrl)}
                        allow="fullscreen"
                        height="400"
                        width="100%"
                    /> :
                    <video
                        src={preprocessLinkForEmbed(processUrl)}
                        controls={true}
                        height="400"
                        width="100%"
                    />
                }
            </CardMedia>

            <CardActions>
                <ImageIcon color={"action"}/>
                <Link href={processUrl} color={"textSecondary"} variant={"subtitle2"}>
                    {processUrl.length>60 ? processUrl.substring(0,60) + "...": processUrl}
                </Link>
                <Tooltip title={"Copy link"}>
                    <IconButton style={{"marginLeft":"auto"}} onClick={() => {copyUrl()}}>
                        <FileCopyIcon color={"action"}/>
                    </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
    );
}
export default AssistantVideoResult;