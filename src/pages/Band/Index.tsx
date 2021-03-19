import React from "react";
import Container from "@material-ui/core/Container";
import BandsTable from "../../components/Table/Band/Index";

const Index: React.FC = () => {
  return (
    <Container>
      <p>/bands</p>
      <BandsTable />
    </Container>
  );
};

export default Index;
