import Container from "@material-ui/core/Container";
import React from "react";
import Grid from "@material-ui/core/Grid";
import MusicsTable from "../components/Table/Music/Index";
import MenuCard from "../components/Card/Menu";

const Root: React.FC = () => {
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
      <MusicsTable />
    </Container>
  );
};

export default Root;
