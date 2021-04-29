import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { IAlbum } from "../../interfaces";

interface IAlbumCard {
  album: IAlbum;
}
const AlbumCard: React.FC<IAlbumCard> = ({ album: { title } }: IAlbumCard) => {
  return (
    <Card>
      <CardContent>
        <Typography>{title}</Typography>
      </CardContent>
    </Card>
  );
};

export default AlbumCard;
