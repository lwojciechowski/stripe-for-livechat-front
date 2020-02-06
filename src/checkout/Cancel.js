import React, { useEffect } from "react";
import Loading from "../Loading";

const Cancel = ({ momentsRef }) => {
  useEffect(() => {
    momentsRef.current.sendSystemMessage({
      text: "Customer canceled or payment failed.",
      recipients: "agents"
    });
    momentsRef.close();
  }, []);
  return <Loading />;
};

export default Cancel;
