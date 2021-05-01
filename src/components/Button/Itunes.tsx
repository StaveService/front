import React from "react";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import ItunesIcon from "../Icon/Itunes";

interface ItunesProps {
  itunesUrl: string | undefined;
}
const Itunes: React.FC<ItunesProps> = ({ itunesUrl }: ItunesProps) => {
  if (itunesUrl)
    return (
      <Button
        startIcon={<ItunesIcon />}
        component={Link}
        href={itunesUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Itunes
      </Button>
    );
  return null;
};
export default Itunes;
