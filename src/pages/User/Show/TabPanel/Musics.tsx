import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import MusicTable from "../../../../components/Table/Music";
import queryKey from "../../../../constants/queryKey.json";
import { getUserMusics } from "../../../../gql";
import usePaginate from "../../../../hooks/usePaginate";

const Posted: React.FC = () => {
  const [page, handlePage] = usePaginate();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const musics = useQuery(
    [queryKey.USER, id, queryKey.MUSICS, page],
    getUserMusics(id, page)
  );
  return (
    <MusicTable
      musics={musics.data?.data || []}
      loading={musics.isLoading}
      pageCount={musics.data?.pagination.totalPages}
      page={page}
      onPage={handlePage}
    />
  );
};
export default Posted;
