import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import AccessibilityNewIcon from "@material-ui/icons/AccessibilityNew";
import { IArtist } from "../../interfaces";
import MusicsTable from "../../components/Table/Music";
import BandsTable from "../../components/Table/Band";
import AlbumsTable from "../../components/Table/Album";

const Show: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [artist, setArtist] = useState<IArtist>();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setLoading(true);
    axios
      .get(location.pathname)
      .then((res) => setArtist(res.data))
      .catch((err) => enqueueSnackbar(String(err), { variant: "error" }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container>
      <Typography variant="h5">
        <AccessibilityNewIcon />
        {artist?.name}
      </Typography>

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
