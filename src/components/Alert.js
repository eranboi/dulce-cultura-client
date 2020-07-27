import React from "react";

const Alert = (props) => {
  return (
    <div className={`alert alert-${props.className} mt-3`} role="alert">
      {props.message}
    </div>
  );
};

export default Alert;
