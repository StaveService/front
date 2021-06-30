import React from "react";
import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CardMedia from "@material-ui/core/CardMedia";
import { ISpotifyArtist } from "../../../interfaces";

const useStyles = makeStyles({
  media: {
    height: 100,
    width: 100,
  },
});
interface ISpotifyArtistCard {
  artist: ISpotifyArtist;
}
const SpotifyTrackCard: React.FC<ISpotifyArtistCard> = ({
  artist,
}: ISpotifyArtistCard) => {
  const classes = useStyles();
  return (
    <Card>
      <Box display="flex">
        <Box display="flex" justifyItems="center" alignItems="center" mx={1}>
          <CardMedia image={artist.images[0].url} className={classes.media} />
        </Box>
        <CardContent>
          <Typography noWrap>{artist.name}</Typography>
          <Typography color="textSecondary" noWrap>
            {}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
};

export default SpotifyTrackCard;
