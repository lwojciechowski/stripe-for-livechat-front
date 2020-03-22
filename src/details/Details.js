/**@jsx jsx*/
import { useRef } from "react";
import { css, jsx } from "@emotion/core";
import { useCallback, useEffect, useState } from "react";
import { createDetailsWidget } from "@livechat/agent-app-sdk";
import {
  createCustomer,
  getSubscriptions,
  linkCustomer,
  searchCustomer
} from "../api";
import Connect from "./Connect";
import Profile from "./Profile";
import Loading from "../Loading";

const containerCss = css`
  padding: 10px;
`;
const Details = () => {
  const profileRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [match, setMatch] = useState(null);
  const [customers, setCustomers] = useState([]);

  const fetchProfile = useCallback(async profile => {
    let customers = { data: [] };
    try {
      customers = await searchCustomer({
        email: profile?.email,
        lc_id: profile?.id
      });
    } catch (e) {}
    setCustomers(customers.data.filter(c => !c.lc_exists));
    setMatch(customers.data.find(c => c.lc_exists));
    setLoading(false);
    profileRef.current = profile;
  }, []);

  useEffect(() => {
    createDetailsWidget().then(widget => {
      widget.on("customer_profile", async profile => {
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

  const handleLink = useCallback(async customer => {
    setLoading(true);
    await linkCustomer(customer.id, profileRef.current.id);
    setMatch(customer);
    setLoading(false);
  }, []);

  const handleCreate = useCallback(async () => {
    setLoading(true);
    const resp = await createCustomer({
      email: profileRef.current.email,
      name: profileRef.current.name,
      lc_id: profileRef.current.id
    });
    setMatch(resp.data);
    setLoading(false);
  }, []);

  if (loading) {
    return <Loading />;
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
