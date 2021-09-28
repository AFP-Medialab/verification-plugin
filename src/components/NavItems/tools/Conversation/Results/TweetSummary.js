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

import Typography from "@material-ui/core/Typography";

import Plot from 'react-plotly.js';

import { setTweetID }  from "../../../../../redux/actions/tools/conversationActions";

import Tweet from "./Tweet"
import User from "./User"

const TweetSummary = () => {

    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Conversation.tsv", tsv);

    const dispatch = useDispatch();

    const tweet = useSelector(state => state.conversation.tweet);

    const stance = useSelector(state => state.conversation.stance)

    // convert the stance labels to whatever they are in the current language
    for (var i = 0 ; i < stance["labels"].length ; ++i) {
        stance["labels"][i] = keyword("stance_"+stance["labels"][i]);

        if (tweet.timeline)
            tweet.timeline[i]["name"] = keyword("stance_"+tweet.timeline[i]["name"]);
    }
    
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
            
            <Grid item xs={4}>



                {tweet.in_reply_to && tweet.in_reply_to !== tweet.conversation_id ? <Button variant="outlined" color="primary" onClick={() => submitID(tweet.conversation_id)}>{keyword("button_explore_root")}</Button> : null }
                {tweet.in_reply_to ? <Button variant="outlined" color="primary" onClick={() => submitID(tweet.in_reply_to)}>{keyword("button_explore_parent")}</Button>  : null }
                <Tweet tweet={tweet} plain keyword={keyword} />
                
                
            </Grid>

            <Grid item xs={8}>
                
                    <User user={tweet.user} keyword={keyword} />

                    {tweet.reply_count === 0 ? <Typography variant="body1" paragraph>{keyword("summary_no_replies")}</Typography> : "" }
            </Grid>
        </Grid>
        {tweet.number_of_replies > 0 ?
        <Grid
                container
                direction="row"
                spacing={3}
                alignItems="flex-start">

<Grid item xs={4}>
                <Typography variant="body1">{keyword("summary_piechart")}</Typography>
                <Plot style= {{width:"100%"}} data={[stance]} layout={ { autosize:true, showlegend: false }} useResizeHandler={true} config = {{'displayModeBar': false}} />
                
                </Grid>
                <Grid item xs={8}>
                <Typography variant="body1" paragraph>{keyword("summary_histogram_time")}</Typography>
                {tweet.timeline ?
                <Grid
                container
                direction="row">
                    <Typography variant="body1">{keyword("summary_histogram_week")}</Typography>
                    <Plot style= {{width:"100%"}} data={tweet.timeline} layout={layout} useResizeHandler={true} config = {{'displayModeBar': false}} />
                    </Grid>
                    :
                    <Typography variant="body1">{keyword("summary_histogram_day")}</Typography>
                }
                </Grid>
        </Grid>
        : null }
        </Box>
        </Card>
    )
}

export default TweetSummary;