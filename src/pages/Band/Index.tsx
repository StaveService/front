import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import BandsTable from "../../components/Table/Band";
import DefaultLayout from "../../layout/Default";
import { IBand } from "../../interfaces";
import { useQuerySnackbar } from "../../common/useQuerySnackbar";

const Index: React.FC = () => {
  const location = useLocation();
  const { onError } = useQuerySnackbar();
  const { isLoading, data } = useQuery<IBand[]>(
    location.pathname.replace("/", ""),
    () => axios.get<IBand[]>(location.pathname).then((res) => res.data),
    { onError }
  );
  return (
    <DefaultLayout>
      <BandsTable bands={data || []} loading={isLoading} />
    </DefaultLayout>
  );
};
export default Index;
