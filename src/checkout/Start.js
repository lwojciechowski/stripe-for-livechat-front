import React, { useEffect } from "react";
import Loading from "../Loading";

const Start = ({ stripeRef, sessionId }) => {
  useEffect(() => {
    stripeRef.current.redirectToCheckout({
      sessionId: sessionId
    });
  }, [sessionId, stripeRef]);
  return <Loading />;
};

export default Start;
