import { useCallback, useContext, useMemo } from "react";
import axios from "axios";

import { AuthContext } from "./Auth";

const API_URL = process.env.REACT_APP_API_URL;

const useAuth = () => {
  const auth = useContext(AuthContext);

  const checkAuth = useCallback(
    (err) => {
      if (!auth) {
        return;
      }
      if (err.response?.status === 403) {
        auth.clear();
      }
      throw err;
    },
    [auth]
  );

  const headers = useMemo(() => {
    if (!auth) {
      return;
    }
    return getHeadersConfig({
      headers: {
        Authorization: `Bearer ${auth.access_token}`,
        "X-Region": auth.access_token.split(":")?.[0],
      },
    });
  }, [auth]);

  return useMemo(() => ({ checkAuth, headers }), [checkAuth, headers]);
};

export const useApi = () => {
  const { checkAuth, headers } = useAuth();

  return useMemo(
    () => ({
      createInstallation: (stripeCode) => {
        return axios
          .post(`${API_URL}/installation`, { stripe_code: stripeCode }, headers)
          .catch(checkAuth);
      },

      getInstallation: () => {
        return axios.get(`${API_URL}/installation`, headers).catch(checkAuth);
      },

      deleteInstallation: () => {
        return axios
          .delete(`${API_URL}/installation`, headers)
          .catch(checkAuth);
      },

      searchCustomer: (params) => {
        return axios
          .get(`${API_URL}/customers`, params, headers)
          .catch(checkAuth);
      },

      createCustomer: (params) => {
        return axios
          .post(`${API_URL}/customers`, params, headers)
          .catch(checkAuth);
      },

      getCharges: (params) => {
        return axios
          .get(`${API_URL}/customers/charges`, params, headers)
          .catch(checkAuth);
      },

      getSubscriptions: (params) => {
        return axios
          .get(`${API_URL}/customers/subscriptions`, params, headers)
          .catch(checkAuth);
      },

      linkCustomer: (stripeId, lcId) => {
        return axios
          .post(
            `${API_URL}/customers/link`,
            {
              stripe_id: stripeId,
              lc_id: lcId,
            },
            headers
          )
          .catch(checkAuth);
      },

      getPlans: () => {
        return axios.get(`${API_URL}/plans`, headers).catch(checkAuth);
      },

      getCoupons: () => {
        return axios.get(`${API_URL}/coupons`, headers).catch(checkAuth);
      },

      getCountry: (code) => {
        return axios
          .get(`${API_URL}/country?code=${code}`, headers)
          .catch(checkAuth);
      },

      createCheckoutSession: (params) => {
        return axios
          .post(`${API_URL}/checkout-session`, params, headers)
          .catch(checkAuth);
      },

      sendEvent: (chatId, event) => {
        return axios
          .post(
            "https://api.livechatinc.com/v3.3/agent/action/send_event",
            { chat_id: chatId, event },
            headers
          )
          .catch(checkAuth);
      },
    }),
    [headers, checkAuth]
  );
};

const getHeadersConfig = (params) => {
  return {
    ...params,
    headers: {
      "Content-Type": "application/json",
      ...params?.headers,
    },
  };
};
