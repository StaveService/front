import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import Container from "@material-ui/core/Container";
import axios from "axios";
import BandsTable from "../../components/Table/Band";
import { IBand } from "../../interfaces";
import routes from "../../router/routes.json";

const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [bands, setBands] = useState<IBand[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    setLoading(true);
    axios
      .get<IBand[]>(routes.BANDS)
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
