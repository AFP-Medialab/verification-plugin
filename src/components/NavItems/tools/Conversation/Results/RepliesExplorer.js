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

import {Box, Button} from "@material-ui/core";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

import { setConversationInput, setConversationFilter }  from "../../../../../redux/actions/tools/conversationActions";

import TweetList from "./TweetList"
import User from "./User"

const RepliesExplorer = () => {

    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Conversation.tsv", tsv);
    const dispatch = useDispatch();

    const conversation = useSelector(state => state.conversation.conversation);
    const tweet = useSelector(state => state.conversation.tweet);

    const tweetID = tweet.id //useSelector(state => state.conversation.tweet.id);
    
    const hashtagCloud = useSelector(state => state.conversation.cloud)
    const urlTableData = conversation.urls
    const users = conversation.users

    const filter = useSelector(state => state.conversation.filter)

    console.log(conversation.number_of_replies);

    function getCallback(callback) {
        return function (word, event) {
            const isActive = callback !== "onWordMouseOut";
            const element = event.target;
            const text = select(element);
            text
                .on("click", () => {
                    if (isActive) {window.open(`https://twitter.com/hashtag/${word.text.substring(1)}?f=live`, "_blank");}
                })
                .transition()
                .attr("text-decoration", isActive ? "underline" : "none");
        };
    }

    const options = {
        rotations: 1,
        rotationAngles: [0],
        fontSizes: [15,60],
        // TODO pull this automatically from somewhere?
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif"
    };

    const callbacks = {
        onWordClick: getCallback("onWordClick"),
        onWordMouseOut: getCallback("onWordMouseOut"),
        onWordMouseOver: getCallback("onWordMouseOver")
    }

    const submitID = (src) => {
        dispatch(setConversationInput(src));
    };

    const changeFilter = (event) => {
        dispatch(setConversationFilter(event.target.value));
    };

    const [open, setOpen] = React.useState(false);
    const [screenName, setScreenName] = React.useState(null);

    const handleClickOpen = (screen_name) => {
        setScreenName(screen_name);
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
        setScreenName(null);
      };

    return (
        
        
        <Card>
                <CardHeader
                    title={"Replies Explorer"}
                    className={classes.headerUpladedImage}
                />
                <Box p={3}>

        <Grid
            container
            direction="row"
            spacing={3}
            alignItems="flex-start">
                
                <Grid item xs={12}>
                <Typography variant="body1"><label>There are {conversation.number_of_replies.toLocaleString()} replies with a stance label of&nbsp;
                    <select value={filter} onChange={changeFilter}>
                        <option>any</option>
                        <option>comment</option>
                        <option>deny</option>
                        <option>query</option>
                        <option>support</option>
                    </select></label></Typography>
                </Grid>
        </Grid>

        <Grid
            container
            direction="row"
            spacing={3}
            alignItems="flex-start">
                <Grid item xs={4}>
                <TweetList conversation={conversation} viewTweet={submitID} />
                </Grid>
                <Grid item xs={8}>
             <Typography variant="body1">The {hashtagCloud.length !== 100 ? "hashtags" : "top 100 hashtags"} appearing in the replies:</Typography>
                <div style={{height: 500}}>
                    <ReactWordcloud words={hashtagCloud} options={options} callbacks={callbacks} />
                </div>
                </Grid>
            </Grid>

            <Grid
                container
                direction="row"
                spacing={3}
                alignItems="flex-start">

                    <Grid item xs={3}>
                    <Typography variant="body1">The {Object.keys(users).length === 10 ? "ten most active" : ""} users contributing to this conversation are:</Typography>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Screen Name</TableCell>
                                <TableCell>Tweets</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.keys(users).map((screen_name, key) => (
                                <TableRow key={key}>
                                    <TableCell><Button color="primary" size="small" style={{textTransform: "none"}} onClick={() => handleClickOpen(screen_name)}>{screen_name}</Button></TableCell>
                                    <TableCell>{users[screen_name].toLocaleString()} ({(100*users[screen_name]/conversation.number_of_replies).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}%)</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    maxWidth="md">
                    <DialogContent>
                    <Grid
                container
                direction="row"
                spacing={3}
                alignItems="flex-start">
                        <Grid item xs={7}>
                        <User screen_name={screenName}/></Grid>
                    <Grid item xs={5}>
                        <TweetList stance={filter} screen_name={screenName} id_str={tweetID} viewTweet={submitID} />
                    </Grid>
                    
                    </Grid></DialogContent>
                        
                </Dialog>
                    </Grid>

                    <Grid item xs={9}>
                    <Typography variant="body1">The {Object.keys(urlTableData).length === 10 ? "ten most frequently occuring" : ""} URLs within the replies are:</Typography>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>URL</TableCell>
                                <TableCell>Appearances</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.keys(urlTableData).map((row, key) => (
                                <TableRow key={key}>
                                    <TableCell><Link href={row} target="_blank">{row}</Link></TableCell>
                                    <TableCell>{urlTableData[row].toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                    </Grid>
            </Grid>
            </Box>
            </Card>

    )
}

export default RepliesExplorer;