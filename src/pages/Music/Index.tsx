import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import MusicsTable from "../../components/Table/Music";
import DefaultLayout from "../../layout/Default";
import { IMusic } from "../../interfaces";
import queryKey from "../../gql/queryKey.json";
import { useQuerySnackbar } from "../../common/useQuerySnackbar";

const Index: React.FC = () => {
  const location = useLocation();
  const { onError } = useQuerySnackbar();
  const { isLoading, data } = useQuery<IMusic[]>(
    queryKey.MUSICS,
    () => axios.get<IMusic[]>(location.pathname).then((res) => res.data),
    { onError }
  );
  return (
    <DefaultLayout>
      <MusicsTable data={data} loading={isLoading} />
    </DefaultLayout>
  );
};

export default Index;
