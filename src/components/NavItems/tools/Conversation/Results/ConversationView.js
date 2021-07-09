import React from "react";
import {useDispatch, useSelector} from "react-redux";

import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";

import Grid from "@material-ui/core/Grid";

import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/Conversation.tsv";

import { TwitterTweetEmbed } from 'react-twitter-embed';

import ReactWordcloud from 'react-wordcloud';
import {select} from "d3-selection";
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

const ConversationView = () => {
    
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Conversation.tsv", tsv);

    const statusID = useSelector(state => state.conversation.id_str);
    const hashtagCloud = useSelector(state => state.conversation.cloud)
    
    const dispatch = useDispatch();

    return (
        <Grid
            container
            direction="row"
            spacing={3}
            alignItems="flex-start">
            
            <Grid item xs={6}>
                <TwitterTweetEmbed tweetId={statusID} options={{conversation: 'none', lang: 'en', dnt: true}} />
                </Grid>
            <Grid item xs={6}>
                <ReactWordcloud words={hashtagCloud} />
            </Grid>
        </Grid>


    )
}

export default ConversationView;