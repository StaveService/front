import React, { useState } from "react";
import { useQuery } from "react-query";
import { useSnackbar } from "notistack";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import MusicsTable from "../components/Table/Music";
import MenuCard from "../components/Card/Menu";
import DefaultLayout from "../layout/Default";
import queryKey from "../gql/queryKey.json";
import { graphQLClient } from "../gql/client";
import { musicsQuery } from "../gql/query/musics";
import { IMusicsType } from "../interfaces";

const Root: React.FC = () => {
  const [page, setPage] = useState(1);
  const { enqueueSnackbar } = useSnackbar();
  const onError = (err: unknown) =>
    enqueueSnackbar(String(err), { variant: "error" });
  const { isLoading, data } = useQuery<IMusicsType>(
    [queryKey.MUSICS, page],
    () => graphQLClient.request(musicsQuery, { page }),
    { onError }
  );
  const handlePage = (event: React.ChangeEvent<unknown>, value: number) =>
    setPage(value);
  return (
    <DefaultLayout>
      <Box mb={3}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <MenuCard type="Music" />
          </Grid>
          <Grid item xs={3}>
            <MenuCard type="Album" />
          </Grid>
          <Grid item xs={3}>
            <MenuCard type="Artist" />
          </Grid>
          <Grid item xs={3}>
            <MenuCard type="Band" />
          </Grid>
        </Grid>
      </Box>
      <MusicsTable
        data={data?.musics?.data}
        loading={isLoading}
        page={page}
        pageCount={data?.musics?.pagination?.totalPages}
        onPage={handlePage}
      />
    </DefaultLayout>
  );
};
export default Root;
