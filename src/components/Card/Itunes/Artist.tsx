import React, { MouseEvent } from "react";
import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { IItunesArtist } from "../../../interfaces";

interface IItunesArtistCard {
  artist: IItunesArtist;
}
const ItunesArtist: React.FC<IItunesArtistCard> = ({
  artist: { artistName, artistLinkUrl },
}: IItunesArtistCard) => {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => e.stopPropagation();
  return (
    <Card>
      <Box display="flex">
        <Box flex="1" overflow="hidden">
          <CardContent>
            <Typography>{artistName}</Typography>
            <Button
              href={artistLinkUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
            >
              itunes
            </Button>
          </CardContent>
        </Box>
      </Box>
    </Card>
  );
};

export default ItunesArtist;
