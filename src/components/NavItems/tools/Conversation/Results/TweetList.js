import React, { Component } from "react";
import { render } from "react-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import Tweet from "./Tweet"

const style = {
  padding: 8,
  marginBottom: 4,
};

class TweetList extends Component {
    constructor(props) {
        super(props);

        // set default values for the state
        this.state = {
            items: props.conversation.direct_replies,
            hasMore: props.conversation.direct_replies.length < props.conversation.number_of_replies,
        }
    }

  fetchMoreData = () => {
    
    if (this.state.items.length >= this.props.conversation.number_of_replies) {
        this.setState({
            hasMore: false
        })

        return
    }

    axios.get(
        // TODO use our own endpoint so we can cache these in elastic for the right
        //      length of time and generate something similar for the deleted ones
        //      The only downside to that would be the loss of language options
        "http://localhost:7000/conversation/scroll?id="+this.props.conversation.scroll_id
    )
    .then((response) => {
        // if we didn't hit an error then set the state with the relevant data
        this.setState({
            items: this.state.items.concat(response.data),
        })

        //TODO check what the response looks like for deleted tweet? is it an error code
        //     or a success but with a deleted message in the HTML
    }, (error) => {
        // for now just log the error to the console
        console.log(error);
    });
  };

  render() {
    return (
        <InfiniteScroll
          dataLength={this.state.items.length}
          next={this.fetchMoreData}
          hasMore={this.state.hasMore}
          loader={<h4>Loading...</h4>}
          height={500}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>That's all the replies, so far...</b>
            </p>
          }
        >
          {this.state.items.map((i, index) => (
              
            <div style={style} key={index}>
              <Tweet tweet={i}/>
            </div>
          ))}
        </InfiniteScroll>
    );
  }
}

export default TweetList