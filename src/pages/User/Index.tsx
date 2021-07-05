import React from "react";
import { useQuery } from "react-query";
import UsersTable from "../../components/Table/User";
import DefaultLayout from "../../layout/Default";
import useQuerySnackbar from "../../hooks/useQuerySnackbar";
import queryKey from "../../constants/queryKey.json";
import usePaginate from "../../hooks/usePaginate";
import { getUsers } from "../../gql";

const Index: React.FC = () => {
  const [page, handlePage] = usePaginate();
  const { onError } = useQuerySnackbar();
  const { isLoading, data } = useQuery([queryKey.USERS, page], getUsers(page), {
    onError,
  });
  return (
    <DefaultLayout>
      <UsersTable
        users={data?.data}
        loading={isLoading}
        page={page}
        pageCount={data?.pagination.totalPages}
        onPage={handlePage}
      />
    </DefaultLayout>
  );
};

export default Index;
