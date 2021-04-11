import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import Container from "@material-ui/core/Container";
import axios from "axios";
import { useLocation } from "react-router-dom";
import BandsTable from "../../components/Table/Band";
import { IBand } from "../../interfaces";

const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [bands, setBands] = useState<IBand[]>([]);
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    setLoading(true);
    axios
      .get<IBand[]>(location.pathname)
      .then((res) => setBands(res.data))
      .catch((err) => enqueueSnackbar(String(err), { variant: "error" }))
      .finally(() => setLoading(false));
  }, []);
  return (
    <Container>
      <BandsTable bands={bands} loading={loading} />
    </Container>
  );
};

export default Index;
