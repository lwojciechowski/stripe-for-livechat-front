import React, { useEffect } from "react";
import Loading from "../Loading";

const Redirect = ({ stripeRef, sessionId }) => {
  useEffect(() => {
    stripeRef.current.redirectToCheckout({
      sessionId: sessionId
    });
  }, [sessionId, stripeRef]);
  return <Loading />;
};

export default Redirect;
