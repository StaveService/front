import axios from "axios";
import React, { useEffect, useState } from "react";
import { useToggle } from "react-use";
import { useSnackbar } from "notistack";
import Container from "@material-ui/core/Container";
import { useLocation } from "react-router-dom";
import MusicsTable from "../../components/Table/Music";
import { IMusic } from "../../interfaces";

const Index: React.FC = () => {
  const [loading, toggleLoading] = useToggle(false);
  const [musics, setMusics] = useState<IMusic[]>([]);
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    toggleLoading();
    axios
      .get<IMusic[]>(location.pathname)
      .then((res) => setMusics(res.data))
      .catch((err) => enqueueSnackbar(String(err), { variant: "error" }))
      .finally(toggleLoading);
  }, []);
  return (
    <Container>
      <MusicsTable musics={musics} loading={loading} />
    </Container>
  );
};

export default Index;
