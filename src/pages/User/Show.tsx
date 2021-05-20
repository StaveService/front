import { useQuery } from "react-query";
import React, { useState } from "react";
import { useRouteMatch } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import MusicsTable from "../../components/Table/Music";
import DefaultLayout from "../../layout/Default";
import { IUserType } from "../../interfaces";
import { useQuerySnackbar } from "../../common/useQuerySnackbar";
import { graphQLClient } from "../../gql/client";
import { userQuery } from "../../gql/query/user";
import queryKey from "../../gql/queryKey.json";

const Show: React.FC = () => {
  const [musicPage, setMusicPage] = useState(1);
  const match = useRouteMatch<{ id: string }>();
  const id = Number(match.params.id);
  const { onError } = useQuerySnackbar();
  const { isLoading, data } = useQuery<IUserType>(
    [queryKey.USER, id, { musicPage }],
    () => graphQLClient.request(userQuery, { id, musicPage }),
    { onError }
  );
  const handleMusicPage = (event: React.ChangeEvent<unknown>, value: number) =>
    setMusicPage(value);
  return (
    <DefaultLayout>
      <Typography variant="h5">{data?.user.nickname}</Typography>
      <MusicsTable
        data={data?.user.musics?.data}
        loading={isLoading}
        page={musicPage}
        pageCount={data?.user.musics?.pagination.totalPages}
        onPage={handleMusicPage}
      />
    </DefaultLayout>
  );
};
export default Show;
