import React from "react";
import { useDispatch, useSelector } from "react-redux";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";
import Grid from "@material-ui/core/Grid";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/Conversation.tsv";
import ReactWordcloud from 'react-wordcloud';
import { select } from "d3-selection";
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

import { Box, Button } from "@material-ui/core";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";

import { Radio, RadioGroup, FormControl, FormControlLabel, FormGroup } from "@material-ui/core"

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Alert from '@material-ui/lab/Alert';

import { setTweetID, setConversationFilter, setConversationRestriction } from "../../../../../redux/actions/tools/conversationActions";

import TweetList from "./TweetList"
import User from "./User"
import { Checkbox } from "@material-ui/core";

import StanceLabel from "./StanceLabel"

import { default as HashtagIcon } from "../images/Hashtag";
import AlternateEmailOutlinedIcon from '@material-ui/icons/AlternateEmailOutlined';
import LinkOutlinedIcon from '@material-ui/icons//LinkOutlined';

const RepliesExplorer = () => {

    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Conversation.tsv", tsv);

    const evalKeyword = (key) => {
        // eslint-disable-next-line
        return eval("`" + keyword(key) + "`");
    }

    const dispatch = useDispatch();

    const conversation = useSelector(state => state.conversation.conversation);
    const tweet = useSelector(state => state.conversation.tweet);

    const tweetID = tweet.id

    const hashtagCloud = useSelector(state => state.conversation.cloud)
    const urlTableData = conversation.urls
    const users = conversation.users

    var filter = useSelector(state => state.conversation.filter)
    var restrict = useSelector(state => state.conversation.restriction)

    function getCallback(callback) {
        return function (word, event) {
            const isActive = callback !== "onWordMouseOut";
            const element = event.target;
            const text = select(element);
            text
                .on("click", () => {
                    if (isActive) {
                        handleOpenHashtag(word.text.substring(1), word.value);
                    }
                })
                .transition()
                .attr("font-weight", isActive ? "bold" : "normal");
        };
    }

    const options = {
        rotations: 1,
        rotationAngles: [0],
        fontSizes: [15, 60],
        // TODO pull this automatically from somewhere?
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif"
    };

    const callbacks = {
        onWordClick: getCallback("onWordClick"),
        onWordMouseOut: getCallback("onWordMouseOut"),
        onWordMouseOver: getCallback("onWordMouseOver")
    }

    const submitID = (src) => {
        dispatch(setTweetID(src));
    };

    const changeFilter = (event) => {
        const changing = event.target.name;
        
        if (filter.includes(changing)) {
            filter = filter.filter(item => item !== changing)
        }
        else {
            filter.push(changing);
        }

        dispatch(setConversationFilter(filter));
    };

    const changeRestriction = (event) => {

        const changing = event.target.name;
        
        if (restrict.includes(changing)) {
            restrict = restrict.filter(item => item !== changing)
        }
        else {
            restrict.push(changing);
        }

        dispatch(setConversationRestriction(restrict));
    }

    const [openUser, setOpenUser] = React.useState(false);
    const [screenName, setScreenName] = React.useState(null);

    const handleOpenUser = (e, screen_name) => {
        e.preventDefault();
        setScreenName(screen_name);
        setOpenUser(true);
    };

    const handleCloseUser = () => {
        setOpenUser(false);
        setScreenName(null);
    };

    const [openHashtag, setOpenHashtag] = React.useState(false);
    const [hashtag, setHashtag] = React.useState(null);

    // eslint-disable-next-line
    const [hashtagCount, setHashtagCount] = React.useState(null);

    const handleOpenHashtag = (hashtag, value) => {
        setHashtag(hashtag);
        setHashtagCount(value);
        setOpenHashtag(true);
    };

    const handleCloseHashtag = () => {
        setOpenHashtag(false);
        setHashtag(null);
    };

    const moreTweets = (tweet.number_of_replies / tweet.reply_count) < 0.5;

    // eslint-disable-next-line
    const filterPercent = 100 * (conversation.number_of_replies / tweet.number_of_replies)

    const style = {
        fill: "black",
        height: "1.2em",
        width: "1.2em",
        verticalAlign:"middle"
    }

    return (
        <Box mt={3}>
        <Card>
            <CardHeader
                title={keyword("section_replies_explorer")}
                className={classes.headerUpladedImage}
            />
            <Box p={3}>

                <Grid
                    container
                    direction="row"
                    spacing={3}
                    alignItems="flex-start">

                    <Grid item xs={12}>

                        {moreTweets ? <Alert severity="info">{keyword("more_tweets_prefix")} <Button size="small" variant="outlined" onClick={() => submitID(tweet.id)}>{keyword("button_refresh")}</Button> {keyword("more_tweets_suffix")}</Alert> : null}

                        <Typography variant="body1" paragraph>{keyword("summary_replies_1")}</Typography>

                        <Typography variant="body1" paragraph>{keyword("summary_replies_2")}</Typography>

                    </Grid>
                </Grid>
                <Paper style={{ padding: 10, marginTop: 10, marginBottom: 10 }}>
                    <Grid
                        container
                        direction="row"
                        spacing={3}
                        alignItems="flex-start">

                        <Grid item xs={6}>
                            <FormControl component="fieldset">
                                <Typography variant="body1">{keyword("replies_filter_stance")}</Typography>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox name="comment" onChange={changeFilter} checked={filter.includes("comment")} />} label={<StanceLabel type="comment"/>} labelPlacement="start" />
                                    <FormControlLabel control={<Checkbox name="query" onChange={changeFilter} checked={filter.includes("query")} />} label={<StanceLabel type="query"/>} labelPlacement="start" />
                                    <FormControlLabel control={<Checkbox name="support" onChange={changeFilter} checked={filter.includes("support")} />} label={<StanceLabel type="support"/>} labelPlacement="start" />
                                    <FormControlLabel control={<Checkbox name="deny" onChange={changeFilter} checked={filter.includes("deny")} />} label={<StanceLabel type="deny"/>} labelPlacement="start" />
                                </FormGroup>
                            </FormControl>
                        </Grid>

                        <Grid item xs={6}>
                            <FormControl component="fieldset">
                                <Typography variant="body1">{keyword("replies_filter_contain")}</Typography>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox name="hashtags" onChange={changeRestriction} checked={restrict.includes("hashtags")} />} label={<span><HashtagIcon style={style}/> {keyword("contains_hashtags")}</span>} labelPlacement="start" />
                                    <FormControlLabel control={<Checkbox name="user_mentions" onChange={changeRestriction} checked={restrict.includes("user_mentions")} />} label={<span><AlternateEmailOutlinedIcon style={style}/> {keyword("contains_user_mentions")}</span>} labelPlacement="start" />
                                    <FormControlLabel control={<Checkbox name="urls" onChange={changeRestriction} checked={restrict.includes("urls")} />} label={<span><LinkOutlinedIcon style={style}/> {keyword("contains_urls")}</span>} labelPlacement="start" />
                                </FormGroup>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Grid
                        container
                        direction="row"
                        spacing={3}
                        alignItems="flex-start">

                        <Grid item xs={12}>
                            {conversation.number_of_replies > 0 ?
                                <Typography variant="body1">{evalKeyword("replies_filtered")}</Typography> : <Alert severity="warning">The current filter does not match any of the replies to this Tweet.</Alert>}
                        </Grid>
                    </Grid>
                </Paper>
                {conversation.number_of_replies > 0 ?
                    <div>
                        <Grid
                            container
                            direction="row"
                            spacing={3}
                            alignItems="flex-start">
                            <Grid item xs={4}>

                                <Card>
                                    <CardHeader
                                        title={keyword("the_replies")}
                                        className={classes.headerUpladedImage}
                                    />
                                    <TweetList conversation={conversation} viewTweet={submitID} keyword={keyword} />
                                </Card>
                            </Grid>
                            <Grid item xs={8}>
                                <Card style={{ opacity: hashtagCloud.length > 0 ? 1 : 0.5 }}>
                                    <CardHeader
                                        title={keyword("the_hashtags")}
                                        className={classes.headerUpladedImage}
                                    />
                                    <Box p={2}><Typography variant="body1">{hashtagCloud.length > 0 ? evalKeyword("summary_hashcloud") : keyword("hashtags_none")}</Typography></Box>
                                    <div style={{ height: 444 }}>
                                        <ReactWordcloud words={hashtagCloud} options={options} callbacks={callbacks} />
                                    </div>
                                    <Dialog
                                        open={openHashtag}
                                        onClose={handleCloseHashtag}
                                        maxWidth="sm">
                                        <DialogContent>
                                            <Typography variant="h3">#{hashtag}</Typography>
                                            <Typography variant="body1">{evalKeyword("hashtags_summary")}</Typography>
                                            <Button color="primary" size="small" style={{ textTransform: "none" }} onClick={() => window.open(`https://twitter.com/hashtag/${hashtag}?f=live`, `blank`)}>{keyword("hashtags_view_on_twitter")}</Button>
                                            <TweetList stance={filter} hashtag={hashtag} id_str={tweetID} viewTweet={submitID} keyword={keyword} />
                                        </DialogContent>

                                    </Dialog>
                                </Card>
                            </Grid>
                        </Grid>

                        <Grid
                            container
                            direction="row"
                            spacing={3}
                            alignItems="flex-start">

                            <Grid item xs={8}>
                                <Card style={{ opacity: Object.keys(urlTableData).length > 0 ? 1 : 0.5 }}>
                                    <CardHeader
                                        title={keyword("the_urls")}
                                        className={classes.headerUpladedImage}
                                    />
                                    <Box p={2}><Typography variant="body1">{Object.keys(urlTableData).length > 0 ? evalKeyword("table_description_urls") : keyword("urls_none")}</Typography></Box>
                                    {Object.keys(urlTableData).length > 0 ?
                                        <TableContainer component={Paper}>
                                            <Table className={classes.table} aria-label="simple table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>{keyword("table_header_url")}</TableCell>
                                                        <TableCell>{keyword("table_header_appearances")}</TableCell>
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
                                        </TableContainer> : ""}
                                </Card>
                            </Grid>



                            <Grid item xs={4}>
                                <Card>
                                    <CardHeader
                                        title={keyword("the_people")}
                                        className={classes.headerUpladedImage}
                                    />
                                    <Box p={2}><Typography variant="body1">{evalKeyword("table_description_users")}</Typography></Box>
                                    <TableContainer component={Paper}>
                                        <Table className={classes.table} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>{keyword("table_header_screen_name")}</TableCell>
                                                    <TableCell>{keyword("table_header_tweets")}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {Object.keys(users).map((screen_name, key) => (
                                                    <TableRow key={key}>
                                                        <TableCell><Link href="#" onClick={(e) => handleOpenUser(e, screen_name)}>{screen_name}</Link></TableCell>
                                                        <TableCell>{users[screen_name].toLocaleString()} ({(100 * users[screen_name] / conversation.number_of_replies).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%)</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <Dialog
                                        open={openUser}
                                        onClose={handleCloseUser}
                                        maxWidth="md">
                                        <DialogContent>
                                            <Grid
                                                container
                                                direction="row"
                                                spacing={3}
                                                alignItems="flex-start">
                                                <Grid item xs={7}>
                                                    <User screen_name={screenName} keyword={keyword} />
                                                </Grid>

                                                <Grid item xs={5}>
                                                    <TweetList stance={filter} screen_name={screenName} id_str={tweetID} viewTweet={submitID} keyword={keyword} />
                                                </Grid>

                                            </Grid>
                                        </DialogContent>

                                    </Dialog>
                                </Card>
                            </Grid>


                        </Grid></div>
                    : ""}
            </Box>
        </Card>
        </Box>


    )
}

export default RepliesExplorer;