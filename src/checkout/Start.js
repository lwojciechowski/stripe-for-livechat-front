/** @jsxImportSource @emotion/core */

import { useCallback, useEffect, useRef, useState } from "react";
import { css } from "@emotion/core";
import { Button } from "@livechat/design-system";
import Loading from "../Loading";
import createMomentsSDK from "@livechat/moments-sdk";

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
    margin-top: 80px;
  }
`;

const Start = ({ stripeRef, sessionId, accountId }) => {
  const [loading, setLoading] = useState(false);
  const momentsRef = useRef(null);

  useEffect(() => {
    (async () => {
      momentsRef.current = await createMomentsSDK({
        title: "Stripe for LiveChat"
      });
    })();
  }, []);

  const handleClick = useCallback(() => {
    setLoading(true);
    const child = window.open(
      `/checkout/redirect?session_id=${sessionId}&account_id=${accountId}`,
      "stripe-for-livechat",
      "directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=1024,height=768"
    );

    let leftDomain = false;
    const i = setInterval(() => {
      try {
        if (leftDomain && child.document.domain === document.domain) {
          child.postMessage("ping", window.location.origin);
        } else {
          leftDomain = true;
        }
      } catch (e) {
        if (child.closed) {
          clearInterval(i);
          momentsRef.current.sendSystemMessage({
            text: "Payment canceled or failed.",
            recipients: "all"
          });
          momentsRef.current.close();
          return;
        }
        leftDomain = true;
      }
    }, 500);

    window.addEventListener(
      "message",
      event => {
        if (event.source !== child || event.origin !== window.location.origin) {
          return;
        }
        switch (event.data.status) {
          case "success":
            child.close();
            momentsRef.current.sendSystemMessage({
              text: "Payment completed successfully.",
              recipients: "all"
            });
            momentsRef.current.close();
            clearInterval(i);
            break;
          case "cancel":
            child.close();
            momentsRef.current.sendSystemMessage({
              text: "Payment canceled or failed.",
              recipients: "all"
            });
            momentsRef.current.close();
            clearInterval(i);
            break;
          default:
            break;
        }
      },
      false
    );
  }, [sessionId, accountId]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div css={containerCss}>
      <Button primary size="large" onClick={handleClick}>
        Proceed to checkout
      </Button>
      <img src={poweredByStripeImg} alt="Powered by Stripe" />
    </div>
  );
};

export default Start;
