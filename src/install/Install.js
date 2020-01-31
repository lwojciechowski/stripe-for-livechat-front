import React from "react";
import ConnectWithStripe from "./ConnectWithStripe";

const STRIPE_CLIENT_ID = "ca_GdSaQGaBdnKTQiBh0f906tM21cBZVqtH";

const Install = () => {
  return (
    <ConnectWithStripe
      href={`https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${STRIPE_CLIENT_ID}&scope=read_write`}
    />
  );
};

export default Install;
