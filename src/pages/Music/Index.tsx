import Container from "@material-ui/core/Container";
import axios from "axios";
import React, { useEffect, useState } from "react";
import MusicsTable from "../../components/Table/Music/Index";
import { IMusic } from "../../interfaces";

const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [musics, setMusics] = useState<IMusic[]>([]);
  useEffect(() => {
    setLoading(true);
    axios
      .get<IMusic[]>("/musics")
      .then((res) => setMusics(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);
  return (
    <Container>
      <p>/musics</p>
      <MusicsTable musics={musics} loading={loading} />
    </Container>
  );
};

export default Index;
