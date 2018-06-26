import React from "react";
import spinner from "./button-spinner.gif";

export default () => {
  return (
    <div>
      <img
        src={spinner}
        style={{
          width: "20px",
          margin: "auto",
          display: "inline-block"
        }}
        alt="Loading..."
      />
    </div>
  );
};
