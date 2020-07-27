import React, { Component } from "react";
import ReactDOM from "react-dom";

class Modal extends Component {
  render() {
    return ReactDOM.createPortal(
      <div
        className="ui dimmer modals visible active"
        style={{ display: "flex !important" }}
        onClick={this.props.onOutsideClick}
      >
        <div
          class="ui standard  modal visible active"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {this.props.children}
        </div>
      </div>,
      document.getElementById("modal")
    );
  }
}

export default Modal;
