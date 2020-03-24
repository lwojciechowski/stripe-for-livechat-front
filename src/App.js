/**@jsx jsx*/

import "./App.css";

import React, { Suspense } from "react";
import { Router } from "@reach/router";
import { css, jsx } from "@emotion/core";
import Auth from "./Auth";
import LogInWithLiveChat from "./LoginWithLiveChat";
import Loading from "./Loading";

const Install = React.lazy(() => import("./install"));
const Details = React.lazy(() => import("./details"));
const Checkout = React.lazy(() => import("./checkout"));

const LC_CLIENT_ID = process.env.REACT_APP_LC_CLIENT_ID;

const fullscreenCss = css`
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProtectedRoute = ({ component: Component }) => {
  return (
    <Auth
      clientId={LC_CLIENT_ID}
      signIn={authInstanceRef => (
        <div css={fullscreenCss}>
          <LogInWithLiveChat
            onClick={() => authInstanceRef.current.openPopup()}
          />
        </div>
      )}
    >
      <Component />
    </Auth>
  );
};

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Router>
        <ProtectedRoute component={Install} exact path="install/*" />
        <ProtectedRoute component={Details} exact path="details/*" />
        <Checkout exact path="checkout/*" />
      </Router>
    </Suspense>
  );
}

export default App;
