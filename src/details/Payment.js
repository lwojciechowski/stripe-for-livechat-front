/**@jsx jsx*/
// eslint-disable-next-line
import React from "react";
import Header from "./Header";
import { MdArrowBack, MdLaunch } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import { css, jsx } from "@emotion/core";
import { Form, Field } from "react-final-form";
import FFInputField from "./FFInputField";
import {
  Button,
  FieldGroup,
  FormGroup,
  RadioButton,
  SelectField
} from "@livechat/design-system";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createCheckoutSession, getCountry, getPlans, sendEvent } from "../api";
import Loading from "../Loading";
import arrayMutators from "final-form-arrays";
import { FieldArray } from "react-final-form-arrays";
import LinkButton from "./LinkButton";

const containerCss = css`
  .back {
    margin-right: 10px;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  input {
    width: 100%;
  }

  .trash {
    display: block;
    float: right;
    cursor: pointer;
  }

  .item {
    position: relative;
    background: #f6f6f9;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 1em;
  }

  .submit {
    margin-top: 2em;
  }

  .item-title {
    display: block;
    font-weight: bold;
    margin-bottom: 4px;
    font-size: 15px;
  }
`;

const defaultItem = {
  type: "recurring",
  quantity: "1"
};

const getPlanItemBody = props => (
  <div id={props.id}>
    {props.productName}
    {props.planNickname && <span>&nbsp;- {props.planNickname}</span>}
  </div>
);

const getCurrencyItemBody = props => <div id={props.id}>{props.name}</div>;

