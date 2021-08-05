import React, { useEffect } from "react";
import { useQuery } from "react-query";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Image from "material-ui-image";
import { useSelector } from "react-redux";
import MusicsTable from "../components/Table/Music";
import AlbumsTable from "../components/Table/Album";
import ArtistsTable from "../components/Table/Artist";
import BandsTable from "../components/Table/Band";
import MenuCard from "../components/Card/Menu";
import MusicCards from "../components/Cards/Musics";
import DefaultLayout from "../layout/Default";
import queryKey from "../constants/queryKey.json";
import useQuerySnackbar from "../hooks/useQuerySnackbar";
import usePaginate from "../hooks/usePaginate";
import { getAlbums, getArtists, getBands, getMusics } from "../gql";
import img from "../images/stave.png";
import { selectLocale } from "../slices/language";

const Root: React.FC = () => {
  const [musicPage, handleMusicPage] = usePaginate();
  const [albumPage, handleAlbumPage] = usePaginate();
  const [artistPage, handleArtistPage] = usePaginate();
  const [bandPage, handleBandPage] = usePaginate();
  const { onError } = useQuerySnackbar();
  const locale = useSelector(selectLocale);
  const musics = useQuery(
    [queryKey.MUSICS, musicPage, locale],
    getMusics(musicPage, locale, { s: "updated_at desc" }),
    {
      onError,
    }
  );
  const albums = useQuery(
    [queryKey.ALBUMS, albumPage, locale],
    getAlbums(albumPage, locale, { s: "updated_at desc" }),
    {
      onError,
    }
  );
  const artists = useQuery(
    [queryKey.ARTISTS, artistPage, locale],
    getArtists(artistPage, locale, { s: "updated_at desc" }),
    {
      onError,
    }
  );
  const bands = useQuery(
    [queryKey.BANDS, bandPage, locale],
    getBands(bandPage, locale, { s: "updated_at desc" }),
    {
      onError,
    }
  );
  const bookmarkedMusics = useQuery(
    [queryKey.MUSICS, 1, queryKey.BOOKMARKS, locale],
    getMusics(1, locale, { s: "bookmarks_count desc" }),
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
        <Link
          href="https://staveservice.github.io/docs/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aspectRatio={16 / 9} src={img} />
        </Link>
      </Box>
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
      <Box mb={3}>
        <MusicCards data={bookmarkedMusics.data?.data} />
      </Box>
      <Box mb={3}>
        <Typography variant="h4">Musics</Typography>
        <MusicsTable
          musics={musics.data?.data || []}
          loading={musics.isLoading}
          page={musicPage}
          pageCount={musics.data?.pagination?.totalPages}
          onPage={handleMusicPage}
        />
      </Box>
      <Box mb={3}>
        <Typography variant="h4">Albums</Typography>
        <AlbumsTable
          albums={albums.data?.data || []}
          loading={albums.isLoading}
          page={albumPage}
          pageCount={albums.data?.pagination?.totalPages}
          onPage={handleAlbumPage}
        />
      </Box>
      <Box mb={3}>
        <Typography variant="h4">Bands</Typography>
        <BandsTable
          bands={bands.data?.data || []}
          loading={bands.isLoading}
          page={bandPage}
          pageCount={bands.data?.pagination?.totalPages}
          onPage={handleBandPage}
        />
      </Box>
      <Box mb={3}>
        <Typography variant="h4">Artists</Typography>
        <ArtistsTable
          artists={artists.data?.data || []}
          loading={artists.isLoading}
          page={artistPage}
          pageCount={artists.data?.pagination?.totalPages}
          onPage={handleArtistPage}
        />
      </Box>
    </DefaultLayout>
  );
};
export default Root;
