import React, { useEffect, useState } from "react";
import queryString from "query-string";
import { navigate, Router } from "@reach/router";
import {
  createInstallation,
  deleteInstallation,
  getInstallation
} from "../api";
import Loading from "../Loading";
import Connected from "./Connected";
import Connect from "./Connect";

const Install = ({ location }) => {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [queryParams] = useState(queryString.parse(location.search));

  useEffect(() => {
    (async () => {
      if (queryParams.code) {
        await createInstallation(queryParams.code);
      }

      try {
        const resp = await getInstallation();
        setAccount(resp.data);
        await navigate("/install/connected");
      } catch (e) {
        await navigate("/install");
      }
      setLoading(false);
    })();
  }, [queryParams]);

  if (loading) {
    return <Loading />;
  }

  const handleDelete = () => {
    (async () => {
      await deleteInstallation();
      setAccount(null);
      await navigate("/install");
    })();
  };

  return (
    <Router>
      <Connect path="/" exact />
      <Connected
        path="connected"
        exact
        account={account}
        onDelete={handleDelete}
      />
    </Router>
  );
};

export default Install;
