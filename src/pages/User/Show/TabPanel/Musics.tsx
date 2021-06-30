import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import MusicTable from "../../../../components/Table/Music";
import queryKey from "../../../../constants/queryKey.json";
import GraphQLClient from "../../../../gql/client";
import userMusicsQuery from "../../../../gql/query/user/musics";
import usePagenate from "../../../../hooks/usePaginate";
import { IUserType } from "../../../../interfaces";

const Posted: React.FC = () => {
  const [page, handlePage] = usePagenate();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const musics = useQuery([queryKey.USER, id, queryKey.MUSICS, page], () =>
    GraphQLClient.request<IUserType>(userMusicsQuery, {
      id,
      musicPage: page,
    }).then((res) => res.user.musics)
  );
  return (
    <MusicTable
      musics={musics.data?.data}
      loading={musics.isLoading}
      pageCount={musics.data?.pagination.totalPages}
      page={page}
      onPage={handlePage}
    />
  );
};
export default Posted;
