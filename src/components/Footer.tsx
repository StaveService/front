import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { Link } from "@material-ui/core";
import DefaultLayout from "../layout/Default";
import routes from "../constants/routes.json";

const Footer: React.FC = () => {
  return (
    <DefaultLayout>
      <Link component={RouterLink} to={routes.CONTACTS}>
        <FormattedMessage id="contact" />
      </Link>
    </DefaultLayout>
  );
};
export default Footer;