const Payment = ({ onClose, profileRef, customer }) => {
  const [plans, setPlans] = useState(null);
  const [country, setCountry] = useState(null);

  const fetchPlans = useCallback(async () => {
    const resp = await getPlans();
    setPlans(resp.data);
  }, []);

  const fetchCountry = useCallback(async () => {
    const resp = await getCountry(
      profileRef.current?.geolocation?.country_code || "US"
    );
    setCountry(resp.data);
  }, [profileRef]);

  useEffect(() => {
    fetchPlans();
    fetchCountry();
  }, [fetchPlans, fetchCountry]);

  const plansItems = useMemo(
    () =>
      plans?.map(p => ({
        key: p.id,
        props: {
          name: p.product.name + p.nickname,
          productName: p.product.name,
          planNickname: p.nickname
        }
      })),
    [plans]
  );

  const currencyItems = useMemo(
    () =>
      country?.supported_payment_currencies.map(c => ({
        key: c,
        props: { id: c, name: c.toUpperCase() }
      })),
    [country]
  );

  const onSubmit = vals => {
    const params = {
      stripe_customer_id: customer.id
    };
    const items = vals.items
      .filter(i => i.type === "onetime")
      .map(i => ({
        name: i.name,
        quantity: parseInt(i.quantity, 10),
        amount: parseFloat(i.amount?.replace(",", ".")) * 100,
        currency: i.currency
      }));
    if (items.length > 0) {
      params.items = items;
    }

    const subs = vals.items
      .filter(i => i.type === "recurring")
      .map(i => ({ plan: i.plan, quantity: parseInt(i.quantity) }));
    if (subs.length > 0) {
      params.subscriptions = subs;
    }

    createCheckoutSession(params).then(resp => {
      const event = {
        type: "rich_message",
        template_id: "cards",
        elements: [
          {
            title: vals.title,
            subtitle: vals.subtitle,
            buttons: [
              {
                type: "webview",
                text: "Buy now",
                postback_id: "open_url",
                user_ids: [],
                value: `https://stripe-for-livechat.99bits.xyz/checkout/start?session_id=${resp.data.session_id}&account_id=${resp.data.account_id}`,
                webview_height: "compact"
              }
            ]
          }
        ]
      };
      if (vals.image) {
        event.elements[0].image = { url: vals.image };
      }
      sendEvent(profileRef.current.chat.chat_id, event);
    });
  };

  const validate = vals => {
    const errors = {};

    if (!vals.title && !vals.subtitle && !vals.image) {
      errors.title = "Title, subtitle or image required";
    }

    vals.items.forEach((item, i) => {
      if (item.type === "onetime") {
      }

      if (!item.quantity) {
        errors[`items[${i}].quantity`] = "Quantity is required";
      }
      if (item.type === "onetime") {
        if (!item.name) {
          errors[`items[${i}].name`] = "Name is required";
        }
        if (!item.amount) {
          errors[`items[${i}].amount`] = "Amount is required";
        }
        if (!item.currency) {
          errors[`items[${i}].currency`] = "Currency is required";
        }
      }
    });
    return errors;
  };

  if (plans === null || country === null) {
    return <Loading />;
  }

  return (
    <div css={containerCss}>
      <Header>
        <MdArrowBack className="back" onClick={onClose} />{" "}
        <span>Send Payment</span>
      </Header>

      <Form
        onSubmit={onSubmit}
        mutators={arrayMutators}
        initialValues={{
          items: [{ ...defaultItem, plan: plansItems[0]?.key }]
        }}
        validate={validate}
        render={({ handleSubmit, touched, errors, values }) => (
          <>
            <form onSubmit={handleSubmit}>
              {/*{JSON.stringify(values, null, " ")}*/}
              <Field
                id="title"
                component={FFInputField}
                fullWidth
                name="title"
                labelText="Order title"
                description="Order title visible in rich message"
                placeholder=""
                error={
                  touched.title &&
                  touched.subtitle &&
                  touched.image &&
                  errors.title
                }
              />
              <Field
                id="subtitle"
                component={FFInputField}
                fullWidth
                name="subtitle"
                labelText="Order subtitle"
                description="Order subtitle visible in rich message"
                placeholder=""
              />
              <Field
                id="image"
                component={FFInputField}
                fullWidth
                name="image"
                labelText="Image URL"
                description="Decorative image for rich message"
                placeholder="https://example.com/image.png"
              />
              <FormGroup
                labelText="Payment Items"
                helperText="You can mix recurring and one-time payments."
              >
                <FieldArray name="items">
                  {({ fields }) => (
                    <>
                      {fields.map((name, index) => (
                        <>
                          <span className="item-title">
                            Item #{index + 1}{" "}
                            {fields.length > 1 && (
                              <FaRegTrashAlt
                                className="trash"
                                onClick={() => fields.remove(index)}
                              />
                            )}
                          </span>

                          <div className="item">
                            <FieldGroup
                              inline
                              stretch
                              style={{ marginBottom: 15 }}
                            >
                              <Field name={`${name}.type`}>
                                {({ input, meta }) => (
                                  <RadioButton
                                    checked={input.value === "recurring"}
                                    value="recurring"
                                    name="type"
                                    id={`${name}.type`}
                                    onClick={input.onChange}
                                  >
                                    Recurring
                                  </RadioButton>
                                )}
                              </Field>
                              <Field name={`${name}.type`}>
                                {({ input, meta }) => (
                                  <RadioButton
                                    checked={input.value === "onetime"}
                                    value="onetime"
                                    name="type"
                                    id={`${name}.type`}
                                    onClick={input.onChange}
                                  >
                                    One-time
                                  </RadioButton>
                                )}
                              </Field>
                            </FieldGroup>

                            {values.items[index]?.type === "recurring" && (
                              <>
                                {plans.length === 0 && (
                                  <p>
                                    You have no plans configured in Stripe.
                                    Please set some to use this feature.
                                    <br />
                                    <Button
                                      onClick={() =>
                                        window.open(
                                          "https://dashboard.stripe.com/subscriptions/products",
                                          "_blank"
                                        )
                                      }
                                      fullWidth
                                      icon={<MdLaunch />}
                                      secondary
                                      style={{ marginTop: "1em" }}
                                    >
                                      Manage products
                                    </Button>
                                  </p>
                                )}
                                {plans.length > 0 && (
                                  <>
                                    <Field name={`${name}.plan`}>
                                      {({ input, meta }) => (
                                        <SelectField
                                          id={`${name}.plan`}
                                          items={plansItems}
                                          searchProperty="name"
                                          onItemSelect={input.onChange}
                                          getItemBody={getPlanItemBody}
                                          labelText="Product pricing plan"
                                          search
                                          placeholder="Select plan"
                                          getSelectedItemBody={getPlanItemBody}
                                          selected={input.value}
                                          searchPlaceholder="Search..."
                                        />
                                      )}
                                    </Field>
                                    <Field
                                      id={`${name}.quantity`}
                                      component={FFInputField}
                                      fullWidth
                                      name={`${name}.quantity`}
                                      error={
                                        touched[name + ".quantity"] &&
                                        errors[name + ".quantity"]
                                      }
                                      labelText="Quantity"
                                      placeholder="1"
                                    />
                                  </>
                                )}
                              </>
                            )}
                            {values.items[index]?.type === "onetime" && (
                              <>
                                <FieldGroup inline stretch>
                                  <Field
                                    id={`${name}.name`}
                                    component={FFInputField}
                                    fullWidth
                                    name={`${name}.name`}
                                    labelText="Name"
                                    description="The name for the line item."
                                    placeholder=""
                                    error={
                                      touched[name + ".name"] &&
                                      errors[name + ".name"]
                                    }
                                  />
                                  <Field
                                    id={`${name}.quantity`}
                                    component={FFInputField}
                                    fullWidth
                                    name={`${name}.quantity`}
                                    labelText="Quantity"
                                    description="The quantity of the line item being purchased."
                                    placeholder=""
                                    error={
                                      touched[name + ".quantity"] &&
                                      errors[name + ".quantity"]
                                    }
                                  />
                                </FieldGroup>
                                <FieldGroup inline stretch>
                                  <Field
                                    id={`${name}.amount`}
                                    component={FFInputField}
                                    fullWidth
                                    name={`${name}.amount`}
                                    labelText="Amount"
                                    description="The amount to be collected per unit of the line item."
                                    placeholder=""
                                    error={
                                      touched[name + ".amount"] &&
                                      errors[name + ".amount"]
                                    }
                                  />
                                  <Field name={`${name}.currency`}>
                                    {({ input, meta }) => (
                                      <SelectField
                                        id={`${name}.plan`}
                                        items={currencyItems}
                                        searchProperty="name"
                                        onItemSelect={input.onChange}
                                        getItemBody={getCurrencyItemBody}
                                        labelText="Currency"
                                        search
                                        placeholder="Select currency"
                                        getSelectedItemBody={
                                          getCurrencyItemBody
                                        }
                                        selected={input.value}
                                        searchPlaceholder="Search..."
                                        error={
                                          touched[name + ".currency"] &&
                                          errors[name + ".currency"]
                                        }
                                      />
                                    )}
                                  </Field>
                                </FieldGroup>
                              </>
                            )}
                          </div>
                        </>
                      ))}
                      <LinkButton
                        onClick={e => {
                          e.preventDefault();
                          fields.push({
                            ...defaultItem,
                            plan: plansItems[0]?.key
                          });
                        }}
                      >
                        &#65291; Add another item
                      </LinkButton>
                    </>
                  )}
                </FieldArray>
              </FormGroup>
              <Button className="submit" fullWidth primary type="submit">
                Send
              </Button>
            </form>
          </>
        )}
      />
    </div>
  );
};

export default Payment;
