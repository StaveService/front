import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import Container from "@material-ui/core/Container";
import { useLocation } from "react-router-dom";
import UsersTable from "../../components/Table/User";
import { IUser } from "../../interfaces";
import { useQuerySnackbar } from "../../common/useQuerySnackbar";

const Index: React.FC = () => {
  const location = useLocation();
  const { onError } = useQuerySnackbar();
  const { isLoading, data } = useQuery<IUser[]>(
    location.pathname,
    () => axios.get<IUser[]>(location.pathname).then((res) => res.data),
    { onError }
  );
  return (
    <Container>
      <UsersTable users={data || []} loading={isLoading} />
    </Container>
  );
};

export default Index;
