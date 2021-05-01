import axios from "axios";
import { useQuery } from "react-query";
import React from "react";
import { useLocation } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import MusicsTable from "../../components/Table/Music";
import DefaultLayout from "../../layout/Default";
import { IUser } from "../../interfaces";
import { useQuerySnackbar } from "../../common/useQuerySnackbar";

const Show: React.FC = () => {
  const location = useLocation();
  const { onError } = useQuerySnackbar();
  const { isLoading, data } = useQuery<IUser>(
    location.pathname.replace("/", "").split("/"),
    () => axios.get<IUser>(location.pathname).then((res) => res.data),
    { onError }
  );
  return (
    <DefaultLayout>
      <Typography variant="h5">{data?.nickname}</Typography>
      <MusicsTable musics={data?.musics || []} loading={isLoading} />
    </DefaultLayout>
  );
};
export default Show;
