import React, { useEffect, useState } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {
  IAlbum,
  IItunesArtist,
  IItunesArtistsResponse,
} from "../../interfaces";
import { itunes } from "../../axios";

interface IAlbumCard {
  album: IAlbum;
}
const AlbumCard: React.FC<IAlbumCard> = ({
  album: { title, itunes_collection_id: itunesCollectionId },
}: IAlbumCard) => {
  const [itunesAlbum, setItunesAlbum] = useState<IItunesArtist>();
  useEffect(() => {
    if (!itunesCollectionId) return;
    itunes
      .get<IItunesArtistsResponse>("/lookup", {
        params: { id: itunesCollectionId, entity: "album" },
      })
      .then((res) => setItunesAlbum(res.data.results[0]))
      .catch((err) => console.log(err));
  }, []);
  return (
    <Card>
      <CardContent>
        <Typography>{title}</Typography>
      </CardContent>
    </Card>
  );
};

export default AlbumCard;
