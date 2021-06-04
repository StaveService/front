import React, { MouseEvent } from "react";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
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
    trackViewUrl,
  },
}: IItunesMusicCard) => {
  const classes = useStyles();
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => e.stopPropagation();
  return (
    <Card>
      <Box display="flex">
        <Box display="flex" justifyItems="center" alignItems="center" mx={1}>
          <CardMedia image={artworkUrl100} className={classes.media} />
        </Box>
        <CardContent>
          <Typography noWrap>{trackCensoredName}</Typography>
          <Typography color="textSecondary" noWrap>
            {artistName}
          </Typography>
          <Typography color="textSecondary" noWrap>
            {collectionCensoredName}
          </Typography>
          <Button
            href={trackViewUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
          >
            itunes
          </Button>
        </CardContent>
      </Box>
    </Card>
  );
};

export default ItunesMusicCard;
