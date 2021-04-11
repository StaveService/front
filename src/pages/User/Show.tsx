import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import MusicsTable from "../../components/Table/Music";
import { IUser } from "../../interfaces";

const Show: React.FC = () => {
  const [user, setUser] = useState<IUser>();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    setLoading(true);
    axios
      .get<IUser>(location.pathname)
      .then((res) => setUser(res.data))
      .catch((err) => enqueueSnackbar(String(err), { variant: "error" }))
      .finally(() => setLoading(false));
  }, []);
  if (!user?.id) return <CircularProgress />;
  return (
    <Container>
      <Typography variant="h5">{user.nickname}</Typography>
      <MusicsTable musics={user.musics || []} loading={loading} />
    </Container>
  );
};

export default Show;
