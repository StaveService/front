import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import MusicsTable from "../../components/Table/Music";
import DefaultLayout from "../../layout/Default";
import { IMusic } from "../../interfaces";
import { useQuerySnackbar } from "../../common/useQuerySnackbar";

const Index: React.FC = () => {
  const location = useLocation();
  const { onError } = useQuerySnackbar();
  const { isLoading, data } = useQuery<IMusic[]>(
    location.pathname.replace("/", ""),
    () => axios.get<IMusic[]>(location.pathname).then((res) => res.data),
    { onError }
  );
  return (
    <DefaultLayout>
      <MusicsTable musics={data || []} loading={isLoading} />
    </DefaultLayout>
  );
};

export default Index;
