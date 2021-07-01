import React, { useEffect } from "react";
import { useQuery } from "react-query";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import MusicsTable from "../components/Table/Music";
import MenuCard from "../components/Card/Menu";
import DefaultLayout from "../layout/Default";
import queryKey from "../constants/queryKey.json";
import useQuerySnackbar from "../hooks/useQuerySnackbar";
import { getMusics } from "../gql";
import usePaginate from "../hooks/usePaginate";

const Root: React.FC = () => {
  const [page, handlePage] = usePaginate();
  const { onError } = useQuerySnackbar();
  const { isLoading, data } = useQuery(
    [queryKey.MUSICS, page],
    getMusics(page),
    { onError }
  );
  useEffect(() => {
    const params = new URL(window.location.href).searchParams;
    const code = params.get("code");
    if (code) {
      const prevWindow = window.opener as Window;
      if (prevWindow) prevWindow.getSpotifyCode(code);
      window.close();
    }
  }, []);
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
        musics={data?.data}
        loading={isLoading}
        page={page}
        pageCount={data?.pagination?.totalPages}
        onPage={handlePage}
      />
    </DefaultLayout>
  );
};
export default Root;
