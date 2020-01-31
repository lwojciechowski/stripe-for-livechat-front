import React, { useEffect, useState, useRef } from "react";
import { accountsSdk } from "@livechat/accounts-sdk";
import { Loader } from "@livechat/design-system";

const Auth = ({ children, signIn, clientId }) => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(null);
  const authInstance = useRef(null);

  useEffect(() => {
    authInstance.current = accountsSdk.init({
      client_id: clientId,
      onIdentityFetched: (error, data) => {
        setLoading(false);
        if (data) {
          console.log(data);
          setAuth(data);
        }
        if (error) {
          console.error(error);
        }
      }
    });
  }, [clientId]);

  if (loading) {
    return (
      <div>
        <Loader size="large" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={auth}>
      {auth !== null ? children : signIn(authInstance)}
    </AuthContext.Provider>
  );
};

export const AuthContext = React.createContext(null);

export default Auth;
