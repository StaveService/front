import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { IArtist } from "../../interfaces";

interface IArtistCard {
  artist: IArtist;
}
const ArtistCard: React.FC<IArtistCard> = ({
  artist: { name },
}: IArtistCard) => {
  return (
    <Card>
      <CardContent>
        <Typography>{name}</Typography>
      </CardContent>
    </Card>
  );
};

export default ArtistCard;
