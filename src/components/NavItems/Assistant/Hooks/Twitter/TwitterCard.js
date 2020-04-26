import React, {useState} from "react";
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

import {gql} from "apollo-boost";
import ApolloClient from 'apollo-boost';

import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/Twitter.tsv";
import LinearProgress from "@material-ui/core/LinearProgress";
import useTwint from "./useTwint";
import AuthenticationCard from "../../../../Shared/Authentication/AuthenticationCard";

const TwitterCard = (props) => {

    const client = new ApolloClient({
        uri: 'http://weverify-demo.ontotext.com/platform/graphql',
    });
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/Twitter.tsv", tsv);

    const twitterUrl = props["url"];
    const tweet = useSelector(state => state.twitter.tweet);
    const tweetTag = useSelector(state => state.twitter.tag);
    const loading = useSelector(state => state.twitter.loading);
    const loadingMessage = useSelector(state => state.twitter.loadingMessage);

    const [dbPressed, setDbPressed] = useState(false);
    const [dbResult, setResult] = useState([]);

    useTwint().runTwintQuery(twitterUrl);

    const dbPress = () => {

        const inputForGpl = tweetTag.substring(1);
        //const inputForGpl = "covid";
        setDbPressed(true);
        const query = gql`
              query claim($name: String) {
                  claim(where: {AND: [{name: {IRE: $name}}, {dateCreated: {GT: "2020-01-01T00:00:00"}}]}) {
                    id
                    name
                    dateCreated
                    review {
                      dateCreated
                      reviewBody 
                    }
                    appearance{
                      url
                    }
                  }
                }`;

            client.query({
                query: query,
                variables:{name: inputForGpl}
            }).then(result => {
                    let claims = result.data.claim;
                    let claimedList = claims.map(claim => {
                        return [claim.name, claim.appearance[0] == null ? "" : claim.appearance[0].url ]
                    });
                        console.log(claimedList);
                        setResult(claimedList.slice(0,4))}
                    );
        };


    return <Paper className={classes.root}>
        <AuthenticationCard/>
        <Typography>{loadingMessage}</Typography>
        <LinearProgress hidden={!loading} />
        <Box m={3}/>
        { tweet != "" ?
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
                                    <Card className={classes.assistantCards}  variant = "outlined">
                                        <CardActionArea><CardContent>
                                            <Typography className={classes.title} m={2}>{keyword("reverse_google")}</Typography>
                                            <Button aria-colspan={2} size = "medium">
                                                <SearchIcon fontSize = "large"/> {keyword("reverse_google_title")}
                                            </Button>
                                        </CardContent></CardActionArea>
                                    </Card>
                                    <Card className={classes.assistantCards}  variant = "outlined"
                                          onClick={() => dbPress()}>
                                        <CardActionArea><CardContent>
                                            <Typography className={classes.title} m={2}>{keyword("dbkn")}</Typography>
                                            <Button aria-colspan={2} size = "medium" onClick={dbPress}>
                                                <SearchIcon fontSize = "large"/>{keyword("dbkn_title")}
                                            </Button>
                                        </CardContent></CardActionArea>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    </Card>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs = {12} >
                        <Card variant = "outlined" hidden = {!dbPressed}>
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                    Appearances in the DBKF
                                </Typography>
                                <Typography className={classes.title} color="primary">
                                    Claims made and debunked concerning topics in this tweet have been listed. Search carried out against topic: {tweetTag}
                                </Typography>
                                <Typography align={"left"} aria-rowspan={1}>
                                    {dbResult.map((claim) =>
                                        <Typography>
                                            <li>{claim[0]} <a href = {claim[1]}>{claim[1]}</a></li>
                                        </Typography>)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
            : null }
    </Paper>

}

export default TwitterCard;