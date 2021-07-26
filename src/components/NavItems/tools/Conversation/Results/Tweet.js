import React, { Component, useState } from "react";
import InnerHTML from 'dangerously-set-html-content'
import axios from "axios";
import { Button } from "@material-ui/core";

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
                html: response.data.html,
                plain: plain,
                color: color,
                id: tweet.id,
            })

            //TODO check what the response looks like for deleted tweet? is it an error code
            //     or a success but with a deleted message in the HTML
        }, (error) => {
            // for now just log the error to the console
            console.log(error);

            // and show the raw tweet text with little or no styling. This will be less of
            // an issue once we move the retrieval into the backend, see the TODO above
            this.setState({
                html: tweet.text,
                plain: plain,
                color: color,
                id: tweet.id
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
                <InnerHTML html={this.state.html} />
                <Button size="small" style={{color: "white"}} onClick={() => this.props.viewTweet(this.state.id)}>Switch To...</Button>
            </div>
        )
    }
}

export default Tweet;