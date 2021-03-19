import Container from "@material-ui/core/Container";
import React from "react";
import MusicsTable from "../../components/Table/Music/Index";

const Index: React.FC = () => {
  return (
    <Container>
      <p>/musics</p>
      <MusicsTable />
    </Container>
  );
};

export default Index;
