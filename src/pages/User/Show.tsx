import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { IUser } from "../../interfaces";

const Show: React.FC = () => {
  const [user, setUser] = useState<IUser>();
  const params = useParams<{ id: string }>();
  useEffect(() => {
    axios
      .get<IUser>(`/users/${params.id}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.log(err));
  }, []);
  if (!user?.id) return <CircularProgress />;
  return <p>{user.nickname}</p>;
};

export default Show;
