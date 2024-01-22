/**@jsx jsx*/

import "./App.css";

import React, { Suspense } from "react";
import { Router } from "@reach/router";
import { jsx } from "@emotion/core";
import Auth from "./Auth.js";
import Loading from "./Loading.js";

const Install = React.lazy(() => import("./install/index.js"));
const Details = React.lazy(() => import("./details/index.js"));
const Checkout = React.lazy(() => import("./checkout/index.js"));
const Tutorial = React.lazy(() => import("./Tutorial.js"));

const ProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Auth>
      <Component {...rest} />
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
        <Tutorial exact path="tutorial" />
      </Router>
    </Suspense>
  );
}

export default App;
