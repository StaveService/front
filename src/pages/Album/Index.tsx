import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import { useSnackbar } from "notistack";
import Container from "@material-ui/core/Container";
import { useLocation } from "react-router-dom";
import AlbumTable from "../../components/Table/Album";
import { IAlbum } from "../../interfaces";

const Index: React.FC = () => {
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const handleError = (err: unknown) =>
    enqueueSnackbar(String(err), { variant: "error" });
  const { isLoading, data } = useQuery<IAlbum[]>(
    location.pathname,
    () => axios.get<IAlbum[]>(location.pathname).then((res) => res.data),
    { onError: handleError }
  );
  return (
    <Container>
      <AlbumTable albums={data || []} loading={isLoading} />
    </Container>
  );
};

export default Index;
