/**@jsx jsx*/
import { css, jsx } from "@emotion/core";

const buttonCss = css`
  background: none;
  border: 0;
  margin: 0;
  padding: 0;
  color: #4384f5;
  cursor: pointer;
  font-size: 15px;
  font-weight: bold;
  font-family: inherit;

  &:focus {
    outline: 0;
  }
`;

const LinkButton = ({ children, ...rest }) => {
  return (
    <button css={buttonCss} {...rest}>
      {children}
    </button>
  );
};

export default LinkButton;
