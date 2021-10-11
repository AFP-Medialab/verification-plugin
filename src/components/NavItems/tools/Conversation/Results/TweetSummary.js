import React from "react";
import {useDispatch, useSelector} from "react-redux";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";
import Grid from "@material-ui/core/Grid";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/Conversation.tsv";
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

import {Box, Button} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";

import Alert from '@material-ui/lab/Alert';

import { setTweetID }  from "../../../../../redux/actions/tools/conversationActions";

import Tweet from "./Tweet"
import User from "./User"

const TweetSummary = () => {

    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Conversation.tsv", tsv);

    const dispatch = useDispatch();

    const tweet = useSelector(state => state.conversation.tweet);
    
    const submitID = (src) => {
        dispatch(setTweetID(src));
    };

    let layout = {
        barmode: "stack",
        autosize:true,
        showlegend: true,
        xaxis: {
            range: tweet.range
        }
    }

    if (tweet.rangeSlider) {
       layout.xaxis.rangeslider = { }
    }

    return (
        <Box mt={3}>
        <Card>
                <CardHeader
                    title={keyword("section_tweet_summary")}
                    className={classes.headerUpladedImage}
                />
                <Box p={3}>
        <Grid
            container
            direction="row"
            spacing={3}
            alignItems="flex-start">
            
            <Grid item xs={6}>



                {tweet.in_reply_to && tweet.in_reply_to !== tweet.conversation_id ? <Button variant="outlined" color="primary" onClick={() => submitID(tweet.conversation_id)}>{keyword("button_explore_root")}</Button> : null }
                {tweet.in_reply_to ? <Button variant="outlined" color="primary" onClick={() => submitID(tweet.in_reply_to)}>{keyword("button_explore_parent")}</Button>  : null }
                <Tweet tweet={tweet} plain keyword={keyword} />
                
                
            </Grid>

            <Grid item xs={6}>
                
                    <User user={tweet.user} keyword={keyword} />

                    {tweet.reply_count === 0 ? <Alert severity="warning">{keyword("summary_no_replies")}</Alert> : "" }
            </Grid>
        </Grid>
        </Box>
        </Card>
        </Box>
    )
}

export default TweetSummary;