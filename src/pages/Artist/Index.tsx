import React, { useState } from "react";
import { useQuery } from "react-query";
import ArtistsTable from "../../components/Table/Artist";
import DefaultLayout from "../../layout/Default";
import { useQuerySnackbar } from "../../common/useQuerySnackbar";
import { graphQLClient } from "../../gql/client";
import { artistsQuery } from "../../gql/query/artists";
import { IArtistsType } from "../../gql/types";
import queryKey from "../../gql/queryKey.json";

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
        data={data?.artists.data}
        loading={isLoading}
        page={page}
        pageCount={data?.artists.pagination.totalPages}
        onPage={handlePage}
      />
    </DefaultLayout>
  );
};

export default Index;
