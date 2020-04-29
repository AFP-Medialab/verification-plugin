import React from 'react'

class RefreshGraph extends React.Component {
  constructor(props) {
      super(props);
      this.state = { refreshed: false };
  }
    
  componentDidMount() {
    this._refreshGraph(this.props.graph);
  }
    
  componentWillReceiveProps(props) {
    if (props.graph !== this.props.sigma.graph) {
      this.setState({ refreshed: false });
      this._refreshGraph(props.graph);
    }
  }
    
  embedProps(elements, extraProps) {
    let el = React.Children.map(elements, element =>
      React.cloneElement(element, extraProps)
    );
    console.log("returning: ", el[0].props.sigma.graph.nodes());
    return React.Children.map(elements, element =>
      React.cloneElement(element, extraProps)
    );
  }
    
  render() {
    if (!this.state.refreshed) {
      return null;
    }
    return <div>{ this.embedProps(this.props.children, {sigma: this.props.sigma}) }</div>;
  }
    
  _refreshGraph(graph) {
    if (
      graph &&
      graph !== undefined &&
      this.props.sigma !== undefined
    ) {
      this.props.sigma.graph.clear();
      this.props.sigma.graph.read(graph);
      this.props.sigma.refresh();
    }
    this.setState({ refreshed: true });
  }
}
	
export default RefreshGraph;