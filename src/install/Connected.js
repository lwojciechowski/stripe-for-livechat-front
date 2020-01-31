/**@jsx jsx */
import React from "react";
import { useState } from "react";
import { css, jsx } from "@emotion/core";
import { ActionModal, Button } from "@livechat/design-system";

const containerCss = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2em;

  strong {
    font-size: 1.1em;
  }

  button {
    margin-top: 1em;
  }

  button:first-of-type {
    margin-right: 10px;
  }

  p {
    text-align: center;
  }
`;

const Connected = ({ account, onDelete }) => {
  const [modalVisible, setModalVisible] = useState(false);
  if (!account) {
    return null;
  }

  const handleClose = () => {
    setModalVisible(false);
  };

  return (
    <div css={containerCss}>
      <h2>Connected to Stripe</h2>
      <p>
        You are connected to the account:
        <br />
        <strong>{account.business_profile?.name}</strong>
      </p>
      <div>
        <Button
          primary
          onClick={() => window.open("http://my.livechatinc.com/", "_blank")}
        >
          Start using integration
        </Button>
        <Button onClick={() => setModalVisible(true)}>Disconnect</Button>
      </div>

      {modalVisible && (
        <ActionModal
          onClose={handleClose}
          heading="Disconnect Stripe"
          actions={
            <>
              <Button size="large" onClick={handleClose} secondary>
                Cancel
              </Button>
              <Button size="large" onClick={onDelete} destructive>
                Disconnect
              </Button>
            </>
          }
        >
          <div style={{ maxWidth: "400px" }}>
            Are you sure you want to disconnect the Stripe account? All the
            connections between the customers in LiveChat and Stripe will be
            lost.
          </div>
        </ActionModal>
      )}
    </div>
  );
};

export default Connected;
