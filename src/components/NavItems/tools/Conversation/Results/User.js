import React, { Component } from "react";

import axios from "axios";

import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Paper from '@material-ui/core/Paper';

const processString = require('react-process-string');

const endpoint = process.env.REACT_APP_CONVERSATION_API

const config = [{
    regex: /\@([a-zA-Z0-9_]+)/gim, //regex to match a username
    fn: (key, result) => {
        let username = result[1];
        
        return <Link key={key} href={`https://twitter.com/${username}`} target="_blank">@{username}</Link>
    }
},
{
    regex: /\#([a-zA-Z0-9_]+)/gim, //regex to match a hashtag
    fn: (key, result) => {
        let hashtag = result[1];
        
        return <Link key={key} href={`https://twitter.com/hashtag/${hashtag}?f=live`} target="_blank">#{hashtag}</Link>
    }
},
{
    regex: /(http[^\s]+)/gim, //regex to match a URL
    fn: (key, result) => {
        let url = result[1];
        
        return <Link key={key} href={url} target="_blank">{url}</Link>
    }
}];

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
                description: processString(config)(this.props.user.description),
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
                location: this.props.user.location,
            })
        } else {
            axios.get(
                // TODO use our own endpoint so we can cache these in elastic for the right
                //      length of time and generate something similar for the deleted ones
                //      The only downside to that would be the loss of language options
                endpoint+"/user?screen_name="+this.props.screen_name
            )
            .then((response) => {
                
                // if we didn't hit an error then set the state with the relevant data
                this.setState({
                    name: response.data.name,
                    screen_name: response.data.screen_name,
                    img: response.data.profile_image_url_https.replace("_normal",""),
                    description: processString(config)(response.data.description),
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
                    location: response.data.location,
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

                <Typography variant="h5"><Link href={"https://twitter.com/"+this.state.screen_name} target="_blank">@{this.state.screen_name}</Link></Typography>

                <Typography variant="body1" paragraph>{this.state.description}</Typography>

                <Typography variant="body1" paragraph>Joined Twitter {this.state.account_age} days ago on the {this.state.created_at} and averages {this.state.tweets_per_day} tweets a day.</Typography>

                <Grid
            container
            direction="row"
            spacing={3}
            alignItems="flex-start">

                {this.state.location ?
                <Grid item xs={6}>
                    <Typography variant="body1">
                    <svg style={{paddingRight: "0.25em", height: "1.25em", verticalAlign:"text-bottom"}} viewBox="0 0 24 24"><g><path d="M12 14.315c-2.088 0-3.787-1.698-3.787-3.786S9.913 6.74 12 6.74s3.787 1.7 3.787 3.787-1.7 3.785-3.787 3.785zm0-6.073c-1.26 0-2.287 1.026-2.287 2.287S10.74 12.814 12 12.814s2.287-1.025 2.287-2.286S13.26 8.24 12 8.24z"></path><path d="M20.692 10.69C20.692 5.9 16.792 2 12 2s-8.692 3.9-8.692 8.69c0 1.902.603 3.708 1.743 5.223l.003-.002.007.015c1.628 2.07 6.278 5.757 6.475 5.912.138.11.302.163.465.163.163 0 .327-.053.465-.162.197-.155 4.847-3.84 6.475-5.912l.007-.014.002.002c1.14-1.516 1.742-3.32 1.742-5.223zM12 20.29c-1.224-.99-4.52-3.715-5.756-5.285-.94-1.25-1.436-2.742-1.436-4.312C4.808 6.727 8.035 3.5 12 3.5s7.192 3.226 7.192 7.19c0 1.57-.497 3.062-1.436 4.313-1.236 1.57-4.532 4.294-5.756 5.285z"></path></g></svg>
                        {this.state.location}</Typography>
                </Grid>
                : null }

                {this.state.url ?
                <Grid item xs={6}>
                    <Typography variant="body1">
                        <svg style={{paddingRight: "0.25em", height: "1.25em", verticalAlign:"text-bottom"}} viewBox="0 0 24 24"><g><path d="M11.96 14.945c-.067 0-.136-.01-.203-.027-1.13-.318-2.097-.986-2.795-1.932-.832-1.125-1.176-2.508-.968-3.893s.942-2.605 2.068-3.438l3.53-2.608c2.322-1.716 5.61-1.224 7.33 1.1.83 1.127 1.175 2.51.967 3.895s-.943 2.605-2.07 3.438l-1.48 1.094c-.333.246-.804.175-1.05-.158-.246-.334-.176-.804.158-1.05l1.48-1.095c.803-.592 1.327-1.463 1.476-2.45.148-.988-.098-1.975-.69-2.778-1.225-1.656-3.572-2.01-5.23-.784l-3.53 2.608c-.802.593-1.326 1.464-1.475 2.45-.15.99.097 1.975.69 2.778.498.675 1.187 1.15 1.992 1.377.4.114.633.528.52.928-.092.33-.394.547-.722.547z"></path><path d="M7.27 22.054c-1.61 0-3.197-.735-4.225-2.125-.832-1.127-1.176-2.51-.968-3.894s.943-2.605 2.07-3.438l1.478-1.094c.334-.245.805-.175 1.05.158s.177.804-.157 1.05l-1.48 1.095c-.803.593-1.326 1.464-1.475 2.45-.148.99.097 1.975.69 2.778 1.225 1.657 3.57 2.01 5.23.785l3.528-2.608c1.658-1.225 2.01-3.57.785-5.23-.498-.674-1.187-1.15-1.992-1.376-.4-.113-.633-.527-.52-.927.112-.4.528-.63.926-.522 1.13.318 2.096.986 2.794 1.932 1.717 2.324 1.224 5.612-1.1 7.33l-3.53 2.608c-.933.693-2.023 1.026-3.105 1.026z"></path></g></svg>
                        <Link href={this.state.url} target="_blank">Homepage</Link></Typography>
                </Grid>
                : null }

            </Grid>

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