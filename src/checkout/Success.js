import React, { useEffect } from "react";
import Loading from "../Loading";

const Success = ({ momentsRef }) => {
  useEffect(() => {
    momentsRef.current.sendSystemMessage({
      text: "Customer completed payment successfully.",
      recipients: "agents"
    });
    momentsRef.close();
  }, []);
  return <Loading />;
};

export default Success;
