import React, { useCallback, useEffect } from "react";
import Loading from "../Loading";
import { Button } from "@livechat/design-system";

const Start = ({ stripeRef, sessionId, accountId }) => {
  const handleClick = useCallback(() => {
    console.log("ok");
    window.open(
      `https://stripe-for-livechat.netlify.com/checkout/redirect?session_id=${sessionId}&account_id=${accountId}`,
      "stripe-for-livechat",
      "directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=1024,height=768"
    );
  }, [sessionId, stripeRef]);
  return <Button onClick={handleClick}>Start checkout</Button>;
};

export default Start;
