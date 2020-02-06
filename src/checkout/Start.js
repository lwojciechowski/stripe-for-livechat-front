import React, { useEffect } from "react";
import Loading from "../Loading";

const Start = ({ stripeRef, sessionId, accountId }) => {
  useEffect(() => {
    console.log("ok");
    window.open(
      `https://stripe-for-livechat.netlify.com/checkout/redirect?session_id=${sessionId}&account_id=${accountId}`,
      "stripe-for-livechat",
      "directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=1024,height=768"
    );
  }, [sessionId, stripeRef]);
  return <Loading />;
};

export default Start;
