import React from "react";
import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { ISpotifyAlbum } from "../../../interfaces";

interface ISpotifyAlbumCard {
  album: ISpotifyAlbum;
}
const Album: React.FC<ISpotifyAlbumCard> = ({
  album: { name },
}: ISpotifyAlbumCard) => {
  return (
    <Card>
      <Box display="flex">
        <Box display="flex" justifyItems="center" alignItems="center" mx={1}>
          {/* <CardMedia image={previewUrl} className={classes.media} /> */}
        </Box>
        <CardContent>
          <Typography noWrap>{name}</Typography>
          <Typography color="textSecondary" noWrap>
            {}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
};

export default Album;
