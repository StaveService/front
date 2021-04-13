import axios from "axios";
import React, { useEffect, useState } from "react";
import { useToggle } from "react-use";
import { useSnackbar } from "notistack";
import Container from "@material-ui/core/Container";
import { useLocation } from "react-router-dom";
import ArtistsTable from "../../components/Table/Artist";
import { IArtist } from "../../interfaces";

const Index: React.FC = () => {
  const [loading, toggleLoading] = useToggle(false);
  const [artists, setArtists] = useState<IArtist[]>([]);
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    toggleLoading();
    axios
      .get<IArtist[]>(location.pathname)
      .then((res) => setArtists(res.data))
      .catch((err) => enqueueSnackbar(String(err), { variant: "error" }))
      .finally(toggleLoading);
  }, []);

  return (
    <Container>
      <ArtistsTable artists={artists} loading={loading} />
    </Container>
  );
};

export default Index;
