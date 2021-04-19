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
  const onError = (err: unknown) =>
    enqueueSnackbar(String(err), { variant: "error" });
  const { isLoading, data } = useQuery<IAlbum[]>(
    location.pathname.replace("/", ""),
    () => axios.get<IAlbum[]>(location.pathname).then((res) => res.data),
    { onError }
  );
  return (
    <Container>
      <AlbumTable albums={data || []} loading={isLoading} />
    </Container>
  );
};

export default Index;
