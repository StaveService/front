import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Image from "material-ui-image";
import { IAlbum, IItunesAlbum, IItunesAlbumsResponse } from "../../interfaces";
import routes from "../../router/routes.json";
import MusicsTable from "../../components/Table/Music";
import { itunes } from "../../axios";

const Show: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [album, setAlbum] = useState<IAlbum>();
  const [itunesMusic, setItunesMusic] = useState<IItunesAlbum>();
  const params = useParams<{ id: string }>();
  useEffect(() => {
    setLoading(true);
    axios
      .get<IAlbum>(`${routes.ALBUMS}/${params.id}`)
      .then((res) => setAlbum(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    if (album) {
      itunes
        .get<IItunesAlbumsResponse>("/lookup", {
          params: { id: album.itunes_collection_id, entity: "album" },
        })
        .then((res) => setItunesMusic(res.data.results[0]))
        .catch((err) => console.log(err));
    }
  }, [album]);
  return (
    <Container>
      <Typography variant="h3">{album?.title}</Typography>
      <Box height="100px" width="100px" m="auto">
        <Image src={itunesMusic?.artworkUrl100 || "undefiend"} />
      </Box>
      <MusicsTable musics={album?.musics || []} loading={loading} />
    </Container>
  );
};

export default Show;
