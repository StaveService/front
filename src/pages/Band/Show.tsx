import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import { IBand } from "../../interfaces";

const Show: React.FC = () => {
  const [band, setBand] = useState<IBand>();
  const params = useParams<{ id: string }>();
  useEffect(() => {
    axios
      .get<IBand>(`/bands/${params.id}`)
      .then((res) => setBand(res.data))
      .catch((err) => console.log(err));
  }, []);
  if (!band?.id) return <CircularProgress />;
  return <p>{band.name}</p>;
};

export default Show;
