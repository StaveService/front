import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import AlbumTable from "../../components/Table/Album";
import DefaultLayout from "../../layout/Default";
import { IAlbum } from "../../interfaces";
import { useQuerySnackbar } from "../../common/useQuerySnackbar";

const Index: React.FC = () => {
  const location = useLocation();
  const { onError } = useQuerySnackbar();
  const { isLoading, data } = useQuery<IAlbum[]>(
    location.pathname.replace("/", ""),
    () => axios.get<IAlbum[]>(location.pathname).then((res) => res.data),
    { onError }
  );
  return (
    <DefaultLayout>
      <AlbumTable albums={data || []} loading={isLoading} />
    </DefaultLayout>
  );
};

export default Index;
