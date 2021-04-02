import React, { useEffect, useState } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { IArtist, IItunesArtist, IItunesResponse } from "../../interfaces";
import { itunes } from "../../axios";

interface IArtistCard {
  artist: IArtist;
}
const ArtistCard: React.FC<IArtistCard> = ({
  artist: { name, itunes_artist_id: itunesArtistId },
}: IArtistCard) => {
  const [itunesArtist, setItunesArtist] = useState<IItunesArtist>();
  useEffect(() => {
    if (!itunesArtistId) return;
    itunes
      .get<IItunesResponse<IItunesArtist>>("/lookup", {
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

export default ArtistCard;
