import React from "react";
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
  return (
    <Card>
      <Box display="flex">
        <Box flex="1" overflow="hidden">
          <CardContent>
            <Typography>{artistName}</Typography>
            <Button href={artistLinkUrl}>itunes</Button>
          </CardContent>
        </Box>
      </Box>
    </Card>
  );
};

export default ItunesArtist;
