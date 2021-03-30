import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import { IBand } from "../../interfaces";
import routes from "../../router/routes.json";
import ArtistsTable from "../../components/Table/Artist";
import MusicsTable from "../../components/Table/Music";
import AlbumsTable from "../../components/Table/Album";

const Show: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [band, setBand] = useState<IBand>();
  const params = useParams<{ id: string; userId: string }>();
  useEffect(() => {
    setLoading(true);
    axios
      .get<IBand>(`${routes.BANDS}/${params.id}`)
      .then((res) => setBand(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container>
      <Typography variant="h3">{band?.name}</Typography>
      <Box mb={3}>
        <ArtistsTable artists={band?.artists || []} loading={loading} />
      </Box>
      <Box mb={3}>
        <MusicsTable musics={band?.musics || []} loading={loading} />
      </Box>
      <Box mb={3}>
        <AlbumsTable albums={band?.albums || []} loading={loading} />
      </Box>
    </Container>
  );
};

export default Show;
