import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import Container from "@material-ui/core/Container";
import { useLocation } from "react-router-dom";
import MusicsTable from "../../components/Table/Music";
import { IMusic } from "../../interfaces";
import { useQuerySnackbar } from "../../common/useQuerySnackbar";

const Index: React.FC = () => {
  const location = useLocation();
  const { onError } = useQuerySnackbar();
  const { isLoading, data } = useQuery<IMusic[]>(
    location.pathname.replace("/", ""),
    () => axios.get<IMusic[]>(location.pathname).then((res) => res.data),
    { onError }
  );
  return (
    <Container>
      <MusicsTable musics={data || []} loading={isLoading} />
    </Container>
  );
};

export default Index;
