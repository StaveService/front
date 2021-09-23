import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import MusicTable from "../../../../components/Table/Music";
import usePaginate from "../../../../hooks/usePaginate";
import { useUserMusicsQuery } from "../../../../reactQuery/query";
import { selectLocale } from "../../../../slices/language";

const Posted: React.FC = () => {
  const [page, handlePage] = usePaginate();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const locale = useSelector(selectLocale);
  const musics = useUserMusicsQuery({ id, page, locale });
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
