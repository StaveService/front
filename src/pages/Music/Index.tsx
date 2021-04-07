import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import Container from "@material-ui/core/Container";
import MusicsTable from "../../components/Table/Music";
import { IMusic } from "../../interfaces";
import routes from "../../router/routes.json";

const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [musics, setMusics] = useState<IMusic[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    setLoading(true);
    axios
      .get<IMusic[]>(routes.MUSICS)
      .then((res) => setMusics(res.data))
      .catch((err) => enqueueSnackbar(String(err), { variant: "error" }))
      .finally(() => setLoading(false));
  }, []);
  return (
    <Container>
      <MusicsTable musics={musics} loading={loading} />
    </Container>
  );
};

export default Index;
