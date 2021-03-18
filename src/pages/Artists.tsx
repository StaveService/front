import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "@material-ui/core/Card";
import Container from "@material-ui/core/Container";
import { IArtist } from "../interfaces";

const Artists: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [artists, setArtists] = useState<IArtist[]>([]);
  useEffect(() => {
    setLoading(true);
    axios
      .get<IArtist[]>("/artists")
      .then((res) => setArtists(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);
  return (
    <Container>
      {artists.map((artist) => (
        <Card key={artist.id}>{artist.name}</Card>
      ))}
    </Container>
  );
};

export default Artists;
