import React from "react";
import { InputField } from "@livechat/design-system";

const FFInputField = ({ input, handleSubmit, ...rest }) => {
  return <InputField id={rest.labelText} {...rest} {...input} />;
};

export default FFInputField;
