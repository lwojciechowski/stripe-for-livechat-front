/**@jsx jsx*/
import { css, jsx } from "@emotion/core";
import { Button } from "@livechat/design-system";

const containerCss = css`
  .customer {
    width: 100%;
    border-bottom: 2px solid #cce0ff;
    padding: 1em 0;
    table {
      margin-bottom: 0.5em;
      td {
        padding-bottom: 5px;
      }
      td:first-of-type:not(.description) {
        font-weight: 600;
      }

      td.description strong {
        display: block;
        margin-bottom: 5px;
      }
    }
    button:not(:last-of-type) {
      margin-right: 7px;
    }
  }

  h2:not(:first-of-type) {
    margin-top: 2em;
  }

  .new {
    margin-top: 1em;
  }
`;
const Connect = ({ customers, onLink, onCreate }) => {
  return (
    <div css={containerCss}>
      <h2>Could not find customer</h2>
      {customers.length > 0 && (
        <p>You can link to existing ones in Stripe or create new one.</p>
      )}
      {customers.length === 0 && <p>You can create new customer.</p>}

      {customers.map(c => (
        <div className="customer">
          <table>
            <tr>
              <td>ID:</td>
              <td>{c.id} </td>
            </tr>
            {c.name && (
              <tr>
                <td>Name:</td>
                <td>{c.name}</td>
              </tr>
            )}
            {c.email && (
              <tr>
                <td>Email:</td>
                <td>{c.email}</td>
              </tr>
            )}
            {c.phone && (
              <tr>
                <td>Phone:</td>
                <td>{c.phone}</td>
              </tr>
            )}
            {c.description && (
              <tr>
                <td className="description" colspan={2}>
                  <strong>Description:</strong>
                  {c.description.length > 100
                    ? `${c.description.substr(0, 100)}...`
                    : c.description.length}
                </td>
              </tr>
            )}
          </table>

          <Button size="compact" onClick={() => onLink(c)}>
            Link
          </Button>
          <Button
            size="compact"
            secondary
            onClick={() =>
              window.open(
                `https://dashboard.stripe.com/customers/${c.id}`,
                "stripe_preview"
              )
            }
          >
            Check in Stripe
          </Button>
        </div>
      ))}
      <Button className="new" onClick={onCreate} primary fullWidth>
        Create new customer
      </Button>
    </div>
  );
};

export default Connect;
