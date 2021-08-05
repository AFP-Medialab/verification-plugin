import React, { Component } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import Tweet from "./Tweet"

const style = {
  padding: 8,
  marginBottom: 4,
};

const endpoint = process.env.REACT_APP_CONVERSATION_API

class TweetList extends Component {
    constructor(props) {
        super(props);

        if (props.conversation) {
            // set default values for the state
            this.state = {
                items: props.conversation.direct_replies,
                hasMore: props.conversation.direct_replies.length < props.conversation.number_of_replies,
                scroll_id: props.conversation.scroll_id,
                total: this.props.conversation.number_of_replies
            }
        }
        else {
            console.log("no conversation so starting from an empty list")
            this.state = {
                items: [],
                hasMore: true
            }
            
            axios.get (
                endpoint+"/replies?screen_name="+this.props.screen_name+"&id_str="+this.props.id_str+"&stance="+this.props.stance
            )
            .then((response) => {
                this.setState({
                    items: response.data.replies,
                    total: response.data.total,
                    hasMore: response.data.replies.length < response.data.total,
                    scroll_id: response.data.scroll_id
                });
            }, (error) => {
                console.log(error)
            });
        }
    }

    fetchMoreData = () => {
        
        if (this.state.items.length >= this.state.total) {
            this.setState({
                hasMore: false
            })

            return
        }

        axios.get(
            endpoint+"/replies/scroll?id="+this.state.scroll_id
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
    }

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
                <Tweet tweet={i} viewTweet={this.props.viewTweet} />
                </div>
            ))}
            </InfiniteScroll>
        );
    }
}

export default TweetList