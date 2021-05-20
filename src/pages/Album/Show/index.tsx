import React, { useState } from "react";
import { useRouteMatch } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import AlbumIcon from "@material-ui/icons/Album";
import Image from "material-ui-image";
import { useQuery } from "react-query";
import {
  IAlbum,
  IAlbumType,
  IItunesAlbum,
  IItunesResponse,
} from "../../../interfaces";
import MusicsTable from "../../../components/Table/Music";
import ArtistTable from "../../../components/Table/Artist";
import LinkTable from "../../../components/Table/Link";
import DefaultLayout from "../../../layout/Default";
import ArtistDialog from "./Dialog/Artist";
import { itunes } from "../../../axios";
import { useQuerySnackbar } from "../../../common/useQuerySnackbar";
import queryKey from "../../../gql/queryKey.json";
import { graphQLClient } from "../../../gql/client";
import { albumQuery } from "../../../gql/query/album";

const Show: React.FC = () => {
  const [musicPage, setMusicPage] = useState(1);
  const match = useRouteMatch<{ id: string }>();
  const id = Number(match.params.id);
  const { onError } = useQuerySnackbar();
  const album = useQuery<IAlbum>(
    [queryKey.ALBUM, id],
    () =>
      graphQLClient
        .request<IAlbumType>(albumQuery, { id, musicPage })
        .then((res) => res.album),
    { onError }
  );
  const itunesAlbum = useQuery<IItunesAlbum>(
    [queryKey.ITUNES, queryKey.ALBUM, album.data?.albumLink?.itunes],
    () =>
      itunes
        .get<IItunesResponse<IItunesAlbum>>("/lookup", {
          params: { id: album.data?.albumLink?.itunes, entity: "album" },
        })
        .then((res) => res.data.results[0]),
    { enabled: !!album.data?.albumLink?.itunes, onError }
  );
  // handlers
  const handleMusicPage = (event: React.ChangeEvent<unknown>, value: number) =>
    setMusicPage(value);
  return (
    <DefaultLayout>
      <Typography variant="h5">
        <AlbumIcon />
        {album.data?.title}
      </Typography>
      <Box height="100px" width="100px" m="auto">
        <Image src={itunesAlbum.data?.artworkUrl100 || "undefiend"} />
      </Box>
      <Box mb={3}>
        <LinkTable
          links={{ itunes: itunesAlbum.data?.collectionViewUrl }}
          itunes
        />
      </Box>
      <Box mb={3}>
        <MusicsTable
          data={album.data?.musics?.data}
          loading={album.isLoading}
          page={musicPage}
          pageCount={album.data?.musics?.pagination.totalPages}
          onPage={handleMusicPage}
        />
      </Box>
      <ArtistDialog />
      <ArtistTable data={album.data?.artists} loading={album.isLoading} />
    </DefaultLayout>
  );
};

export default Show;
