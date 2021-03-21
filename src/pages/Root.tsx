import Container from "@material-ui/core/Container";
import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import MusicsTable from "../components/Table/Music/Index";
import MenuCard from "../components/Card/Menu";
import { IMusic } from "../interfaces";

const Root: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [musics, setMusics] = useState<IMusic[]>([]);
  useEffect(() => {
    setLoading(true);
    axios
      .get<IMusic[]>("/musics")
      .then((res) => setMusics(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);
  return (
    <Container>
      <p>/</p>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <MenuCard type="Album" />
        </Grid>
        <Grid item xs={3}>
          <MenuCard type="Artist" />
        </Grid>
        <Grid item xs={3}>
          <MenuCard type="Band" />
        </Grid>
        <Grid item xs={3}>
          <MenuCard type="Music" />
        </Grid>
      </Grid>
      <MusicsTable musics={musics} loading={loading} />
    </Container>
  );
};

export default Root;
