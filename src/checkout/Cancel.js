import React, { useEffect } from "react";
import Loading from "../Loading";

const Cancel = () => {
  useEffect(() => {
    window.addEventListener(
      "message",
      event => {
        if (
          event.source !== window &&
          event.origin === window.location.origin
        ) {
          event.source.postMessage(
            { status: "cancel" },
            window.location.origin
          );
        }
      },
      false
    );
  });
  return <Loading />;
};

export default Cancel;
