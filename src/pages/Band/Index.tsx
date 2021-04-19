import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import Container from "@material-ui/core/Container";
import BandsTable from "../../components/Table/Band";
import { IBand } from "../../interfaces";

const Index: React.FC = () => {
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const onError = (err: unknown) =>
    enqueueSnackbar(String(err), { variant: "error" });
  const { isLoading, data } = useQuery<IBand[]>(
    location.pathname.replace("/", ""),
    () => axios.get<IBand[]>(location.pathname).then((res) => res.data),
    { onError }
  );
  return (
    <Container>
      <BandsTable bands={data || []} loading={isLoading} />
    </Container>
  );
};
export default Index;
