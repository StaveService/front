import React from "react";
import Container from "@material-ui/core/Container";
import UsersTable from "../../components/Table/User/Index";

const Index: React.FC = () => {
  return (
    <Container>
      <p>/users</p>
      <UsersTable />
    </Container>
  );
};

export default Index;
