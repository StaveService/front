import React, { useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import AlbumTable from "../../components/Table/Album";
import DefaultLayout from "../../layout/Default";
import { useQuerySnackbar } from "../../common/useQuerySnackbar";
import { graphQLClient } from "../../gql/client";
import { albumsQuery } from "../../gql/query/albums";
import { IAlbumsType } from "../../gql/types";

const Index: React.FC = () => {
  const [page, setPage] = useState(1);
  const location = useLocation();
  const { onError } = useQuerySnackbar();
  const { isLoading, data } = useQuery<IAlbumsType>(
    location.pathname.replace("/", ""),
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
