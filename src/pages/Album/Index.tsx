import React, { useState } from "react";
import { useQuery } from "react-query";
import AlbumTable from "../../components/Table/Album";
import DefaultLayout from "../../layout/Default";
import { useQuerySnackbar } from "../../common/useQuerySnackbar";
import { graphQLClient } from "../../gql/client";
import { albumsQuery } from "../../gql/query/albums";
import { IAlbumsType } from "../../interfaces";
import queryKey from "../../gql/queryKey.json";

const Index: React.FC = () => {
  const [page, setPage] = useState(1);
  const { onError } = useQuerySnackbar();
  const { isLoading, data } = useQuery<IAlbumsType>(
    [queryKey.ALBUMS, page],
    () => graphQLClient.request(albumsQuery, { page }),
    { onError }
  );
  const handlePage = (event: React.ChangeEvent<unknown>, value: number) =>
    setPage(value);
  return (
    <DefaultLayout>
      <AlbumTable
        data={data?.albums.data}
        loading={isLoading}
        page={page}
        pageCount={data?.albums.pagination.totalPages}
        onPage={handlePage}
      />
    </DefaultLayout>
  );
};

export default Index;
