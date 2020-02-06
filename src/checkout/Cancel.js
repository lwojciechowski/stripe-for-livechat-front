import React, { useEffect } from "react";
import Loading from "../Loading";

const Cancel = () => {
  useEffect(() => {
    window.opener.postMessage({ status: "cancel" }, "*");
  });
  return <Loading />;
};

export default Cancel;
