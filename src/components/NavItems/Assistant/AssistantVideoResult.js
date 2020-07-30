import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";
import Iframe from "react-iframe";
import React from "react";
import {useSelector} from "react-redux";

import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import tsv from "../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";
import {KNOWN_LINK_PATTERNS, KNOWN_LINKS, matchPattern} from "./AssistantRuleBook";

const AssistantVideoResult = () => {
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);
    const processUrl = useSelector(state => state.assistant.processUrl);

    const preprocessLinkForEmbed = (processUrl) => {
        let embedURL = processUrl;
        let linkType = matchPattern(processUrl, KNOWN_LINK_PATTERNS);

        switch(linkType){
            case KNOWN_LINKS.YOUTUBE:
                if (!embedURL.includes("/embed/")) {
                    let ids = embedURL.match("(?<=v=|youtu.be/)([a-zA-Z0-9_-]+)[&|?]?");
                    if (ids) {embedURL = "http://www.youtube.com/embed/" + ids[0];}
                }
                break;
            case KNOWN_LINKS.VIMEO:
                var stringToMatch = "vimeo.com/"
                var positionOne = processUrl.indexOf(stringToMatch);
                var positionTwo = positionOne + stringToMatch.length;
                embedURL = embedURL.slice(0, positionOne) + "player." + embedURL.slice(positionOne, positionTwo) +
                    "video/"  + embedURL.slice(positionTwo);
                break;
            case KNOWN_LINKS.DAILYMOTION:
                var stringToMatch = "dailymotion.com/";
                var positionOne = processUrl.indexOf(stringToMatch) + stringToMatch.length;
                embedURL = embedURL.slice(0, positionOne) + "embed/" + embedURL.slice(positionOne);
                break;
            case KNOWN_LINKS.FACEBOOK:
                embedURL = "https://www.facebook.com/plugins/video.php?href=" + encodeURIComponent(embedURL);
                break;
            case KNOWN_LINKS.TWITTER:
                //todo: evaluate if this is the best option
                embedURL = "https://twitframe.com/show?url=" + encodeURIComponent(embedURL);
                break;
            default:
                return embedURL;
        }

        return embedURL;
    }

    return (
        <Card variant = "outlined">
            <CardContent>
                <Typography variant="h5" component="h2">
                    {keyword("media_to_process")}
                </Typography>
                <Typography className={classes.title} color="primary">
                    {<a href={processUrl}> {processUrl.length>100 ? processUrl.substring(0,100) + "...": processUrl} </a>}
                </Typography>
            </CardContent>
            <CardMedia>
                <Iframe
                    frameBorder="0"
                    url = {preprocessLinkForEmbed(processUrl)}
                    allow="fullscreen"
                    height="400"
                    width="100%"
                />
            </CardMedia>
        </Card>
    );
}
export default AssistantVideoResult;