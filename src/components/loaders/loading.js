import React from "react";
import "./loaders.scss";

const Loading = ({ loaded }) => (
  <div className={"loading-content " + (loaded ? "" : "hide-loader")}>
    <div className="loading-wrapper">
      <div className="loading" />
    </div>
  </div>
);

export default Loading;
