import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import Container from "@material-ui/core/Container";
import { useLocation } from "react-router-dom";
import ArtistsTable from "../../components/Table/Artist";
import { IArtist } from "../../interfaces";

const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [artists, setArtists] = useState<IArtist[]>([]);
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    setLoading(true);
    axios
      .get<IArtist[]>(location.pathname)
      .then((res) => setArtists(res.data))
      .catch((err) => enqueueSnackbar(String(err), { variant: "error" }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container>
      <ArtistsTable artists={artists} loading={loading} />
    </Container>
  );
};

export default Index;
