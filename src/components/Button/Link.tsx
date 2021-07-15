import React from "react";
import Button, { ButtonProps } from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";

const Layout: React.FC<ButtonProps> = ({
  children,
  href,
  startIcon,
}: ButtonProps) => {
  return (
    <Button
      startIcon={startIcon}
      component={Link}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      disabled={!href}
    >
      {children}
    </Button>
  );
};
export default Layout;
