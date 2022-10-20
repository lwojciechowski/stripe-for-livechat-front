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

export const searchCustomer = params => {
  return axios.get(`${API_URL}/customers`, getConfig({ params }));
};

export const createCustomer = params => {
  return axios.post(`${API_URL}/customers`, params, getConfig());
};

export const getCharges = params => {
  return axios.get(`${API_URL}/customers/charges`, getConfig({ params }));
};

export const getSubscriptions = params => {
  return axios.get(`${API_URL}/customers/subscriptions`, getConfig({ params }));
};

export const linkCustomer = (stripeId, lcId) => {
  return axios.post(
    `${API_URL}/customers/link`,
    {
      stripe_id: stripeId,
      lc_id: lcId
    },
    getConfig()
  );
};

export const getPlans = () => {
  return axios.get(`${API_URL}/plans`, getConfig());
};

export const getCoupons = () => {
  return axios.get(`${API_URL}/coupons`, getConfig());
};

export const getCountry = code => {
  return axios.get(`${API_URL}/country?code=${code}`, getConfig());
};

export const createCheckoutSession = params => {
  return axios.post(`${API_URL}/checkout-session`, params, getConfig());
};

export const sendEvent = (chatId, event) => {
  return axios.post(
    "https://api.livechatinc.com/v3.3/agent/action/send_event",
    { chat_id: chatId, event },
    getConfig()
  );
};

const getConfig = params => {
  return {
    ...params,
    headers: {
      Authorization: `Bearer ${authRef.token}`,
      "Content-Type": "application/json",
      ...params?.headers
    }
  };
};
