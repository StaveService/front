import React from "react";
import { useQuery } from "react-query";
import UsersTable from "../../components/Table/User";
import DefaultLayout from "../../layout/Default";
import useQuerySnackbar from "../../hooks/useQuerySnackbar";
import GraphQLClient from "../../gql/client";
import { usersQuery } from "../../gql/query/users";
import queryKey from "../../constants/queryKey.json";
import { IUsersType } from "../../interfaces";
import usePaginate from "../../hooks/usePaginate";

const Index: React.FC = () => {
  const [page, handlePage] = usePaginate();
  const { onError } = useQuerySnackbar();
  const { isLoading, data } = useQuery<IUsersType>(
    [queryKey.USERS, page],
    () => GraphQLClient.request(usersQuery, { page }),
    { onError }
  );
  return (
    <DefaultLayout>
      <UsersTable
        data={data?.users.data}
        loading={isLoading}
        page={page}
        pageCount={data?.users.pagination.totalPages}
        onPage={handlePage}
      />
    </DefaultLayout>
  );
};

export default Index;
