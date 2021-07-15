import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { IBand } from "../../interfaces";

interface IBandCard {
  band: IBand;
}
const BandCard: React.FC<IBandCard> = ({ band: { name } }: IBandCard) => {
  return (
    <Card>
      <CardContent>
        <Typography>{name}</Typography>
      </CardContent>
    </Card>
  );
};

export default BandCard;
