import React from 'react'

class EdgeColor extends React.Component {
    constructor(props) {
        super(props)
        if(this.props.sigma) {
            let colors = {
                8: "#00ff00", //green for retweet
                9: "#ff0000", // red for reply
                10: "#ffff00", // yellow for mention
                11: "#7f00ff" // violet for quote
            }
            console.log("sigma nodes: ", this.props.sigma.graph.nodes());
            console.log("sigma edges: ", this.props.sigma.graph.edges());
            this.props.sigma.graph.edges().forEach(e => {
                if (e.attributes[8]) {
                    e.color = colors[8];
                }
                if (e.attributes[9]) {
                    e.color = colors[9];
                }
                if (e.attributes[10]) {
                    e.color = colors[10];
                }
            } )
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

export default EdgeColor;