import React, { useState } from "react";
import { useQuery } from "react-query";
import MusicsTable from "../../components/Table/Music";
import DefaultLayout from "../../layout/Default";
import queryKey from "../../gql/queryKey.json";
import { useQuerySnackbar } from "../../common/useQuerySnackbar";
import { musicsQuery } from "../../gql/query/musics";
import { graphQLClient } from "../../gql/client";
import { IMusicsType } from "../../interfaces";

const Index: React.FC = () => {
  const [page, setPage] = useState(1);
  const { onError } = useQuerySnackbar();
  const { isLoading, data } = useQuery<IMusicsType>(
    [queryKey.MUSICS, page],
    () => graphQLClient.request(musicsQuery, { page }),
    { onError }
  );
  const handlePage = (event: React.ChangeEvent<unknown>, value: number) =>
    setPage(value);
  return (
    <DefaultLayout>
      <MusicsTable
        data={data?.musics.data}
        loading={isLoading}
        page={page}
        pageCount={data?.musics.pagination.totalPages}
        onPage={handlePage}
      />
    </DefaultLayout>
  );
};
export default Index;
