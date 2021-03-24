import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { IAlbum } from "../../interfaces";
import routes from "../../router/routes.json";
import MusicsTable from "../../components/Table/Music";

const Show: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [album, setAlbum] = useState<IAlbum>();
  const params = useParams<{ id: string }>();
  useEffect(() => {
    setLoading(true);
    axios
      .get<IAlbum>(`${routes.ALBUMS}/${params.id}`)
      .then((res) => setAlbum(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);
  return (
    <Container>
      <Typography variant="h3">{album?.title}</Typography>
      <MusicsTable musics={album?.musics || []} loading={loading} />
    </Container>
  );
};

export default Show;
