/**@jsx jsx */
import { useCallback, useState } from "react";
import { css, jsx } from "@emotion/core";
import { Button } from "@livechat/design-system";
import Loading from "../Loading";

const poweredByStripeImg = require("./powered_by_stripe.svg");

const containerCss = css`
  display: flex;
  flex-direction: column;
  align-items: center;

  button {
    margin-top: 50px;
    width: 250px;
  }
  img {
    flex: 0;
    margin-top: 50px;
  }
`;

const Start = ({ stripeRef, sessionId, accountId, momentsRef }) => {
  const [loading, setLoading] = useState(false);
  const handleClick = useCallback(() => {
    const target = window.open(
      `https://stripe-for-livechat.netlify.com/checkout/redirect?session_id=${sessionId}&account_id=${accountId}`,
      "stripe-for-livechat",
      "directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=1024,height=768"
    );

    target.addEventListener(
      "message",
      event => {
        switch (event.data.status) {
          case "success":
            target.close();
            momentsRef.current.sendSystemMessage({
              text: "Customer completed payment successfully.",
              recipients: "agents"
            });
            momentsRef.close();
            break;
          case "cancel":
            target.close();
            momentsRef.current.sendSystemMessage({
              text: "Customer canceled or payment failed.",
              recipients: "agents"
            });
            momentsRef.close();
            break;
        }
      },
      false
    );
  }, [sessionId, stripeRef]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div css={containerCss}>
      <Button primary size="large" onClick={handleClick}>
        Start checkout
      </Button>
      <img src={poweredByStripeImg} alt="Powered by Stripe" />
    </div>
  );
};

export default Start;
