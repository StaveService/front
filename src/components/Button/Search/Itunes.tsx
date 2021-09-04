import React from "react";
import { FormattedMessage } from "react-intl";
import Button, { ButtonProps } from "@material-ui/core/Button";

const Itunes: React.FC<ButtonProps> = (props: ButtonProps) => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Button variant="contained" color="secondary" {...props}>
      <FormattedMessage id="searchByItunes" />
    </Button>
  );
};
export default Itunes;
