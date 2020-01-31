import React from "react";

import "./App.css";
import Auth from "./Auth";
import LogInWithLiveChat from "./LoginWithLiveChat";
import Install from "./install";
import { Router } from "@reach/router";

const LC_CLIENT_ID = "457b5f43837982ca7b545c04441ae428";

function App() {
  return (
    <Auth
      clientId={LC_CLIENT_ID}
      signIn={authInstance => (
        <LogInWithLiveChat onClick={() => authInstance.openPopup()} />
      )}
    >
      <Router>
        <Install path="/install" exact />
      </Router>
    </Auth>
  );
}

export default App;
