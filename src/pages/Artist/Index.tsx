import React from "react";
import { useQuery } from "react-query";
import ArtistsTable from "../../components/Table/Artist";
import DefaultLayout from "../../layout/Default";
import useQuerySnackbar from "../../hooks/useQuerySnackbar";
import queryKey from "../../constants/queryKey.json";
import usePaginate from "../../hooks/usePaginate";
import { getArtists } from "../../gql";

const Index: React.FC = () => {
  const [page, handlePage] = usePaginate();
  const { onError } = useQuerySnackbar();
  const { isLoading, data } = useQuery(
    [queryKey.ARTISTS, page],
    getArtists(page),
    { onError }
  );
  return (
    <DefaultLayout>
      <ArtistsTable
        artists={data?.data}
        loading={isLoading}
        page={page}
        pageCount={data?.pagination.totalPages}
        onPage={handlePage}
      />
    </DefaultLayout>
  );
};

export default Index;
