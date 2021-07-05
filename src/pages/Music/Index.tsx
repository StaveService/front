import React from "react";
import { useQuery } from "react-query";
import MusicsTable from "../../components/Table/Music";
import DefaultLayout from "../../layout/Default";
import queryKey from "../../constants/queryKey.json";
import useQuerySnackbar from "../../hooks/useQuerySnackbar";
import usePaginate from "../../hooks/usePaginate";
import { getMusics } from "../../gql";

const Index: React.FC = () => {
  const [page, handlePage] = usePaginate();
  const { onError } = useQuerySnackbar();
  const { isLoading, data } = useQuery(
    [queryKey.MUSICS, page],
    getMusics(page),
    { onError }
  );
  return (
    <DefaultLayout>
      <MusicsTable
        musics={data?.data || []}
        loading={isLoading}
        page={page}
        pageCount={data?.pagination.totalPages}
        onPage={handlePage}
      />
    </DefaultLayout>
  );
};
export default Index;
