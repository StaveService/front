import React from "react";
import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { ISpotifyAlbum } from "../../../interfaces";

const useStyles = makeStyles({
  media: {
    height: 100,
    width: 100,
  },
});
interface ISpotifyAlbumCard {
  album: ISpotifyAlbum;
}
const Album: React.FC<ISpotifyAlbumCard> = ({ album }: ISpotifyAlbumCard) => {
  const classes = useStyles();
  return (
    <Card>
      <Box display="flex">
        <Box display="flex" justifyItems="center" alignItems="center" mx={1}>
          <CardMedia image={album.images[0].url} className={classes.media} />
        </Box>
        <CardContent>
          <Typography noWrap>{album.name}</Typography>
          <Typography color="textSecondary" noWrap>
            {}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
};

export default Album;
