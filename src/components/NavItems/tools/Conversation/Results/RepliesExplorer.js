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

import {Radio, RadioGroup, FormControl, FormControlLabel} from "@material-ui/core"

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Alert from '@material-ui/lab/Alert';

import { setConversationInput, setConversationFilter, setConversationRestriction }  from "../../../../../redux/actions/tools/conversationActions";

import TweetList from "./TweetList"
import User from "./User"

const RepliesExplorer = () => {

    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Conversation.tsv", tsv);

    const evalKeyword = (key) => {
        // eslint-disable-next-line
        return eval("`"+keyword(key)+"`");
    }

    const dispatch = useDispatch();

    const conversation = useSelector(state => state.conversation.conversation);
    const tweet = useSelector(state => state.conversation.tweet);

    const tweetID = tweet.id
    
    const hashtagCloud = useSelector(state => state.conversation.cloud)
    const urlTableData = conversation.urls
    const users = conversation.users

    const filter = useSelector(state => state.conversation.filter)
    const restrict = useSelector(state => state.conversation.restriction)

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

    const changeRestriction = (event) => {
        dispatch(setConversationRestriction(event.target.value));
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

    return (
    
        <Card>
                <CardHeader
                    title={evalKeyword("section_replies_explorer")}
                    className={classes.headerUpladedImage}
                />
                <Box p={3}>

        <Grid
            container
            direction="row"
            spacing={3}
            alignItems="flex-start">
                
                <Grid item xs={12}>

                {moreTweets ? <Alert severity="info">{keyword("more_tweets_prefix")} <Button size="small" variant="outlined" onClick={() => submitID(tweet.id)}>{keyword("button_refresh")}</Button> {keyword("more_tweets_suffix")}</Alert> : null }

                <Typography variant="body1" paragraph>{keyword("summary_replies_1")}</Typography>

                <Typography variant="body1" paragraph>{keyword("summary_replies_2")}</Typography>

                </Grid>
            </Grid>
            <Paper style={{ padding: 10, marginTop: 10, marginBottom: 10}}>
            <Grid
            container
            direction="row"
            spacing={3}
            alignItems="flex-start">

            <Grid item xs={6}>
                <FormControl component="fieldset">

  <Typography  variant="body1">{keyword("replies_filter_stance")}</Typography>
  <RadioGroup row aria-label="stance" name="row-radio-buttons-group" value={filter} onChange={changeFilter}>
    <FormControlLabel value="support" control={<Radio />} label={keyword("stance_support")} />
    <FormControlLabel value="deny" control={<Radio />} label={keyword("stance_deny")} />
    <FormControlLabel value="query" control={<Radio />} label={keyword("stance_query")} />
    <FormControlLabel value="comment" control={<Radio />} label={keyword("stance_comment")} />
    <FormControlLabel value="any" control={<Radio />} label={keyword("stance_any")} />
  </RadioGroup>
</FormControl>
        </Grid>

        <Grid item xs={6}>
<FormControl component="fieldset">
<Typography  variant="body1">{keyword("replies_filter_contain")}</Typography>
  <RadioGroup row aria-label="contain" name="row-radio-buttons-group" value={restrict} onChange={changeRestriction}>
    <FormControlLabel value="hashtags" control={<Radio />} label={keyword("contains_hashtags")} />
    <FormControlLabel value="user_mentions" control={<Radio />} label={keyword("contains_user_mentions")} />
    <FormControlLabel value="urls" control={<Radio />} label={keyword("contains_urls")} />
    <FormControlLabel value="none" control={<Radio />} label={keyword("contains_none")} />
  </RadioGroup>
</FormControl>
</Grid>
</Grid>

<Grid
            container
            direction="row"
            spacing={3}
            alignItems="flex-start">
                
                <Grid item xs={12}>
<Typography variant="body1">{evalKeyword("replies_filtered")}</Typography>
                </Grid>
        </Grid>
</Paper>
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
                <Card>
                <CardHeader
                    title={keyword("the_hashtags")}
                    className={classes.headerUpladedImage}
                />
             <Box p={2}><Typography variant="body1">{evalKeyword("summary_hashcloud")}</Typography></Box>
                <div style={{height: 450}}>
                    <ReactWordcloud words={hashtagCloud} options={options} callbacks={callbacks} />
                </div>
                <Dialog
                    open={openHashtag}
                    onClose={handleCloseHashtag}
                    maxWidth="sm">
                    <DialogContent>
                    <Typography variant="h3">#{hashtag}</Typography>
                    <Typography variant="body1">{evalKeyword("hashtags_summary")}</Typography>
                    <Button color="primary" size="small" style={{textTransform: "none"}} onClick={() => window.open(`https://twitter.com/hashtag/${hashtag}?f=live`,`blank`)}>{keyword("hashtags_view_on_twitter")}</Button>
                    <TweetList stance={filter} hashtag={hashtag} id_str={tweetID} viewTweet={submitID} keyword={keyword}/>
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

                    <Grid item xs={3}>
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
                                    <TableCell>{users[screen_name].toLocaleString()} ({(100*users[screen_name]/conversation.number_of_replies).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}%)</TableCell>
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
                        <User screen_name={screenName} keyword={keyword}/>
                    </Grid>
                        
                    <Grid item xs={5}>
                        <TweetList stance={filter} screen_name={screenName} id_str={tweetID} viewTweet={submitID} keyword={keyword} />
                    </Grid>
                    
                    </Grid></DialogContent>
                        
                </Dialog>
                </Card>
                    </Grid>

                    <Grid item xs={9}>
                        <Card>
                    <CardHeader
                    title={keyword("the_urls")}
                    className={classes.headerUpladedImage}
                />
                    <Box p={2}><Typography variant="body1">{evalKeyword("table_description_urls")}</Typography></Box>
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
                </TableContainer>
                </Card>
                    </Grid>
                    
            </Grid>
            </Box>
            </Card>

    )
}

export default RepliesExplorer;