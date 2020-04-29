import React from "react";
import {useDispatch, useSelector} from "react-redux";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import {Paper} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import Typography from "@material-ui/core/Typography";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";

import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/Twitter.tsv";
import LinearProgress from "@material-ui/core/LinearProgress";
import useTwint from "./useTwint";
import AuthenticationCard from "../../../../Shared/Authentication/AuthenticationCard";

const TwitterCard = (props) => {

    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/Twitter.tsv", tsv);

    const twitterUrl = props["url"];
    const tweet = useSelector(state => state.twitter.tweet);
    const tweetMediaUrl = useSelector(state => state.twitter.mediaUrl);
    const loading = useSelector(state => state.twitter.loading);
    const loadingMessage = useSelector(state => state.twitter.loadingMessage);

    useTwint().runTwintQuery(twitterUrl);

    return (
        <Paper className={classes.root}>
            <AuthenticationCard/>
            <Typography>{loadingMessage}</Typography>
            <LinearProgress hidden={!loading} />
            <Box m={3}/>
            { (tweet != "") ?
                <Grid container spacing={2}>
                    <Grid item xs = {6}>
                        <Card variant = "outlined">
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                    {keyword("twitter_card_header")}
                                </Typography>
                                <Typography className={classes.title} color="primary">
                                    {twitterUrl}
                                </Typography>
                                <Typography variant="h5" component="h2">
                                    {tweet}
                                </Typography>
                            </CardContent>
                            {/*<CardMedia>*/}
                            {/*    <img src={tweetMediaUrl} height={"100%"} width={"100%"}/>*/}
                            {/*</CardMedia>*/}
                        </Card>
                    </Grid>
                    <Grid  item xs = {6}>
                        <Card variant = "outlined">
                            <Box m = {2} >
                                <Typography variant="h5" component="h2">
                                    {keyword("things_you_can_do_header")}
                                </Typography>
                                <Typography className={classes.title} color="primary">
                                    {keyword("things_you_can_do")}
                                </Typography>
                                <Box m={3}/>
                                <Grid container spacing={2}>
                                    <Grid container m = {4}>
                                        <Card className={classes.assistantCards}  variant = "outlined"
                                              onClick={() => window.open("www.bbc.co.uk") }>
                                            <CardActionArea><CardContent>
                                                <Typography className={classes.title} m={2}>{keyword("reverse_google")}</Typography>
                                                <Button aria-colspan={2} size = "medium">
                                                    <SearchIcon fontSize = "large"/> {keyword("reverse_google_title")}
                                                </Button>
                                            </CardContent></CardActionArea>
                                        </Card>
                                        <Card className={classes.assistantCards}  variant = "outlined"
                                              onClick={() => window.open("www.bbc.co.uk") }>
                                            <CardActionArea><CardContent>
                                                <Typography className={classes.title} m={2}>{keyword("dbkn")}</Typography>
                                                <Button aria-colspan={2} size = "medium">
                                                    <SearchIcon fontSize = "large"/>{keyword("dbkn_title")}
                                                </Button>
                                            </CardContent></CardActionArea>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>  : null }
        </Paper>
    )

}

export default TwitterCard;