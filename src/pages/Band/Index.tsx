import React, { useEffect, useState } from "react";
import Container from "@material-ui/core/Container";
import axios from "axios";
import BandsTable from "../../components/Table/Band/Index";
import { IBand } from "../../interfaces";

const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [bands, setBands] = useState<IBand[]>([]);
  useEffect(() => {
    setLoading(true);
    axios
      .get<IBand[]>("/bands")
      .then((res) => setBands(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);
  return (
    <Container>
      <p>/bands</p>
      <BandsTable bands={bands} loading={loading} />
    </Container>
  );
};

export default Index;
