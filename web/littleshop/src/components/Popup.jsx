import React from "react";
import "../style/Popup.css";

const Popup = (props) => {
  return props.trigger ? (
    <div className="popup-container">
      <div className="popup-inner">
        <h1>{props.title}</h1>
        <h3>{props.value}</h3>
      </div>
    </div>
  ) : (
    ""
  );
};
export default Popup;
