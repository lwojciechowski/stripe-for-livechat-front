import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import AccountsSDK from "@livechat/accounts-sdk";
import Loading from "./Loading";

const LC_CLIENT_ID = process.env.REACT_APP_LC_CLIENT_ID;

const getToken = () => {
  try {
    const entry = JSON.parse(window.localStorage.getItem("auth"));
    if (!entry.auth.scopes) {
      return null;
    }

    if (Date.now() / 1000 > entry.expire) {
      localStorage.removeItem("auth");
      return null;
    }

    return entry.auth;
  } catch (e) {
    return null;
  }
};

const setToken = (data) => {
  try {
    window.localStorage.setItem(
      "auth",
      JSON.stringify({
        auth: data,
        expire: Date.now() / 1000 + data.expires_in - 60 * 5,
      })
    );
  } catch (e) {}
};

const clearToken = () => {
  try {
    window.localStorage.removeItem("auth");
  } catch (e) {}
};

const Auth = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const sdkRef = useRef(
    new AccountsSDK({
      client_id: LC_CLIENT_ID,
    })
  );

  useEffect(() => {
    (async () => {
      if (!!auth) {
        return;
      }
      const authorizeData = getToken();
      if (authorizeData) {
        setAuth(authorizeData);
        return;
      }

      const redirect = sdkRef.current.redirect();
      try {
        const authorizeData = await redirect.authorizeData();
        authorizeData.scopes = authorizeData.scope.split(",");

        setToken(authorizeData);
        setAuth(authorizeData);
      } catch (e) {
        redirect.authorize();
      }
    })();
  }, [auth]);

  const contextVal = useMemo(
    () => ({
      ...auth,
      clear: () => {
        setAuth(null);
        clearToken();
      },
    }),
    [auth]
  );

  if (!auth) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={contextVal}>
      {auth !== null ? children : null}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
export const AuthContext = React.createContext(null);
export default Auth;
