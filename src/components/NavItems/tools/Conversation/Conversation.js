import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from 'react-router-dom'

import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsvConversation from "../../../../LocalDictionary/components/NavItems/tools/Conversation.tsv";
import tsvAllTools from "../../../../LocalDictionary/components/NavItems/tools/Alltools.tsv";

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


const Conversation = () => {

    const keyword = useLoadLanguage("components/NavItems/tools/Conversation.tsv", tsvConversation);
    const keywordAllTools = useLoadLanguage("components/NavItems/tools/Alltools.tsv", tsvAllTools);
    const dispatch = useDispatch();

    const conversationInputUrl = useSelector(state => state.conversation.url);
    const cloud = useSelector(state => state.conversation.cloud);
    const errorKey = useSelector(state => state.conversation.errorKey);
    const fail = useSelector(state => state.conversation.fail);
    const loading = useSelector(state => state.conversation.loading);
    const conversation = useSelector(state => state.conversation.conversation);

    const classes = useMyStyles();

    const [userInput, setUserInput] = useState(conversationInputUrl);

    const submitUrl = (src) => {
        dispatch(setConversationInput(src))
    };

    return (
        <div>
            <HeaderTool name={keywordAllTools("navbar_conversation")} description={keywordAllTools("navbar_conversation_description")} icon={<ConversationIcon style={{ fill: "#51A5B2" }} />} />

            <Card>
                <CardHeader
                    title={keyword("cardheader_source")}
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
                                label={keyword("conversation_urlbox")}
                                placeholder={keyword("conversation_urlbox_placeholder")}
                                fullWidth
                                value={userInput || ""}
                                variant="outlined"
                                onChange={e => setUserInput(e.target.value)}
                            />

            
                        </Grid>

                        <Grid item>
                            <Button variant="contained" color="primary" onClick={() => submitUrl(userInput)}>
                                {keyword("button_submit") || ""}
                            </Button>

                        </Grid>

                    </Grid>
                </Box>
            </Card>

            <Box m={3} />

            
            {cloud && !fail ? <TweetSummary/> : null}

            <Box m={3}/>

            {cloud && conversation && conversation.number_of_replies > 0 ? <RepliesExplorer/> : null}

            <LinearProgress hidden={!loading}/>
        </div>
    )
};

// TODO move the display logic for the two results parts into their own classes

export default Conversation;