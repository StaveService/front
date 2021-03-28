import React from "react";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

interface IItunesMusic {
  artworkUrl100: string;
  artistName: string;
  collectionCensoredName: string;
  trackCensoredName: string;
}
const useStyles = makeStyles({
  media: {
    height: 100,
    width: 100,
  },
});
const ItunesMusic: React.FC<IItunesMusic> = ({
  artworkUrl100,
  artistName,
  collectionCensoredName,
  trackCensoredName,
}: IItunesMusic) => {
  const classes = useStyles();
  return (
    <Card>
      <Box display="flex">
        <Box flex="1" overflow="hidden">
          <CardContent>
            <Typography noWrap>{trackCensoredName}</Typography>
            <Typography color="textSecondary" noWrap>
              {artistName}
            </Typography>
            <Typography color="textSecondary" noWrap>
              {collectionCensoredName}
            </Typography>
          </CardContent>
        </Box>
        <Box display="flex" justifyItems="center" alignItems="center" mx={1}>
          <CardMedia image={artworkUrl100} className={classes.media} />
        </Box>
      </Box>
    </Card>
  );
};

export default ItunesMusic;
