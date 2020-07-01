import React, {useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

//material-ui
import ArrowForwardFilledIcon from '@material-ui/icons/ArrowForward';
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Divider from "@material-ui/core/Divider";
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import DuoIcon from '@material-ui/icons/Duo';
import FormatQuoteIcon from '@material-ui/icons/FormatQuote';
import Grid from "@material-ui/core/Grid";
import InfoIcon from '@material-ui/icons/Info';
import {ListItemIcon, Paper} from "@material-ui/core";
import LanguageTwoToneIcon from '@material-ui/icons/LanguageTwoTone';
import LinearProgress from "@material-ui/core/LinearProgress";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

//internal imports
import AuthenticationCard from "../../Shared/Authentication/AuthenticationCard";
import CustomTile from "../../Shared/CustomTitle/CustomTitle";
import CloseResult from "../../Shared/CloseResult/CloseResult";
import tsv from "../../../LocalDictionary/components/Scrapers/Twitter.tsv";
import {twitterResetAction} from "../../../redux/actions/scrapers/twitterActions";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import useTwitterApi from "./useTwitterApi";


const TwitterCard = () => {

    const classes = useMyStyles();
    const dispatch = useDispatch();
    const twitterApi = useTwitterApi();
    const keyword = useLoadLanguage("components/Scrapers/Twitter.tsv", tsv);

    const twitterRequestLoading = useSelector(state => state.twitter.twitterRequestLoading);
    const twitterResultReceived = useSelector(state => state.twitter.twitterResultReceived);
    const tweet = useSelector(state => state.twitter.tweet);

    let textInput = useRef(null);
    const [input, setInput] = useState("");


    const getMediaCard = () => {
        if(tweet.imageUrl!=null) {
            return <CardMedia component="img" image={tweet.imageUrl} height={"100%"} width={"100%"}/>
        }
        else if(tweet.videoUrl!=null){
            return <CardMedia component="iframe" src={tweet.videoUrl} height="350" width="100%"/>
        }
        else if(tweet.linkUrl!=null){
            return (
            <CardMedia>
                <Typography>
                    <LanguageTwoToneIcon className={classes.twitterIcon} color={"action"}/>
                    <a href={tweet.linkUrl}>{tweet.linkUrl}</a>
                </Typography>
            </CardMedia>)
        }
        else return <CardMedia><Typography>{keyword("no_media")}</Typography></CardMedia>
    }

    return <Paper className={classes.root}>
        <CustomTile text={keyword("twitter_card_title")}/>
        <Box m={3}/>
        <AuthenticationCard/>
        <Grid container spacing={2}>
            <Grid item xs = {12} >
                <ListItem>
                    <TextField
                        variant="outlined"
                        label={keyword("twitter_enter_url")}
                        style={{margin: 8}}
                        placeholder={""}
                        fullWidth
                        inputRef = {textInput}
                        helperText={"Format: https://twitter.com/{user-goes-here}/status/{tweet-id-goes-here}"}
                        onChange={e => setInput(e.target.value)}/>
                    <ListItemIcon onClick={()=>twitterApi.getTweet(input)}>
                        <ArrowForwardFilledIcon color={"secondary"} fontSize={"large"}/>
                    </ListItemIcon>
                </ListItem>
                <Box m={3}/><LinearProgress color={"secondary"} hidden={!twitterRequestLoading}/><Box m={3}/>
            </Grid>
            <div hidden={!twitterResultReceived}>
                <CloseResult onClick={() => {textInput.current.value = null; dispatch(twitterResetAction()); }}/>
                <Grid item spacing={2} container>
                    <Grid item xs={6}>
                        <Grid item xs={12}>
                            <Card align={"left"}>
                                <Typography className={classes.twitterHeading}>
                                    <InfoIcon className={classes.twitterIcon}/> {keyword("tweet_info_header")}
                                    <Divider variant={"middle"}/>
                                </Typography>
                                <Typography> {keyword("tweet_url")}: <a href={tweet.tweetUrl}> {tweet.tweetUrl} </a></Typography><Box m={1}/>
                                <Typography> {keyword("tweet_id")}: {tweet.tweetId}</Typography><Box m={1}/>
                                <Typography> {keyword("tweet_user")}: {tweet.tweetUser}</Typography><Box m={1}/>
                                <Typography> {keyword("tweet_hashtags")}: {tweet.tweetHashTags.toString()}</Typography><Box m={1}/>
                            </Card>
                        </Grid>
                        <Box m={3}/>
                        <Grid item xs={12}>
                            <Card>
                                <Typography className={classes.twitterHeading}>
                                    <ChatBubbleOutlineIcon className={classes.twitterIcon}/>
                                    {keyword("tweet_text_header")}
                                    <Divider variant={"middle"}/>
                                </Typography>
                                <Typography variant={"subtitle1"}>
                                    <FormatQuoteIcon fontSize={"large"}/>{tweet.tweetText}<Box m={2}/>
                                </Typography>
                            </Card>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Card align={"left"}>
                            <Typography className={classes.twitterHeading}>
                                <DuoIcon className={classes.twitterIcon}/>
                                {keyword("tweet_media_header")}
                                <Divider variant={"middle"}/>
                            </Typography>
                            {getMediaCard()}
                        </Card>
                    </Grid>
                </Grid>
            </div>
        </Grid>
    </Paper>

}

export default TwitterCard;