import React from "react";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { ISpotifyTrack } from "../../../interfaces";

const useStyles = makeStyles({
  media: {
    height: 100,
    width: 100,
  },
});
interface ISpotifyTrackCard {
  track: ISpotifyTrack;
}
const SpotifyTrackCard: React.FC<ISpotifyTrackCard> = ({
  track: { name, preview_url: previewUrl, artists },
}: ISpotifyTrackCard) => {
  const classes = useStyles();
  return (
    <Card>
      <Box display="flex">
        <Box display="flex" justifyItems="center" alignItems="center" mx={1}>
          <CardMedia image={previewUrl} className={classes.media} />
        </Box>
        <CardContent>
          <Typography noWrap>{name}</Typography>
          <Typography color="textSecondary" noWrap>
            {}
          </Typography>
          <Typography color="textSecondary" noWrap>
            {artists.map((artist) => artist.name)}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
};

export default SpotifyTrackCard;