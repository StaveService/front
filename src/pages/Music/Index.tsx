import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import { useSnackbar } from "notistack";
import Container from "@material-ui/core/Container";
import { useLocation } from "react-router-dom";
import MusicsTable from "../../components/Table/Music";
import { IMusic } from "../../interfaces";

const Index: React.FC = () => {
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const handleError = (err: unknown) =>
    enqueueSnackbar(String(err), { variant: "error" });
  const { isLoading, data } = useQuery<IMusic[]>(
    location.pathname,
    () => axios.get<IMusic[]>(location.pathname).then((res) => res.data),
    { onError: handleError }
  );
  return (
    <Container>
      <MusicsTable musics={data || []} loading={isLoading} />
    </Container>
  );
};

export default Index;
