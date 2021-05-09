import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";
import { FaTwitter } from "react-icons/fa";

const Itunes: React.FC = ({ color }: SvgIconProps) => {
  return (
    <SvgIcon color={color}>
      <FaTwitter />
    </SvgIcon>
  );
};
export default Itunes;
