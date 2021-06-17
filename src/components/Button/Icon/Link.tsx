import React from "react";
import IconButton, { IconButtonProps } from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";

interface LinkProps extends IconButtonProps {
  href?: string;
  windowFeatures?: string;
  onWindow?: (window: Window | null) => void;
}
const LinkIcon: React.FC<LinkProps> = ({
  href,
  windowFeatures,
  children,
  onWindow,
}: LinkProps) => {
  const handleClick = () => {
    const newWindow = window.open(href, undefined, windowFeatures);
    if (onWindow) onWindow(newWindow);
  };
  return (
    <IconButton
      component={Link}
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
  windowFeatures: undefined,
  onWindow: undefined,
};
export default LinkIcon;
