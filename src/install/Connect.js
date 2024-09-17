/** @jsxImportSource @emotion/core */

import { css } from "@emotion/core";
import ConnectWithStripe from "./ConnectWithStripe";

const STRIPE_CLIENT_ID = process.env.REACT_APP_STRIPE_CLIENT_ID;

const containerCss = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2em;

  strong {
    font-size: 1.1em;
  }

  a {
    margin-top: 1em;
  }
`;

const Connected = () => {
  return (
    <div css={containerCss}>
      <h2>Connect to Stripe</h2>
      <p>
        In order to use this integration, you need to connect to your Stripe
        account.
      </p>
      <div>
        <ConnectWithStripe
          href={`https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${STRIPE_CLIENT_ID}&scope=read_write`}
          target="_blank"
        />
      </div>
    </div>
  );
};

export default Connected;
