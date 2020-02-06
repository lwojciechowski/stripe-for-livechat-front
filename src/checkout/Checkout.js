import React, { useEffect, useRef, useState } from "react";
import Start from "./Start";
import { Router } from "@reach/router";
import Loading from "../Loading";
import queryString from "query-string";
import createMomentsSDK from "@livechat/moments-sdk";
import Success from "./Success";
import Cancel from "./Cancel";
import Redirect from "./Redirect";

const STRIPE_PUBLIC_KEY = process.env.REACT_APP_STRIPE_PUBLIC_KEY;

const Checkout = ({ location }) => {
  const [loading, setLoading] = useState(true);
  const [queryParams] = useState(queryString.parse(location.search));
  const stripeRef = useRef(null);
  const momentsRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.onload = () => {
      stripeRef.current = window.Stripe(STRIPE_PUBLIC_KEY, {
        stripeAccount: queryParams.account_id
      });
      setLoading(false);
    };
    script.src = "https://js.stripe.com/v3/";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [queryParams.account_id]);

  useEffect(() => {
    (async () => {
      momentsRef.current = await createMomentsSDK({
        title: "Stripe for LiveChat"
      });
    })();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Router>
      <Start
        path="/start"
        stripeRef={stripeRef}
        sessionId={queryParams.session_id}
        accountId={queryParams.account_id}
        momentsRef={momentsRef}
      />

      <Redirect
        path="/redirect"
        stripeRef={stripeRef}
        sessionId={queryParams.session_id}
        accountId={queryParams.account_id}
      />
      <Success path="/success" sessionId={queryParams.session_id} />
      <Cancel path="/cancel" momentsRef={momentsRef} />
    </Router>
  );
};

export default Checkout;
