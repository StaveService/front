import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import UsersTable from "../../components/Table/User";
import DefaultLayout from "../../layout/Default";
import { IUser } from "../../interfaces";
import { useQuerySnackbar } from "../../common/useQuerySnackbar";

const Index: React.FC = () => {
  const location = useLocation();
  const { onError } = useQuerySnackbar();
  const { isLoading, data } = useQuery<IUser[]>(
    location.pathname,
    () => axios.get<IUser[]>(location.pathname).then((res) => res.data),
    { onError }
  );
  return (
    <DefaultLayout>
      <UsersTable users={data || []} loading={isLoading} />
    </DefaultLayout>
  );
};

export default Index;
