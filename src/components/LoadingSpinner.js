import React from "react";
import ReactDOM from "react-dom";

const LoadingSpinner = () => {
  return ReactDOM.createPortal(
    <>
      <div class="ui active dimmer">
        <div class="ui indeterminate text loader">Loading</div>
      </div>
      <p></p>
    </>,
    document.getElementById("modal")
  );
};

export default LoadingSpinner;
