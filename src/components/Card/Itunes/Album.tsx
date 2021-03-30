import React from "react";
import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { IItunesAlbum } from "../../../interfaces";

interface IItunesAlbumCard {
  album: IItunesAlbum;
}
const ItunesAlbum: React.FC<IItunesAlbumCard> = ({
  album: { artistName, collectionName },
}: IItunesAlbumCard) => {
  return (
    <Card>
      <Box display="flex">
        <Box flex="1" overflow="hidden">
          <CardContent>
            <Typography>{collectionName}</Typography>
            <Typography>{artistName}</Typography>
          </CardContent>
        </Box>
      </Box>
    </Card>
  );
};

export default ItunesAlbum;
