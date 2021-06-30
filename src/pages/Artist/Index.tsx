import React from "react";
import { useQuery } from "react-query";
import ArtistsTable from "../../components/Table/Artist";
import DefaultLayout from "../../layout/Default";
import useQuerySnackbar from "../../hooks/useQuerySnackbar";
import GraphQLClient from "../../gql/client";
import { artistsQuery } from "../../gql/query/artists";
import queryKey from "../../constants/queryKey.json";
import { IArtistsType } from "../../interfaces";
import usePaginate from "../../hooks/usePaginate";

const Index: React.FC = () => {
  const [page, handlePage] = usePaginate();
  const { onError } = useQuerySnackbar();
  const { isLoading, data } = useQuery<IArtistsType>(
    [queryKey.ARTISTS, page],
    () => GraphQLClient.request(artistsQuery, { page }),
    { onError }
  );
  return (
    <DefaultLayout>
      <ArtistsTable
        artists={data?.artists?.data}
        loading={isLoading}
        page={page}
        pageCount={data?.artists?.pagination.totalPages}
        onPage={handlePage}
      />
    </DefaultLayout>
  );
};

export default Index;
