import axios from "axios";
import React, { useEffect, useState } from "react";
import { useToggle } from "react-use";
import { useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import MusicsTable from "../../components/Table/Music";
import { IUser } from "../../interfaces";

const Show: React.FC = () => {
  const [user, setUser] = useState<IUser>();
  const [loading, toggleLoading] = useToggle(false);
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    toggleLoading();
    axios
      .get<IUser>(location.pathname)
      .then((res) => setUser(res.data))
      .catch((err) => enqueueSnackbar(String(err), { variant: "error" }))
      .finally(toggleLoading);
  }, []);
  return (
    <Container>
      <Typography variant="h5">{user?.nickname}</Typography>
      <MusicsTable musics={user?.musics || []} loading={loading} />
    </Container>
  );
};

export default Show;
