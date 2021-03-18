import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IArtist } from "../../interfaces";

const Show: React.FC = () => {
  const [artist, setArtist] = useState<IArtist>();
  const params = useParams<{ id: string }>();
  useEffect(() => {
    axios
      .get(`/artists/${params.id}`)
      .then((res) => setArtist(res.data))
      .catch((err) => console.log(err));
  }, []);
  if (!artist?.id) return <CircularProgress />;
  return <p>{artist.name}</p>;
};

export default Show;
