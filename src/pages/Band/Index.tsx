import React from "react";
import { useQuery } from "react-query";
import BandsTable from "../../components/Table/Band";
import DefaultLayout from "../../layout/Default";
import useQuerySnackbar from "../../hooks/useQuerySnackbar";
import GraphQLClient from "../../gql/client";
import { bandsQuery } from "../../gql/query/bands";
import queryKey from "../../constants/queryKey.json";
import { IBandsType } from "../../interfaces";
import usePaginate from "../../hooks/usePaginate";

const Index: React.FC = () => {
  const [page, handlePage] = usePaginate();
  const { onError } = useQuerySnackbar();
  const { isLoading, data } = useQuery<IBandsType>(
    [queryKey.BANDS, page],
    () => GraphQLClient.request(bandsQuery, { page }),
    { onError }
  );
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
