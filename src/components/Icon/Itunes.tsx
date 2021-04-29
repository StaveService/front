import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";
import { SiItunes } from "react-icons/si";

const Itunes: React.FC = ({ color }: SvgIconProps) => {
  return (
    <SvgIcon color={color}>
      <SiItunes />
    </SvgIcon>
  );
};
export default Itunes;
