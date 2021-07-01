import React from "react";
import { useQuery } from "react-query";
import AlbumTable from "../../components/Table/Album";
import DefaultLayout from "../../layout/Default";
import useQuerySnackbar from "../../hooks/useQuerySnackbar";
import queryKey from "../../constants/queryKey.json";
import usePaginate from "../../hooks/usePaginate";
import { getAlbums } from "../../gql";

const Index: React.FC = () => {
  const [page, handlePage] = usePaginate();
  const { onError } = useQuerySnackbar();
  const { isLoading, data } = useQuery(
    [queryKey.ALBUMS, page],
    getAlbums(page),
    { onError }
  );
  return (
    <DefaultLayout>
      <AlbumTable
        albums={data?.data}
        loading={isLoading}
        page={page}
        pageCount={data?.pagination.totalPages}
        onPage={handlePage}
      />
    </DefaultLayout>
  );
};

export default Index;
