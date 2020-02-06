import React, { Suspense } from "react";

import "./App.css";

import { Router } from "@reach/router";
import Auth from "./Auth";
import LogInWithLiveChat from "./LoginWithLiveChat";
import Loading from "./Loading";

const Install = React.lazy(() => import("./install"));
const Details = React.lazy(() => import("./details"));
const Checkout = React.lazy(() => import("./checkout"));

const LC_CLIENT_ID = process.env.REACT_APP_LC_CLIENT_ID;

function App() {
  return (
    <Auth
      clientId={LC_CLIENT_ID}
      signIn={authInstanceRef => (
        <LogInWithLiveChat
          onClick={() => authInstanceRef.current.openPopup()}
        />
      )}
    >
      <Suspense fallback={<Loading />}>
        <Router>
          <Install exact path="install/*" />
          <Details exact path="details/*" />
          <Checkout exact path="checkout/*" />
        </Router>
      </Suspense>
    </Auth>
  );
}

export default App;
