import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";
import { FaYoutube } from "react-icons/fa";

const Itunes: React.FC = ({ color }: SvgIconProps) => {
  return (
    <SvgIcon color={color}>
      <FaYoutube />
    </SvgIcon>
  );
};
export default Itunes;
