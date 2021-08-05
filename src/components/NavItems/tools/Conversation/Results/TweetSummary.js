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

    const layout = {
        barmode: "stack",
        autosize:true,
        showlegend: true,
        xaxis : {
            range: tweet.range,
            rangeslider: { },
        }
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

                    <Typography variant="body1" paragraph>In here there should be some description of what the tool is showing and how it works, incuding details on how the timeline view works if we are showing the range selector. This would be essentially static</Typography>
                    {tweet.number_of_replies === 0 ? <Typography variant="body1" paragraph>unless the tweet has no replies when we could add something different and not show the replies explorer section or the graphs</Typography> : null}
            </Grid>
        </Grid>
        {tweet.number_of_replies > 0 ?
        <Grid
                container
                direction="row"
                spacing={3}
                alignItems="flex-start">

                    <Grid item xs={12}>
                        <Typography variant="body1">We have currently processed {tweet.number_of_replies.toLocaleString()} replies to the selected tweet. The following charts show the overall stance breakdown as well as the timeline of these replies.</Typography>
                    </Grid>

<Grid item xs={4}>
                <Plot style= {{width:"100%"}} data={[stance]} layout={ { autosize:true, showlegend: false }} useResizeHandler={true} config = {{'displayModeBar': false}} />
                
                </Grid>
                <Grid item xs={8}>
                <Plot style= {{width:"100%"}} data={tweet.timeline} layout={layout} useResizeHandler={true} config = {{'displayModeBar': false}} />

                </Grid>
        </Grid>
        : null }
        </Box>
        </Card>
    )
}

export default TweetSummary;