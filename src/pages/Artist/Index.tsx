import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import Container from "@material-ui/core/Container";
import { useLocation } from "react-router-dom";
import ArtistsTable from "../../components/Table/Artist";
import { IArtist } from "../../interfaces";
import { useQuerySnackbar } from "../../common/useQuerySnackbar";

const Index: React.FC = () => {
  const location = useLocation();
  const { onError } = useQuerySnackbar();
  const { isLoading, data } = useQuery<IArtist[]>(
    location.pathname,
    () => axios.get<IArtist[]>(location.pathname).then((res) => res.data),
    { onError }
  );
  return (
    <Container>
      <ArtistsTable artists={data || []} loading={isLoading} />
    </Container>
  );
};

export default Index;
