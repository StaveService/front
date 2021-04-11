import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import Container from "@material-ui/core/Container";
import { useLocation } from "react-router-dom";
import MusicsTable from "../../components/Table/Music";
import { IMusic } from "../../interfaces";

const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [musics, setMusics] = useState<IMusic[]>([]);
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    setLoading(true);
    axios
      .get<IMusic[]>(location.pathname)
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
