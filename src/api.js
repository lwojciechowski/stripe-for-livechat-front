import { authRef } from "./authRef";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const createInstallation = stripeCode => {
  return axios.post(
    `${API_URL}/installation`,
    { stripe_code: stripeCode },
    getConfig()
  );
};

export const getInstallation = () => {
  return axios.get(`${API_URL}/installation`, getConfig());
};

export const deleteInstallation = () => {
  return axios.delete(`${API_URL}/installation`, getConfig());
};

const getConfig = () => {
  return {
    headers: {
      Authorization: `Bearer ${authRef.token}`,
      "Content-Type": "application/json"
    }
  };
};
