import React, { MouseEvent } from "react";
import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import { IItunesAlbum } from "../../../interfaces";

const useStyles = makeStyles({
  media: {
    height: 100,
    width: 100,
  },
});
interface IItunesAlbumCard {
  album: IItunesAlbum;
}
const ItunesAlbum: React.FC<IItunesAlbumCard> = ({
  album: { artistName, collectionName, artworkUrl100, artistViewUrl },
}: IItunesAlbumCard) => {
  const classes = useStyles();
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => e.stopPropagation();
  return (
    <Card>
      <Box display="flex">
        <Box mx={1}>
          <CardMedia image={artworkUrl100} className={classes.media} />
        </Box>
        <CardContent>
          <Typography>{collectionName}</Typography>
          <Typography>{artistName}</Typography>
        </CardContent>
        <Button
          href={artistViewUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
        >
          itunes
        </Button>
      </Box>
    </Card>
  );
};

export default ItunesAlbum;
