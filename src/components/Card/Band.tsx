import React, { useEffect, useState } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { IBand, IItunesArtist, IItunesArtistsResponse } from "../../interfaces";
import { itunesAxios } from "../../constants/axios";

interface IBandCard {
  band: IBand;
}
const BandCard: React.FC<IBandCard> = ({
  band: { name, itunes_artist_id: itunesArtistId },
}: IBandCard) => {
  const [itunesArtist, setItunesArtist] = useState<IItunesArtist>();
  useEffect(() => {
    if (!itunesArtistId) return;
    itunesAxios
      .get<IItunesArtistsResponse>("/lookup", {
        params: { id: itunesArtistId, entity: "musicArtist" },
      })
      .then((res) => setItunesArtist(res.data.results[0]))
      .catch((err) => console.log(err));
  }, []);
  return (
    <Card>
      <CardContent>
        <Typography>{name}</Typography>
      </CardContent>
    </Card>
  );
};

export default BandCard;
