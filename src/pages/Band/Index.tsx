import axios from "axios";
import React, { useEffect, useState } from "react";
import { useToggle } from "react-use";
import { useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import Container from "@material-ui/core/Container";
import BandsTable from "../../components/Table/Band";
import { IBand } from "../../interfaces";

const Index: React.FC = () => {
  const [loading, toggleLoading] = useToggle(false);
  const [bands, setBands] = useState<IBand[]>([]);
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    toggleLoading();
    axios
      .get<IBand[]>(location.pathname)
      .then((res) => setBands(res.data))
      .catch((err) => enqueueSnackbar(String(err), { variant: "error" }))
      .finally(toggleLoading);
  }, []);
  return (
    <Container>
      <BandsTable bands={bands} loading={loading} />
    </Container>
  );
};

export default Index;
