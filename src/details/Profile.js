/**@jsx jsx*/
import React, { useContext, useState } from "react";
import { css, jsx } from "@emotion/core";
import { Button } from "@livechat/design-system";
import { createCheckoutSession, sendEvent } from "../api";

const containerCss = css`
  table.customer {
    width: 100%;
    margin-bottom: 1em;
  }
  td:first-of-type {
    padding-bottom: 5px;
    font-weight: bold;
  }
`;

const Profile = ({ customer, plans, profileRef }) => {
  const [chooseSubscription, setChooseSubscription] = useState(false);
  const handleSendSubscription = () => {
    createCheckoutSession({
      items: [{ name: "Shoes", quantity: 1, amount: 1200, currency: "pln" }]
    }).then(resp => {
      sendEvent(profileRef.current.chat.chat_id, {
        type: "rich_message",
        template_id: "cards",
        elements: [
          {
            title: "Shoes",
            subtitle: "12,00zł",
            buttons: [
              {
                type: "webview",
                text: "Buy now",
                postback_id: "open_url",
                user_ids: [],
                value: `https://localhost:3000/checkout/start?session_id=${resp.data.session_id}&account_id=${resp.data.account_id}`,
                webview_height: "compact"
              }
            ]
          }
        ]
      });
    });
    // setChooseSubscription(true);
  };

  return (
    <div css={containerCss}>
      <h2>Customer in Stripe</h2>
      <table className="customer">
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
      <h2>Subscription</h2>
      {!chooseSubscription && (
        <Button
          fullWidth
          primary
          disabled={!plans.length}
          onClick={handleSendSubscription}
        >
          Send Subscription
        </Button>
      )}
      {chooseSubscription && {}}
    </div>
  );
};

export default Profile;
