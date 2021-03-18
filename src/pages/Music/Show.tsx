import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IMusic } from "../../interfaces";

const Show: React.FC = () => {
  const [music, setMusic] = useState<IMusic>();
  const params = useParams<{ id: string; userId: string }>();
  useEffect(() => {
    axios
      .get<IMusic>(`/users/${params.userId}/musics/${params.id}`)
      .then((res) => setMusic(res.data))
      .catch((err) => console.log(err));
  }, []);
  if (!music?.id) return <CircularProgress />;
  return <p>{music.title}</p>;
};

export default Show;
