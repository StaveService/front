import axios from "axios";
import { useQuery } from "react-query";
import React from "react";
import { useLocation } from "react-router-dom";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import MusicsTable from "../../components/Table/Music";
import { IUser } from "../../interfaces";
import { useQuerySnackbar } from "../../common/useQuerySnackbar";

const Show: React.FC = () => {
  const location = useLocation();
  const { onError } = useQuerySnackbar();
  const { isLoading, data } = useQuery<IUser>(
    location.pathname.replace("/", "").split("/"),
    () => axios.get<IUser>(location.pathname).then((res) => res.data),
    { onError }
  );
  return (
    <Container>
      <Typography variant="h5">{data?.nickname}</Typography>
      <MusicsTable musics={data?.musics || []} loading={isLoading} />
    </Container>
  );
};
export default Show;
