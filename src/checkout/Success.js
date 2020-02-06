import React, { useEffect } from "react";
import Loading from "../Loading";

const Success = () => {
  useEffect(() => {
    window.opener.postMessage({ status: "success" }, "*");
  }, []);
  return <Loading />;
};

export default Success;
