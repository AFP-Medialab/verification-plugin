import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsvConversation from "../../../../LocalDictionary/components/NavItems/tools/Conversation.tsv";

import { setConversationInput}  from "../../../../redux/actions/tools/conversationActions";

import { ReactComponent as ConversationIcon } from "../../../NavBar/images/SVG/DataAnalysis/Twitter_sna.svg"

import {Box, Button, TextField} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";

import LinearProgress from "@material-ui/core/LinearProgress";

import TweetSummary from "./Results/TweetSummary"
import RepliesExplorer from "./Results/RepliesExplorer"

import Alert from '@material-ui/lab/Alert';

import Countdown from 'react-countdown';

const Conversation = () => {

    const keyword = useLoadLanguage("components/NavItems/tools/Conversation.tsv", tsvConversation);
    const dispatch = useDispatch();

    const conversationInputUrl = useSelector(state => state.conversation.url);
    const cloud = useSelector(state => state.conversation.cloud);
    const stance = useSelector(state => state.conversation.cloud);
    const flashType = useSelector(state => state.conversation.flashType);
    const flashMessage = useSelector(state => state.conversation.flashMessage);
    const flashRefresh = useSelector(state => state.conversation.flashRefresh);
    const fail = useSelector(state => state.conversation.fail);
    const loading = useSelector(state => state.conversation.loading);
    const conversation = useSelector(state => state.conversation.conversation);
    const tweet = useSelector(state => state.conversation.tweet)

    const classes = useMyStyles();

    const [userInput, setUserInput] = useState(conversationInputUrl);

    const submitUrl = (src) => {
        dispatch(setConversationInput(src))
    };

    // Renderer callback with condition
    const renderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
            // Render a completed state
            return <span>reloading...</span>;
        } else {
            // Render a countdown
            return <span>Page will automatically reload in {seconds}s</span>;
        }
    };
  
    return (
        <div>
            <HeaderTool name={keyword("title")} description={keyword("description")} icon={<ConversationIcon style={{ fill: "#51A5B2" }} />} />

            <Card>
                <CardHeader
                    title={keyword("section_explore_from")}
                    className={classes.headerUpladedImage}
                />
                <Box p={3}>
                    <Grid
                        container
                        direction="row"
                        spacing={3}
                        alignItems="center"
                    >
                        <Grid item xs>
                            <TextField
                                id="standard-full-width"
                                label={keyword("urlbox")}
                                placeholder={keyword("urlbox_placeholder")}
                                fullWidth
                                value={userInput || ""}
                                variant="outlined"
                                onChange={e => setUserInput(e.target.value)}
                                onKeyPress={e => {
                                    if (e.key === 'Enter') {
                                        submitUrl(userInput);
                                    }
                                  }}
                            />

            
                        </Grid>

                        <Grid item>
                            <Button variant="contained" color="primary" onClick={() => submitUrl(userInput)}>
                                {keyword("button_explore_tweet") || ""}
                            </Button>

                        </Grid>

                    </Grid>
                </Box>
            </Card>

            <Box m={3} />

            {flashMessage ? <Alert severity={flashType}>{flashMessage} {flashRefresh === true ? <Countdown
    date={Date.now() + 30000}
    renderer={renderer}
    onComplete={() => submitUrl(userInput)}  />
: null }</Alert> : null }

            {flashMessage ? <Box m={3} /> : null}

            {stance && !fail ? <TweetSummary/> : null}

            <Box m={3}/>

            {cloud && conversation && tweet && tweet.number_of_replies > 0 ? <RepliesExplorer/> : null}

            <LinearProgress hidden={!loading}/>
        </div>
    )
};

// TODO move the display logic for the two results parts into their own classes

export default Conversation;