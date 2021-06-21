import React, { useState } from "react";
import { useRouteMatch } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import AlbumIcon from "@material-ui/icons/Album";
import Image from "material-ui-image";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { AxiosResponse } from "axios";
import {
  IAlbum,
  IAlbumLink,
  IAlbumType,
  IItunesAlbum,
} from "../../../interfaces";
import MusicsTable from "../../../components/Table/Music";
import ArtistTable from "../../../components/Table/Artist";
import LinkTable from "../../../components/Table/Link";
import ItunesAlbumDialog from "../../../components/Dialog/Itunes/Album";
import DefaultLayout from "../../../layout/Default";
import ArtistDialog from "./Dialog/Artist";
import { patchAlbumLink } from "../../../axios/axios";
import { useQuerySnackbar } from "../../../hooks/useQuerySnackbar";
import queryKey from "../../../constants/queryKey.json";
import { graphQLClient } from "../../../gql/client";
import { albumQuery } from "../../../gql/query/album";
import { selectHeaders, setHeaders } from "../../../slices/currentUser";
import { lookupItunesAlbum } from "../../../axios/itunes";

const Show: React.FC = () => {
  const [musicPage, setMusicPage] = useState(1);
  const { onError } = useQuerySnackbar();
  // react-router
  const match = useRouteMatch<{ id: string }>();
  const id = Number(match.params.id);
  // react-redux
  const dispatch = useDispatch();
  const headers = useSelector(selectHeaders);
  // react-query
  const queryClient = useQueryClient();
  const handleUpdateSuccess = (res: AxiosResponse<IAlbumLink>) => {
    dispatch(setHeaders(res.headers));
    queryClient.setQueryData<IAlbum | undefined>(
      [queryKey.ALBUM, id],
      (prev) => prev && { ...prev, link: res.data }
    );
  };
  const album = useQuery<IAlbum>(
    [queryKey.ALBUM, id],
    () =>
      graphQLClient
        .request<IAlbumType>(albumQuery, { id, musicPage })
        .then((res) => res.album),
    { onError }
  );
  const itunesAlbum = useQuery<IItunesAlbum>(
    [queryKey.ITUNES, queryKey.ALBUM, album.data?.link?.itunes],
    () =>
      lookupItunesAlbum(album.data?.link?.itunes).then((res) => res.results[0]),
    { enabled: !!album.data?.link?.itunes, onError }
  );
  const updateLinkMutation = useMutation(
    (itunesId: number) =>
      patchAlbumLink(id, album.data?.link?.id, itunesId, headers),
    { onSuccess: handleUpdateSuccess, onError }
  );
  // handlers
  const handleSelect = (selectedAlbum: IItunesAlbum) =>
    updateLinkMutation.mutate(selectedAlbum.collectionId);
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
          itunes={{
            link: itunesAlbum.data?.collectionViewUrl,
            renderDialog(open, handleClose) {
              return (
                <ItunesAlbumDialog
                  open={open}
                  onClose={handleClose}
                  onSelect={handleSelect}
                  showSearchBar
                />
              );
            },
          }}
        />
      </Box>
      <Box mb={3}>
        <MusicsTable
          musics={album.data?.musics?.data}
          loading={album.isLoading}
          page={musicPage}
          pageCount={album.data?.musics?.pagination.totalPages}
          onPage={handleMusicPage}
        />
      </Box>
      <ArtistDialog />
      <ArtistTable artists={album.data?.artists} loading={album.isLoading} />
    </DefaultLayout>
  );
};

export default Show;
