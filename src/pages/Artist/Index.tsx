import React, { useState } from "react";
import { useQuery } from "react-query";
import ArtistsTable from "../../components/Table/Artist";
import DefaultLayout from "../../layout/Default";
import { useQuerySnackbar } from "../../hooks/useQuerySnackbar";
import { graphQLClient } from "../../gql/client";
import { artistsQuery } from "../../gql/query/artists";
import queryKey from "../../constants/queryKey.json";
import { IArtistsType } from "../../interfaces";

const Index: React.FC = () => {
  const [page, setPage] = useState(1);
  const { onError } = useQuerySnackbar();
  const { isLoading, data } = useQuery<IArtistsType>(
    [queryKey.ARTISTS, page],
    () => graphQLClient.request(artistsQuery, { page }),
    { onError }
  );
  const handlePage = (event: React.ChangeEvent<unknown>, value: number) =>
    setPage(value);
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
