import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import AlbumIcon from "@material-ui/icons/Album";
import AccessibilityNewIcon from "@material-ui/icons/AccessibilityNew";
import MusicNoteIcon from "@material-ui/icons/MusicNote";
import GroupIcon from "@material-ui/icons/Group";
import Image from "material-ui-image";
import { useSelector } from "react-redux";
import MusicsTable from "../components/Table/Music";
import AlbumsTable from "../components/Table/Album";
import ArtistsTable from "../components/Table/Artist";
import BandsTable from "../components/Table/Band";
import MenuCard from "../components/Card/Menu";
import MusicCards from "../components/Cards/Musics";
import DefaultLayout from "../layout/Default";
import usePaginate from "../hooks/usePaginate";
import img from "../images/stave.png";
import { selectLocale } from "../slices/language";
import {
  useAlbumsQuery,
  useArtistsQuery,
  useBandsQuery,
  useDescBookmarkMusicsQuery,
  useMusicsQuery,
} from "../reactQuery/query";

const Root: React.FC = () => {
  const [musicPage, handleMusicPage] = usePaginate();
  const [albumPage, handleAlbumPage] = usePaginate();
  const [artistPage, handleArtistPage] = usePaginate();
  const [bandPage, handleBandPage] = usePaginate();
  const locale = useSelector(selectLocale);
  const musics = useMusicsQuery({
    page: musicPage,
    locale,
    q: { s: "updated_at desc" },
  });
  const albums = useAlbumsQuery({
    page: albumPage,
    locale,
    q: { s: "updated_at desc" },
  });
  const artists = useArtistsQuery({
    page: artistPage,
    locale,
    q: { s: "updated_at desc" },
  });
  const bands = useBandsQuery({
    page: bandPage,
    locale,
    q: { s: "updated_at desc" },
  });
  const descBookmarkMusics = useDescBookmarkMusicsQuery({
    page: 1,
    locale,
    q: {
      s: "bookmarks_count desc",
    },
  });
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
            <MenuCard
              icon={<MusicNoteIcon fontSize="large" />}
              title="music"
              messageId="createMusic"
              to="musics"
            />
          </Grid>
          <Grid item xs={3}>
            <MenuCard
              icon={<AlbumIcon fontSize="large" />}
              title="album"
              messageId="createAlbum"
              to="albums"
            />
          </Grid>
          <Grid item xs={3}>
            <MenuCard
              icon={<AccessibilityNewIcon fontSize="large" />}
              title="artist"
              messageId="createArtist"
              to="artists"
            />
          </Grid>
          <Grid item xs={3}>
            <MenuCard
              icon={<GroupIcon fontSize="large" />}
              title="band"
              messageId="createBand"
              to="bands"
            />
          </Grid>
        </Grid>
      </Box>
      <Box mb={3}>
        <MusicCards data={descBookmarkMusics.data?.data} />
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
