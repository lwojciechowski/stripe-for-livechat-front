/**@jsx jsx*/
import { useRef } from "react";
import { css, jsx } from "@emotion/core";
import { useCallback, useEffect, useState } from "react";
import { createDetailsWidget } from "@livechat/agent-app-sdk";
import { getCoupons, getPlans, linkCustomer, searchCustomer } from "../api";
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
  const [plans, setPlans] = useState([]);
  const [coupons, setCoupons] = useState([]);

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

  const fetchPlans = useCallback(async () => {
    const resp = await getPlans();
    setPlans(resp.data);
  }, []);

  const fetchCoupons = useCallback(async () => {
    const resp = await getCoupons();
    setCoupons(resp.data);
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
  }, []);

  useEffect(() => {
    fetchPlans();
    fetchCoupons();
  }, []);

  const handleLink = useCallback(async customer => {
    setLoading(true);
    await linkCustomer(customer.id, profileRef.current.id);
    setMatch(customer);
    setLoading(false);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div css={containerCss}>
      {match && (
        <Profile
          key={match.id}
          customer={match}
          profileRef={profileRef}
          plans={plans}
        />
      )}
      {!match && (
        <Connect
          customers={customers}
          onLink={handleLink}
          onCreate={() => {}}
        />
      )}
    </div>
  );
};

export default Details;
