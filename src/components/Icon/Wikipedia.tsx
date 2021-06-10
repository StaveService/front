import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";
import { FaWikipediaW } from "react-icons/fa";

const Itunes: React.FC = ({ color }: SvgIconProps) => {
  return (
    <SvgIcon color={color}>
      <FaWikipediaW />
    </SvgIcon>
  );
};
export default Itunes;
