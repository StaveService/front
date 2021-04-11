import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import Container from "@material-ui/core/Container";
import { useLocation } from "react-router-dom";
import AlbumTable from "../../components/Table/Album";
import { IAlbum } from "../../interfaces";

const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [albums, setAlbums] = useState<IAlbum[]>([]);
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    setLoading(true);
    axios
      .get<IAlbum[]>(location.pathname)
      .then((res) => setAlbums(res.data))
      .catch((err) => enqueueSnackbar(String(err), { variant: "error" }))
      .finally(() => setLoading(false));
  }, []);
  return (
    <Container>
      <AlbumTable albums={albums} loading={loading} />
    </Container>
  );
};

export default Index;
