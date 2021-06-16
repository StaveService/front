import React from "react";
import IconButton, { IconButtonProps } from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";

interface LinkProps extends IconButtonProps {
  href?: string;
}
const LinkIcon: React.FC<LinkProps> = ({ href, children }: LinkProps) => {
  const handleClick = () => window.open(href, "_blank");
  return (
    <IconButton
      component={Link}
      target="_blank"
      rel="noopener noreferrer"
      disabled={!href}
      onClick={handleClick}
    >
      {children}
    </IconButton>
  );
};

LinkIcon.defaultProps = {
  href: undefined,
};
export default LinkIcon;
