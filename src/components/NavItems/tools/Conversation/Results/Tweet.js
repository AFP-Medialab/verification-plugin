import React, { Component } from "react";
import InnerHTML from 'dangerously-set-html-content'
import axios from "axios";

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
                html: response.data.html
            })

            //TODO check what the response looks like for deleted tweet? is it an error code
            //     or a success but with a deleted message in the HTML
        }, (error) => {
            // for now just log the error to the console
            console.log(error);
        });
    }

    render() {
        return (
            <InnerHTML html={this.state.html} />
        )
    }
}

export default Tweet;