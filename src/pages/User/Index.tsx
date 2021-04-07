import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import Container from "@material-ui/core/Container";
import axios from "axios";
import UsersTable from "../../components/Table/User";
import { IUser } from "../../interfaces";
import routes from "../../router/routes.json";

const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    setLoading(true);
    axios
      .get<IUser[]>(routes.USERS)
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
