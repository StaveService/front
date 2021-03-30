import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import LinearProgress from "@material-ui/core/LinearProgress";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { IArtist } from "../../interfaces";
import routes from "../../router/routes.json";
import MusicsTable from "../../components/Table/Music";
import BandsTable from "../../components/Table/Band";
import AlbumsTable from "../../components/Table/Album";

const Show: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [artist, setArtist] = useState<IArtist>();
  const params = useParams<{ id: string }>();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${routes.ARTISTS}/${params.id}`)
      .then((res) => setArtist(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [params]);

  return (
    <Container>
      <Typography variant="h3">{artist?.name}</Typography>

      <Box pb={3}>
        <BandsTable bands={artist?.bands || []} loading={loading} />
      </Box>
      <Box pb={3}>
        <AlbumsTable albums={artist?.albums || []} loading={loading} />
      </Box>

      <MusicsTable musics={artist?.musics || []} loading={loading} />
    </Container>
  );
};

export default Show;
