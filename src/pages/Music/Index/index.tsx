import React, { useState } from "react";
import { useQuery } from "react-query";
import MusicsTable from "../../../components/Table/Music";
import DefaultLayout from "../../../layout/Default";
import queryKey from "../../../constants/queryKey.json";
import useQuerySnackbar from "../../../hooks/useQuerySnackbar";
import query from "./gql";
import GraphQLClient from "../../../gql/client";
import { IMusicsType } from "../../../interfaces";

const Index: React.FC = () => {
  const [page, setPage] = useState(1);
  const { onError } = useQuerySnackbar();
  const { isLoading, data } = useQuery<IMusicsType>(
    [queryKey.MUSICS, page],
    () => GraphQLClient.request(query, { page }),
    { onError }
  );
  const handlePage = (_event: React.ChangeEvent<unknown>, value: number) =>
    setPage(value);
  return (
    <DefaultLayout>
      <MusicsTable
        musics={data?.musics?.data}
        loading={isLoading}
        page={page}
        pageCount={data?.musics?.pagination.totalPages}
        onPage={handlePage}
      />
    </DefaultLayout>
  );
};
export default Index;
