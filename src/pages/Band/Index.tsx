import React, { useState } from "react";
import { useQuery } from "react-query";
import BandsTable from "../../components/Table/Band";
import DefaultLayout from "../../layout/Default";
import useQuerySnackbar from "../../hooks/useQuerySnackbar";
import { graphQLClient } from "../../gql/client";
import { bandsQuery } from "../../gql/query/bands";
import queryKey from "../../constants/queryKey.json";
import { IBandsType } from "../../interfaces";

const Index: React.FC = () => {
  const [page, setPage] = useState(1);
  const { onError } = useQuerySnackbar();
  const { isLoading, data } = useQuery<IBandsType>(
    [queryKey.BANDS, page],
    () => graphQLClient.request(bandsQuery, { page }),
    { onError }
  );
  const handlePage = (event: React.ChangeEvent<unknown>, value: number) =>
    setPage(value);
  return (
    <DefaultLayout>
      <BandsTable
        bands={data?.bands?.data}
        loading={isLoading}
        page={page}
        pageCount={data?.bands?.pagination.totalPages}
        onPage={handlePage}
      />
    </DefaultLayout>
  );
};
export default Index;
