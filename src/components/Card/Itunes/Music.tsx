import React from "react";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { IItunesMusic } from "../../../interfaces";

const useStyles = makeStyles({
  media: {
    height: 100,
    width: 100,
  },
});
interface IItunesMusicCard {
  music: IItunesMusic;
}
const ItunesMusicCard: React.FC<IItunesMusicCard> = ({
  music: {
    artworkUrl100,
    artistName,
    collectionCensoredName,
    trackCensoredName,
  },
}: IItunesMusicCard) => {
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

export default ItunesMusicCard;
