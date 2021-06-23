import React from "react";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
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
  artist: { name },
}: ISpotifyArtistCard) => {
  const classes = useStyles();
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

export default SpotifyTrackCard;
