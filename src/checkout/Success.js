import React, { useEffect } from "react";
import Loading from "../Loading";

const Success = () => {
  useEffect(() => {
    window.addEventListener(
      "message",
      event => {
        if (
          event.source !== window &&
          event.origin === window.location.origin
        ) {
          event.source.postMessage(
            { status: "success" },
            window.location.origin
          );
        }
      },
      false
    );
  }, []);
  return <Loading />;
};

export default Success;
