import React, {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";

import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsvConversation from "../../../../LocalDictionary/components/NavItems/tools/Conversation.tsv";

import { setConversationInput}  from "../../../../redux/actions/tools/conversationActions";

import { ReactComponent as ConversationIcon } from "../../../NavBar/images/SVG/DataAnalysis/Twitter_conversation.svg"

import {Box, Button, TextField} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";

import Typography from "@material-ui/core/Typography";

import LinearProgress from "@material-ui/core/LinearProgress";

import TweetSummary from "./Results/TweetSummary"
import TweetStatistics from "./Results/Statistics"
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

    // make sure we link the input field state with the main persistent state
    useEffect(() => {
        setUserInput(conversationInputUrl)
     },[conversationInputUrl])

    const submitUrl = (src) => {
        dispatch(setConversationInput(src))
    };

    // Renderer callback with condition
    const renderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
            // Render a completed state
            return <span>{keyword("refresh_reloading")}</span>;
        } else {
            // Render a countdown
            // can't use evalKeyword as seconds isn't within it's scope
            // eslint-disable-next-line
            return <span>{eval("`"+keyword("refresh_countdown")+"`")}</span>;
        }
    };
  
    return (
        <div>
            <HeaderTool name={keyword("title")} icon={<ConversationIcon style={{ fill: "#51A5B2" }} />} />
            <Typography variant="body1" paragraph>{keyword("description")}</Typography>
            <Typography variant="body1" paragraph>{keyword("description_needs_replies")}</Typography>
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

            {flashMessage ? <Box mt={3}><Alert severity={flashType}>{flashMessage} {flashRefresh === true ? <Countdown
    date={Date.now() + 30000}
    renderer={renderer}
    onComplete={() => submitUrl(conversationInputUrl)}  />
: null }</Alert></Box> : null }

            {stance && !fail ? <TweetSummary/> : null}

            {cloud && conversation && tweet && tweet.number_of_replies > 0 ? <RepliesExplorer/> : null}

            {stance && !fail && tweet.number_of_replies > 0 ? <TweetStatistics/> : null}

            <LinearProgress hidden={!loading}/>
        </div>
    )
};

// TODO move the display logic for the two results parts into their own classes

export default Conversation;