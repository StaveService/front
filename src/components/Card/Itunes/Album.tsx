import React from "react";
import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import CardMedia from "@material-ui/core/CardMedia";
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
  album: { artistName, collectionName, artworkUrl100 },
}: IItunesAlbumCard) => {
  const classes = useStyles();
  return (
    <Card>
      <Box display="flex">
        <Box flex="1" overflow="hidden">
          <CardContent>
            <Typography>{collectionName}</Typography>
            <Typography>{artistName}</Typography>
          </CardContent>
        </Box>
        <Box display="flex" justifyItems="center" alignItems="center" mx={1}>
          <CardMedia image={artworkUrl100} className={classes.media} />
        </Box>
      </Box>
    </Card>
  );
};

export default ItunesAlbum;
