import React, { useEffect, useState } from "react";
import Container from "@material-ui/core/Container";
import axios from "axios";
import ArtistsTable from "../../components/Table/Artist/Index";
import { IArtist } from "../../interfaces";
import routes from "../../router/routes.json";

const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [artists, setArtists] = useState<IArtist[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  useEffect(() => {
    setLoading(true);
    axios
      .get<IArtist[]>(routes.ARTISTS)
      .then((res) => setArtists(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container>
      <ArtistsTable artists={artists} loading={loading} />
    </Container>
  );
};

export default Index;
