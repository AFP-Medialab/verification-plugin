import React from 'react';
import _ from 'lodash';

class NodeColor extends React.Component {
    constructor(props) {
        super(props)
        if(this.props.sigma) {
            let colors = {
                8: "#00ff00", //green for retweet
                9: "#ff0000", // red for reply
                10: "#ffff00", // yellow for mention
                11: "#7f00ff" // violet for quote
            }

            let retweetArr = [];
            let replyArr = [];
            let mentionArr = [];
            let quoteArr = [];
            this.props.sigma.graph.edges().forEach(e => {
                if (e.attributes[8]) {
                    retweetArr.push(e.target);
                }
                if (e.attributes[9]) {
                    replyArr.push(e.target);
                }
                if (e.attributes[10]) {
                    mentionArr.push(e.target);
                }
                if (e.attributes[11]) {
                    quoteArr.push(e.target);
                }
            });

            let retweetObj = _.countBy(retweetArr);
            let replyObj = _.countBy(replyArr);
            let mentionObj = _.countBy(mentionArr);
            let quoteObj = _.countBy(quoteArr);

            this.props.sigma.graph.nodes().forEach(node => {
                if (retweetObj[node.id] && (retweetObj[node.id]/this.props.sigma.graph.degree(node.id) > 0.5)) {
                    node.color = colors[8];
                }
                if (replyObj[node.id] && (replyObj[node.id]/this.props.sigma.graph.degree(node.id) > 0.5)) {
                    node.color = colors[9];
                }
                if (mentionObj[node.id] && (mentionObj[node.id]/this.props.sigma.graph.degree(node.id) > 0.5)) {
                    node.color = colors[10];
                }
                if (quoteObj[node.id] && (quoteObj[node.id]/this.props.sigma.graph.degree(node.id) > 0.5)) {
                    node.color = colors[11];
                }
            });

        }
        if(this.props.sigma) this.props.sigma.refresh()
    }

    componentDidMount() {
        if(this.props.sigma) this.props.sigma.refresh()
    }

    embedProps(elements, extraProps) {
        return React.Children.map(elements, element =>
          React.cloneElement(element, extraProps)
        );
      }

    render() {
        return <div>{ this.embedProps(this.props.children, {sigma: this.props.sigma}) }</div>
    }
}

export default NodeColor;