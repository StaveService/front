import Container from "@material-ui/core/Container";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AlbumTable from "../../components/Table/Album";
import { IAlbum } from "../../interfaces";
import routes from "../../router/routes.json";

const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [albums, setAlbums] = useState<IAlbum[]>([]);
  useEffect(() => {
    setLoading(true);
    axios
      .get<IAlbum[]>(routes.ALBUMS)
      .then((res) => setAlbums(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);
  return (
    <Container>
      <AlbumTable albums={albums} loading={loading} />
    </Container>
  );
};

export default Index;
