import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import MusicsTable from "../../components/Table/Music";
import { IUser } from "../../interfaces";
import routes from "../../router/routes.json";

const Show: React.FC = () => {
  const [user, setUser] = useState<IUser>();
  const [loading, setLoading] = useState(false);
  const params = useParams<{ id: string }>();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    setLoading(true);
    axios
      .get<IUser>(`${routes.USERS}/${params.id}`)
      .then((res) => setUser(res.data))
      .catch((err) => enqueueSnackbar(String(err), { variant: "error" }))
      .finally(() => setLoading(false));
  }, []);
  if (!user?.id) return <CircularProgress />;
  return (
    <Container>
      <Typography variant="h3">{user.nickname}</Typography>
      <MusicsTable musics={user.musics || []} loading={loading} />
    </Container>
  );
};

export default Show;
