import React, { Component } from "react";

import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Paper from '@material-ui/core/Paper';

class User extends Component {

    constructor(props) {
        super(props);

        // set default values for the state
        this.state = {
            // TODO is there anything we need to default to?
        }
    }

    componentDidMount() {

        
        /**{
            "friends_count":174,
            "profile_image_url_https":"https://pbs.twimg.com/profile_images/378800000651059744/75794617eb12b4938721fc8f3c7fdae6_normal.jpeg",
            "listed_count":13,
            "verified":false,
            "description":"always drinking coffee while @ work: #nlproc with @GateAcUk at @sheffielduni, @ home: lots including #arduino, #3dprinting",
            "created_at":"Tue Oct 22 17:56:03 +0000 2013",
            "url":"",
            "protected":false,
            "screen_name":"encoffeedrinker",
            "statuses_count":2088,
            "id_str":"2149467956",
            "followers_count":156,
            "name":"Mark A. Greenwood",
            "location":"Sheffield, UK"
        }**/
        
        this.setState({
            name: this.props.user.name,
            screen_name: this.props.user.screen_name,
            img: this.props.user.profile_image_url_https.replace("_normal",""),
            description: this.props.user.description,
            url: this.props.user.url,
            following: this.props.user.friends_count.toLocaleString(),
            followers: this.props.user.followers_count.toLocaleString(),
            tweets: this.props.user.statuses_count.toLocaleString(),
            lists: this.props.user.listed_count.toLocaleString(),
            created_at: this.props.user.created_at,
            account_age: this.props.user.account_age.toLocaleString(),
            tweets_per_day: this.props.user.tweets_per_day.toFixed(2)
        })
    }

    render() {

        return (
            <Paper style={{ padding: 10, marginTop: 10, marginBottom: 10}}>
            <Grid
            container
            direction="row"
            spacing={3}
            alignItems="flex-start">
            
            <Grid item xs={2}>
                <img style={{borderRadius: "50%"}} width="100%" src={this.state.img} alt=""/>
            </Grid>
            <Grid item xs={10}>
                <Typography variant="h3">{this.state.name}</Typography>

                <Typography variant="h5">@{this.state.screen_name}</Typography>

                <Typography variant="body1" paragraph="true">{this.state.description}</Typography>

                <Typography variant="body1" paragraph="true">Joined Twitter {this.state.account_age} days ago on the {this.state.created_at} and averages {this.state.tweets_per_day} tweets a day.</Typography>

                <Grid
            container
            direction="row"
            spacing={3}
            alignItems="flex-start">

                <Grid item xs={3}>
                <Typography variant="body1"><b>{this.state.following}</b> Following</Typography>
                </Grid>

                <Grid item xs={3}>
                <Typography variant="body1"><b>{this.state.followers}</b> Followers</Typography>
                </Grid>

                <Grid item xs={3}>
                <Typography variant="body1"><b>{this.state.tweets}</b> Tweets</Typography>
                </Grid>

                <Grid item xs={3}>
                <Typography variant="body1"><b>{this.state.lists}</b> Lists</Typography>
                </Grid>
            </Grid>
            </Grid>

            
                

                
            </Grid>
            </Paper>
        )
    }
}

export default User