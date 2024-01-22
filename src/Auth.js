import React, { useEffect, useState } from "react";
import AccountsSDK from "@livechat/accounts-sdk";

const LC_CLIENT_ID = process.env.REACT_APP_LC_CLIENT_ID;
const sdk = new AccountsSDK({
  client_id: LC_CLIENT_ID,
});

const Auth = ({ children }) => {
  const [auth, setAuth] = useState(null);
  useEffect(() => {
    sdk
      .redirect()
      .authorizeData()
      .then((data) => {
        authRef.token = data.access_token;
        authRef.scopes = data.scope.split(",");
        setAuth(data);
      })
      .catch((e) => {
        console.error(e);
        if (e.identity_exception === "unauthorized") {
          sdk.redirect().authorize();
        }
      });
  }, []);

  return (
    <AuthContext.Provider value={auth}>
      {auth !== null ? children : null}
    </AuthContext.Provider>
  );
};

export const AuthContext = React.createContext(null);
export default Auth;
export const authRef = {
  token: null,
  scopes: [],
};
