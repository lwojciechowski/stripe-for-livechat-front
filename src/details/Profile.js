/**@jsx jsx*/
import { useEffect, useState } from "react";
import { css, jsx } from "@emotion/core";
import { Button, Loader } from "@livechat/design-system";
import { MdCheck, MdClose, MdLaunch } from "react-icons/md";
import { getCharges, getSubscriptions } from "../api";
import Payment from "./Payment";
import Header from "./Header";

const containerCss = css`
  table.data {
    width: 100%;
  }

  td:first-of-type {
    padding-bottom: 5px;
    font-weight: bold;
  }

  .charge {
    display: flex;
    align-items: center;
    svg {
      margin-right: 10px;
      color: #a2260d;
    }
  }

  .charge.succeeded svg {
    fill: #2a9558;
  }

  .options {
    button:not(:first-of-type) {
      margin-top: 10px;
    }
  }

  .subscription {
    strong {
      font-weight: bold;
    }
    ul {
      list-style: none;
      padding: 0;
    }
    ul li {
      margin: 0;
      padding: 0;

      margin-bottom: 5px;
    }
  }
`;

const Profile = ({ customer, plans, profileRef }) => {
  const [state, setState] = useState("profile");
  const [charges, setCharges] = useState(null);
  const [subscriptions, setSubscriptions] = useState(null);

  useEffect(() => {
    setCharges(null);
    setSubscriptions(null);
    (async () => {
      let resp = await getCharges({ stripe_customer_id: customer.id });
      setCharges(resp.data);

      resp = await getSubscriptions({
        stripe_customer_id: customer.id
      });
      setSubscriptions(resp.data);
    })();
  }, [customer]);

  const handleSendSubscription = () => {
    setState("subscription");
  };

  const handleOpenStripe = () => {
    window.open(
      `https://dashboard.stripe.com/customers/${customer.id}`,
      "stripe"
    );
  };
  if (state === "subscription") {
    return (
      <Payment
        customer={customer}
        plans={plans}
        profileRef={profileRef}
        onClose={() => setState("profile")}
      />
    );
  }

  return (
    <div css={containerCss}>
      <Header>Customer</Header>
      <table className="data">
        <tbody>
          <tr>
            <td>ID</td>
            <td>{customer.id}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{customer.email}</td>
          </tr>
          {customer.name && (
            <tr>
              <td>Name</td>
              <td>{customer.name}</td>
            </tr>
          )}
          <tr>
            <td>Created at</td>
            <td>{new Date(customer.created * 1000).toLocaleString()}</td>
          </tr>
          {customer.address.city && (
            <tr>
              <td>Address</td>
              <td>
                {customer.address.line1}
                {customer.address.line1 && <br />}
                {customer.address.line2}
                {customer.address.line2 && <br />}
                {customer.address.postal_code} {customer.address.city}
                <br />
                {customer.address.country}
              </td>
            </tr>
          )}
          <tr>
            <td>Delinquent</td>
            <td>{customer.delinquent ? "Yes" : "No"}</td>
          </tr>
          {customer.description && (
            <tr>
              <td>Description</td>
              <td>{customer.description}</td>
            </tr>
          )}
        </tbody>
      </table>
      <Header>Last charges</Header>
      <table>
        <tbody>
          {charges === null && <Loader size="small" />}
          {charges?.length === 0 && <em>No charges</em>}
          {charges?.length > 0 &&
            charges.map(c => (
              <tr>
                <td className={`charge ${c.status}`}>
                  {c.status === "succeeded" ? <MdCheck /> : <MdClose />}
                  <div>
                    {(c.amount / 100).toFixed(2)} {c.currency.toUpperCase()}{" "}
                    {c.status}
                    <br />
                    <small>{new Date(c.created * 1000).toLocaleString()}</small>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <Header>Subscription</Header>
      {subscriptions === null && <Loader size="small" />}
      {subscriptions?.length === 0 && <em>No active subscription</em>}
      {subscriptions?.length > 0 && (
        <div className="subscription">
          {subscriptions.map(s => (
            <table className="data">
              <tbody>
                <tr>
                  <td>Product</td>
                  <td>
                    {s.plan.product.name} -{" "}
                    <span className="nickname">{s.plan.nickname}</span>
                  </td>
                </tr>
                <tr>
                  <td>Next payment:</td>
                  <td>
                    <strong>{(s.plan.amount / 100).toFixed(2)}</strong>{" "}
                    {s.plan.currency.toUpperCase()} at{" "}
                    {new Date(s.current_period_end * 1000).toLocaleDateString()}
                  </td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>{s.status}</td>
                </tr>
              </tbody>
            </table>
          ))}
        </div>
      )}

      <Header>Options</Header>
      <div className="options">
        <Button fullWidth primary onClick={handleSendSubscription}>
          Send Payment
        </Button>
        {/*<Button fullWidth onClick={handleSendSubscription}>*/}
        {/*  Send One Time Payment*/}
        {/*</Button>*/}
        <Button
          fullWidth
          icon={<MdLaunch />}
          onClick={handleOpenStripe}
          secondary
        >
          See in Stripe
        </Button>
      </div>
    </div>
  );
};

export default Profile;
