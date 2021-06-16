import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";
import { FaSpotify } from "react-icons/fa";

const Itunes: React.FC = ({ color }: SvgIconProps) => {
  return (
    <SvgIcon color={color}>
      <FaSpotify />
    </SvgIcon>
  );
};
export default Itunes;
