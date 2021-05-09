import React from "react";
import Link from "./index";
import ItunesIcon from "../../Icon/Twitter";

interface ItunesProps {
  href: string | undefined;
}
const Itunes: React.FC<ItunesProps> = ({ href }: ItunesProps) => {
  return (
    <Link startIcon={<ItunesIcon />} href={href}>
      twitter
    </Link>
  );
};
export default Itunes;
