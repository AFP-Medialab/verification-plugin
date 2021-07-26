import React, { Component } from "react";

import axios from "axios";

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

        if (this.props.user) {
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
                tweets_per_day: this.props.user.tweets_per_day.toFixed(2),
                verified: this.props.user.verified,
                protected: this.props.user.protected,
            })
        } else {
            axios.get(
                // TODO use our own endpoint so we can cache these in elastic for the right
                //      length of time and generate something similar for the deleted ones
                //      The only downside to that would be the loss of language options
                "http://localhost:7000/user?screen_name="+this.props.screen_name
            )
            .then((response) => {
                
                // if we didn't hit an error then set the state with the relevant data
                this.setState({
                    name: response.data.name,
                    screen_name: response.data.screen_name,
                    img: response.data.profile_image_url_https.replace("_normal",""),
                    description: response.data.description,
                    url: response.data.url,
                    following: response.data.friends_count.toLocaleString(),
                    followers: response.data.followers_count.toLocaleString(),
                    tweets: response.data.statuses_count.toLocaleString(),
                    lists: response.data.listed_count.toLocaleString(),
                    created_at: response.data.created_at,
                    account_age: response.data.account_age.toLocaleString(),
                    tweets_per_day: response.data.tweets_per_day.toFixed(2),
                    verified: response.data.verified,
                    protected: response.data.protected,
                })
    
                //TODO check what the response looks like for deleted tweet? is it an error code
                //     or a success but with a deleted message in the HTML
            }, (error) => {
                // for now just log the error to the console
                console.log(error);
    
                // and show the raw tweet text with little or no styling. This will be less of
                // an issue once we move the retrieval into the backend, see the TODO above
                this.setState({
                    name: "unknown user",
                })
            });
        }
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
                <Typography variant="h3">
                    {this.state.name}
                    {this.state.verified ? <svg style={{paddingLeft: "0.25em", height: "1.25em", verticalAlign:"text-bottom"}} viewBox="0 0 24 24"><g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" style={{fill:"#1da1f2", fillOpacity:1}} /></g></svg> : null }
                    {this.state.protected ? <svg style={{paddingLeft: "0.25em", height: "1.25em", verticalAlign:"text-bottom"}} viewBox="0 0 24 24"><g><path d="M19.75 7.31h-1.88c-.19-3.08-2.746-5.526-5.87-5.526S6.32 4.232 6.13 7.31H4.25C3.01 7.31 2 8.317 2 9.56v10.23c0 1.24 1.01 2.25 2.25 2.25h15.5c1.24 0 2.25-1.01 2.25-2.25V9.56c0-1.242-1.01-2.25-2.25-2.25zm-7 8.377v1.396c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-1.396c-.764-.3-1.307-1.04-1.307-1.91 0-1.137.92-2.058 2.057-2.058 1.136 0 2.057.92 2.057 2.056 0 .87-.543 1.61-1.307 1.91zM7.648 7.31C7.838 5.06 9.705 3.284 12 3.284s4.163 1.777 4.352 4.023H7.648z"></path></g></svg> : null }
                </Typography>

                <Typography variant="h5">@{this.state.screen_name}</Typography>

                <Typography variant="body1" paragraph>{this.state.description}</Typography>

                <Typography variant="body1" paragraph>Joined Twitter {this.state.account_age} days ago on the {this.state.created_at} and averages {this.state.tweets_per_day} tweets a day.</Typography>

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