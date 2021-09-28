import React, { Component } from "react";
import InnerHTML from 'dangerously-set-html-content'
import axios from "axios";
import { Button } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

class Tweet extends Component {

    constructor(props) {
        super(props);

        // set default values for the state
        this.state = {
            // TODO is there anything we need to default to?
        }
    }

    componentDidMount() {

        // unpack stuff from the props to make code easier to read
        const tweet = this.props.tweet

        const lang = this.props.lang || "en"

        const plain = this.props.plain || false

        // assume it's a comment
        var color = "rgb(31, 119, 180)";
        
        if (tweet.stance_parent === "query")
		    color = "rgb(255, 127, 14)";
		else if (tweet.stance_parent === "support")
            color = "rgb(44, 160, 44)";
		else if (tweet.stance_parent === "deny")
            color = "rgb(214, 39, 40)";

        // TODO put all the styles into a map in the state to make the HTML easier

        // get the data from twitter
        axios.get(
            // TODO use our own endpoint so we can cache these in elastic for the right
            //      length of time and generate something similar for the deleted ones
            //      The only downside to that would be the loss of language options
            "https://publish.twitter.com/oembed?align=center&hide_thread=true&dnt=true&lang="+lang+"&url="+encodeURIComponent("https://twitter.com/"+tweet.user.screen_name+"/status/"+tweet.id)
        )
        .then((response) => {

            // if we didn't hit an error then set the state with the relevant data
            this.setState({
                html: "<div style='background: white; border-radius: 12px'>"+response.data.html+"</div>",
                plain: plain,
                color: color,
                id: tweet.id,
                error: false
            })

            // Rather annoyingly it seems that this endpoint returns the bare HTML even for
            // tweets which have been deleted. The 404 only occurs when the embedded Javascript
            // runs and the styling fails. For now we add a white background just to ensure
            // that the tweet is readable, but we need to think of a better way of handling these.
            // Possibly a scheduled event on the server that validates each Tweet/User to check
            // if they still exist.
        })
        .catch((error) => {
            // for now just log the error to the console
            console.log(error.response);

            // and show the raw tweet text pulled from elasticsearch. Note that this code
            // doesn't seem to run for deleted tweets, so is mainly likely to occur for
            // other network issues. In otherwords if this code runs we probably have bigger
            // problems to worry about!
            this.setState({
                html: "<div style='background: rgb(247, 249, 249); color: rgb(83, 100, 113); border: 1px solid rgb(239, 243, 244); margin: 10px auto; padding: 12px; border-radius: 12px'>"+error.response.data.error+"</div>",
                plain: plain,
                color: color,
                id: tweet.id,
                error: true
            })
        });
    }

    render() {

        if (this.state.plain)  {
            return (
                <InnerHTML html={this.state.html} />
            )
        }

        return (
            <div style={{background: this.state.color, padding: 6, borderRadius: "12px"}}>
                <Typography align="right" style={{color: "white"}}>{this.props.keyword("stance_"+this.props.tweet.stance_parent)}</Typography>
                <InnerHTML html={this.state.html} />
                <Button size="small" style={{color: "white"}} onClick={() => this.props.viewTweet(this.state.id)}>{this.props.keyword("button_explore_tweet")}</Button>
            </div>
        )
    }
}

export default Tweet;