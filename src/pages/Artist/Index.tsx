import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import { useSnackbar } from "notistack";
import Container from "@material-ui/core/Container";
import { useLocation } from "react-router-dom";
import ArtistsTable from "../../components/Table/Artist";
import { IArtist } from "../../interfaces";

const Index: React.FC = () => {
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const handleError = (err: unknown) =>
    enqueueSnackbar(String(err), { variant: "error" });
  const { isLoading, data } = useQuery<IArtist[]>(
    location.pathname,
    () => axios.get<IArtist[]>(location.pathname).then((res) => res.data),
    { onError: handleError }
  );
  return (
    <Container>
      <ArtistsTable artists={data || []} loading={isLoading} />
    </Container>
  );
};

export default Index;
