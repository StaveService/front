import Container from "@material-ui/core/Container";
import React from "react";
import MusicTable from "../components/Table/Music";

const Root: React.FC = () => {
  return (
    <Container>
      <p>home</p>
      <MusicTable />
    </Container>
  );
};

export default Root;
