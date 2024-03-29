/**@jsx jsx*/
import { useRef } from "react";
import { css, jsx } from "@emotion/core";
import { useCallback, useEffect, useState } from "react";
import { createDetailsWidget } from "@livechat/agent-app-sdk";
import { useApi } from "../api";
import Connect from "./Connect";
import Profile from "./Profile";
import Loading from "../Loading";

const containerCss = css`
  padding: 10px;
`;
const Details = () => {
  const api = useApi();
  const profileRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [match, setMatch] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [notConnected, setNotConnected] = useState(false);

  const fetchProfile = useCallback(
    async (profile) => {
      let customers = { data: [] };
      try {
        customers = await api.searchCustomer({
          email: profile?.email,
          lc_id: profile?.id,
        });
      } catch (e) {
        if (e.response.status === 403) {
          setNotConnected(true);
        }
      }
      setCustomers(customers.data.filter((c) => !c.lc_exists));
      setMatch(customers.data.find((c) => c.lc_exists));
      setLoading(false);
      profileRef.current = profile;
    },
    [api]
  );

  useEffect(() => {
    createDetailsWidget().then((widget) => {
      widget.on("customer_profile", async (profile) => {
        setCustomers([]);
        setMatch(null);
        setLoading(true);

        if (profile) {
          await fetchProfile(profile);
          setLoading(false);
        }
      });
    });
  }, [fetchProfile]);

  const handleLink = useCallback(
    async (customer) => {
      setLoading(true);
      await api.linkCustomer(customer.id, profileRef.current.id);
      setMatch(customer);
      setLoading(false);
    },
    [api]
  );

  const handleCreate = useCallback(async () => {
    setLoading(true);
    const resp = await api.createCustomer({
      email: profileRef.current.email,
      name: profileRef.current.name,
      lc_id: profileRef.current.id,
    });
    setMatch(resp.data);
    setLoading(false);
  }, [api]);

  if (loading) {
    return <Loading />;
  }

  if (notConnected) {
    return (
      <div css={containerCss}>
        <p>
          Your account is not connected to Stripe. Please go to application
          Settings.
        </p>
      </div>
    );
  }

  return (
    <div css={containerCss}>
      {match && (
        <Profile key={match.id} customer={match} profileRef={profileRef} />
      )}
      {!match && (
        <Connect
          customers={customers}
          onLink={handleLink}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
};

export default Details;
