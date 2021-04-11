import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import GroupIcon from "@material-ui/icons/Group";
import ArtistDialog from "./Dialog/Artist";
import AlbumDialog from "./Dialog/Album";
import ArtistsTable from "../../../components/Table/Artist";
import MusicsTable from "../../../components/Table/Music";
import AlbumsTable from "../../../components/Table/Album";
import { IBand } from "../../../interfaces";

const Show: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [band, setBand] = useState<IBand>();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    setLoading(true);
    axios
      .get<IBand>(location.pathname)
      .then((res) => setBand(res.data))
      .catch((err) => enqueueSnackbar(String(err), { variant: "error" }))
      .finally(() => setLoading(false));
  }, []);
  return (
    <Container>
      <Typography variant="h5">
        <GroupIcon />
        {band?.name}
      </Typography>
      <Box mb={3}>
        <ArtistDialog band={band} setBand={setBand} />
        <ArtistsTable artists={band?.artists || []} loading={loading} />
      </Box>
      <Box mb={3}>
        <MusicsTable musics={band?.musics || []} loading={loading} />
      </Box>
      <Box mb={3}>
        <AlbumDialog band={band} setBand={setBand} />
        <AlbumsTable albums={band?.albums || []} loading={loading} />
      </Box>
    </Container>
  );
};

export default Show;
