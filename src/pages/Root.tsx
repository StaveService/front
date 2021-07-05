import React, { useEffect } from "react";
import { useQuery } from "react-query";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import MusicsTable from "../components/Table/Music";
import MenuCard from "../components/Card/Menu";
import MusicCards from "../components/Cards/Musics";
import DefaultLayout from "../layout/Default";
import queryKey from "../constants/queryKey.json";
import useQuerySnackbar from "../hooks/useQuerySnackbar";
import usePaginate from "../hooks/usePaginate";
import { getMusics } from "../gql";

const Root: React.FC = () => {
  const [page, handlePage] = usePaginate();
  const { onError } = useQuerySnackbar();
  const musics = useQuery([queryKey.MUSICS, page], getMusics(page), {
    onError,
  });
  const bookmarkedMusics = useQuery(
    [queryKey.MUSICS, 1, queryKey.BOOKMARKS],
    getMusics(1, { s: "bookmarks_count asc" }),
    {
      onError,
    }
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
      <MusicCards data={bookmarkedMusics.data?.data} />
      <MusicsTable
        musics={musics.data?.data || []}
        loading={musics.isLoading}
        page={page}
        pageCount={musics.data?.pagination?.totalPages}
        onPage={handlePage}
      />
    </DefaultLayout>
  );
};
export default Root;
