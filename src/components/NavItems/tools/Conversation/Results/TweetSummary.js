import React from "react";
import {useDispatch, useSelector} from "react-redux";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";
import Grid from "@material-ui/core/Grid";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/Conversation.tsv";
import ReactWordcloud from 'react-wordcloud';
import {select} from "d3-selection";
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

import {Box, Button, TextField} from "@material-ui/core";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";

import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

import Plot from 'react-plotly.js';

import { setConversationInput}  from "../../../../../redux/actions/tools/conversationActions";

import Tweet from "./Tweet"
import TweetList from "./TweetList"
import User from "./User"

import axios from "axios";

import InfiniteScroll from "react-infinite-scroll-component";

const TweetSummary = () => {

    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Conversation.tsv", tsv);
    const dispatch = useDispatch();

    const conversation = useSelector(state => state.conversation.conversation);
    const tweet = useSelector(state => state.conversation.tweet);

    const tweetID = tweet.id //useSelector(state => state.conversation.tweet.id);
    
    
    const stance = useSelector(state => state.conversation.stance)
    
    const submitID = (src) => {
        dispatch(setConversationInput(src));
    };

//

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



                {tweet.in_reply_to ? <Button variant="contained" color="primary" onClick={() => submitID(tweet.in_reply_to)}>Parent</Button>  : null }
                {tweet.in_reply_to && tweet.in_reply_to !== tweet.conversation_id ? <Button variant="contained" color="primary" onClick={() => submitID(tweet.conversation_id)}>Root</Button> : null }
                <Tweet tweet={tweet} />
                
                
            </Grid>

            <Grid item xs={8}>
                
                    <User user={tweet.user} />

                    <Typography variant="body1" paragraph>In here there should be some description of what the tool is showing and how it works. This would be essentially static</Typography>
                    {conversation.number_of_replies === 0 ? <Typography variant="body1" paragraph>unless the tweet has no replies when we could add something different and not show the replies explorer section or the graphs</Typography> : null}
            </Grid>
        </Grid>
        {conversation.number_of_replies > 0 ?
        <Grid
                container
                direction="row"
                spacing={3}
                alignItems="flex-start">

                    <Grid item xs={12}>
                        <Typography variant="body1">We have currently processed {conversation.number_of_replies.toLocaleString()} replies to the selected tweet. The following charts show the overall stance breakdown as well as the timeline of these replies.</Typography>
                    </Grid>

<Grid item xs={4}>
                <Plot style= {{width:"100%"}} data={[stance]} layout={ { autosize:true, showlegend: false }} useResizeHandler={true} config = {{'displayModeBar': false}} />
                
                </Grid>
                <Grid item xs={8}>
                <Plot style= {{width:"100%"}} data={conversation.timeline} layout={ { barmode: "stack", autosize:true, showlegend: true }} useResizeHandler={true} config = {{'displayModeBar': false}} />

                </Grid>
        </Grid>
        : null }
        </Box>
        </Card>
    )
}

export default TweetSummary;