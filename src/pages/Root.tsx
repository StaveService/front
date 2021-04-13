import axios from "axios";
import React, { useEffect, useState } from "react";
import { useToggle } from "react-use";
import { useSnackbar } from "notistack";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import MusicsTable from "../components/Table/Music";
import MenuCard from "../components/Card/Menu";
import { IMusic } from "../interfaces";
import routes from "../router/routes.json";

const Root: React.FC = () => {
  const [loading, toggleLoading] = useToggle(false);
  const [musics, setMusics] = useState<IMusic[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    toggleLoading();
    axios
      .get<IMusic[]>(routes.MUSICS)
      .then((res) => setMusics(res.data))
      .catch((err) => enqueueSnackbar(String(err), { variant: "error" }))
      .finally(toggleLoading);
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
