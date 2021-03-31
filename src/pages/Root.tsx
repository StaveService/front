import Container from "@material-ui/core/Container";
import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import { Box } from "@material-ui/core";
import MusicsTable from "../components/Table/Music";
import MenuCard from "../components/Card/Menu";
import { IMusic } from "../interfaces";
import routes from "../router/routes.json";

const Root: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [musics, setMusics] = useState<IMusic[]>([]);
  useEffect(() => {
    setLoading(true);
    axios
      .get<IMusic[]>(routes.MUSICS)
      .then((res) => setMusics(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);
  return (
    <Container>
      <Box mb={3}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <MenuCard type="Music" />
          </Grid>
          <Grid item xs={3}>
            <MenuCard type="Album" />
          </Grid>
          <Grid item xs={3}>
            <MenuCard type="Artist" />
          </Grid>
          <Grid item xs={3}>
            <MenuCard type="Band" />
          </Grid>
        </Grid>
      </Box>
      <MusicsTable musics={musics} loading={loading} />
    </Container>
  );
};

export default Root;
