import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import Container from "@material-ui/core/Container";
import axios from "axios";
import { useLocation } from "react-router-dom";
import UsersTable from "../../components/Table/User";
import { IUser } from "../../interfaces";

const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    setLoading(true);
    axios
      .get<IUser[]>(location.pathname)
      .then((res) => setUsers(res.data))
      .catch((err) => enqueueSnackbar(String(err), { variant: "error" }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container>
      <UsersTable users={users} loading={loading} />
    </Container>
  );
};

export default Index;
