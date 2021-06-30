import React from "react";
import { useQuery } from "react-query";
import AlbumTable from "../../components/Table/Album";
import DefaultLayout from "../../layout/Default";
import useQuerySnackbar from "../../hooks/useQuerySnackbar";
import GraphQLClient from "../../gql/client";
import { albumsQuery } from "../../gql/query/albums";
import { IAlbumsType } from "../../interfaces";
import queryKey from "../../constants/queryKey.json";
import usePaginate from "../../hooks/usePaginate";

const Index: React.FC = () => {
  const [page, handlePage] = usePaginate();
  const { onError } = useQuerySnackbar();
  const { isLoading, data } = useQuery<IAlbumsType>(
    [queryKey.ALBUMS, page],
    () => GraphQLClient.request(albumsQuery, { page }),
    { onError }
  );
  return (
    <DefaultLayout>
      <AlbumTable
        albums={data?.albums?.data}
        loading={isLoading}
        page={page}
        pageCount={data?.albums?.pagination.totalPages}
        onPage={handlePage}
      />
    </DefaultLayout>
  );
};

export default Index;
