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

import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

import Plot from 'react-plotly.js';

import { setConversationInput }  from "../../../../../redux/actions/tools/conversationActions";

import Tweet from "./Tweet"
import User from "./User"

const TweetSummary = () => {

    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Conversation.tsv", tsv);
    const dispatch = useDispatch();

    const tweet = useSelector(state => state.conversation.tweet);

    const stance = useSelector(state => state.conversation.stance)
    
    const submitID = (src) => {
        dispatch(setConversationInput(src));
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
                    title={"Tweet Summary"}
                    className={classes.headerUpladedImage}
                />
                <Box p={3}>
        <Grid
            container
            direction="row"
            spacing={3}
            alignItems="flex-start">
            
            <Grid item xs={4}>



                {tweet.in_reply_to && tweet.in_reply_to !== tweet.conversation_id ? <Button variant="outlined" color="primary" onClick={() => submitID(tweet.conversation_id)}>Explore from Root...</Button> : null }
                {tweet.in_reply_to ? <Button variant="outlined" color="primary" onClick={() => submitID(tweet.in_reply_to)}>Explore Parent...</Button>  : null }
                <Tweet tweet={tweet} plain/>
                
                
            </Grid>

            <Grid item xs={8}>
                
                    <User user={tweet.user} />

                    <Typography variant="body1" paragraph>This tool is designed to allow you to explore conversations happening on Twitter, and especially how replies support, deny, or comment on tweets.
                    The top section of the page presents an overview of the selected tweet and the user who posted it. While the bottom half of the page allows you to interactively explore the replies.</Typography>
                    {tweet.reply_count === 0 ? <Typography variant="body1" paragraph>No one has replied to this tweet so there is no further analysis we can perform.</Typography> : <Typography variant="body1" paragraph>We have currently processed {tweet.number_of_replies.toLocaleString()} replies to the currently selected tweet.</Typography>}
            </Grid>
        </Grid>
        {tweet.number_of_replies > 0 ?
        <Grid
                container
                direction="row"
                spacing={3}
                alignItems="flex-start">

<Grid item xs={4}>
                <Typography variant="body1">We automatically assign one of four possible stance labels to each reply; support, query, deny, or comment. This pie chart shows the proportion of stance labels across all the replies we have processed so far.</Typography>
                <Plot style= {{width:"100%"}} data={[stance]} layout={ { autosize:true, showlegend: false }} useResizeHandler={true} config = {{'displayModeBar': false}} />
                
                </Grid>
                <Grid item xs={8}>
                <Typography variant="body1" paragraph>Replies clearly don't all happen at once and it's useful to be able to see how the volume of replies, as well as the stance, changes over time.</Typography>
                {tweet.timeline ?
                <Grid
                container
                direction="row">
                    <Typography variant="body1">This histogram allows you to do both, and initially shows the first week after the selected tweet was published.
                    If replies were posted outside the initial week, then you can adjust the graph to view these, either by dragging the x-axis or, if the replies occur over a very long period, using the range selector shown below the graph.</Typography>
                    <Plot style= {{width:"100%"}} data={tweet.timeline} layout={layout} useResizeHandler={true} config = {{'displayModeBar': false}} />
                    </Grid>
                    :
                    <Typography variant="body1">In this case, however, all the replies occured on the same day so the pie chart gives a clearer breakdown than a histogram would.</Typography>
                }
                </Grid>
        </Grid>
        : null }
        </Box>
        </Card>
    )
}

export default TweetSummary;