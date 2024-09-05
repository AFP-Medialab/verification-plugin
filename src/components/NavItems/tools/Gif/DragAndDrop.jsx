import React, { Component } from "react";
import { Grid2 } from "@mui/material";

class DragAndDrop extends Component {
  state = {
    drag: false,
  };

  dragCounter = 0;

  dropRef = React.createRef();
  handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.dragCounter++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      this.setState({ drag: true });
    }
  };
  handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.dragCounter--;
    if (this.dragCounter === 0) {
      this.setState({ drag: false });
    }
  };
  handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ drag: false });
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      this.props.handleDrop(e.dataTransfer.files);
      e.dataTransfer.clearData();
      this.dragCounter = 0;
    }
  };

  componentDidMount() {
    let div = this.dropRef.current;
    div.addEventListener("dragenter", this.handleDragIn);
    div.addEventListener("dragleave", this.handleDragOut);
    div.addEventListener("dragover", this.handleDrag);
    div.addEventListener("drop", this.handleDrop);
  }

  componentWillUnmount() {
    let div = this.dropRef.current;
    div.removeEventListener("dragenter", this.handleDragIn);
    div.removeEventListener("dragleave", this.handleDragOut);
    div.removeEventListener("dragover", this.handleDrag);
    div.removeEventListener("drop", this.handleDrop);
  }

  render() {
    return (
      <div
        style={{
          display: "inline-block",
          position: "relative",
          width: "100%",
        }}
        ref={this.dropRef}
      >
        {this.state.drag && (
          <Grid2
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{
              border: "dashed #00926c 2px",
              backgroundColor: "rgba(255,255,255,.8)",
              borderRadius: "25px",
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 9999,
            }}
          >
            <Grid2
              style={{
                textAlign: "center",
                color: "grey",
                fontSize: 18,
              }}
            >
              <div>Drop the image here</div>
            </Grid2>
          </Grid2>
        )}
        {this.props.children}
      </div>
    );
  }
}

export default DragAndDrop;
