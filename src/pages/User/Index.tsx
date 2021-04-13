import axios from "axios";
import React, { useEffect, useState } from "react";
import { useToggle } from "react-use";
import { useSnackbar } from "notistack";
import Container from "@material-ui/core/Container";
import { useLocation } from "react-router-dom";
import UsersTable from "../../components/Table/User";
import { IUser } from "../../interfaces";

const Index: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, toggleLoading] = useToggle(false);
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    toggleLoading();
    axios
      .get<IUser[]>(location.pathname)
      .then((res) => setUsers(res.data))
      .catch((err) => enqueueSnackbar(String(err), { variant: "error" }))
      .finally(toggleLoading);
  }, []);

  return (
    <Container>
      <UsersTable users={users} loading={loading} />
    </Container>
  );
};

export default Index;
