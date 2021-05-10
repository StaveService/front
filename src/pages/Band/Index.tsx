import React, { useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import BandsTable from "../../components/Table/Band";
import DefaultLayout from "../../layout/Default";
import { useQuerySnackbar } from "../../common/useQuerySnackbar";
import { graphQLClient } from "../../gql/client";
import { bandsQuery } from "../../gql/query/bands";
import { IBandsType } from "../../gql/types";

const Index: React.FC = () => {
  const [page, setPage] = useState(1);
  const location = useLocation();
  const { onError } = useQuerySnackbar();
  const { isLoading, data } = useQuery<IBandsType>(
    location.pathname.replace("/", ""),
    () => graphQLClient.request(bandsQuery, { page }),
    { onError }
  );
  const handlePage = (event: React.ChangeEvent<unknown>, value: number) =>
    setPage(value);
  return (
    <DefaultLayout>
      <BandsTable
        data={data?.bands.data}
        loading={isLoading}
        page={data?.bands.pagination.currentPage}
        pageCount={data?.bands.pagination.totalPages}
        onPage={handlePage}
      />
    </DefaultLayout>
  );
};
export default Index;
