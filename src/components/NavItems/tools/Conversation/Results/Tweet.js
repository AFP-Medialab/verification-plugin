import React, { Component } from "react";
import InnerHTML from 'dangerously-set-html-content'

class Tweet extends Component {

    constructor(props) {
        super(props);

        this.state = {
          html: props.tweet.html,
        };
    }

    componentDidMount() {
        console.log("componentDidMount()")
    }

    render() {

        return (
            <div>
                <InnerHTML html={this.state.html} />
            </div>
        )
    }
}

export default Tweet;