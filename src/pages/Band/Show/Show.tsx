import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import ArtistDialog from "./Dialog/Artist";
import { IBand } from "../../../interfaces";
import routes from "../../../router/routes.json";
import ArtistsTable from "../../../components/Table/Artist";
import MusicsTable from "../../../components/Table/Music";
import AlbumsTable from "../../../components/Table/Album";

const Show: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [band, setBand] = useState<IBand>();
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams<{ id: string; userId: string }>();
  useEffect(() => {
    setLoading(true);
    axios
      .get<IBand>(`${routes.BANDS}/${params.id}`)
      .then((res) => setBand(res.data))
      .catch((err) => enqueueSnackbar(String(err), { variant: "error" }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container>
      <Typography variant="h3">{band?.name}</Typography>
      <Box mb={3}>
        <ArtistDialog band={band} setBand={setBand} />
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
