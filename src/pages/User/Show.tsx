import { useQuery } from "react-query";
import React, { useState } from "react";
import { useRouteMatch } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import MusicTable from "../../components/Table/Music";
import BandTable from "../../components/Table/Band";
import ArtistTable from "../../components/Table/Artist";
import DefaultLayout from "../../layout/Default";
import { IUserType } from "../../interfaces";
import { useQuerySnackbar } from "../../common/useQuerySnackbar";
import { graphQLClient } from "../../gql/client";
import { userQuery } from "../../gql/query/user";
import queryKey from "../../gql/queryKey.json";

const Show: React.FC = () => {
  const [musicPage, setMusicPage] = useState(1);
  const [bookmarkedMusicPage, setBookmarkedMusicPage] = useState(1);
  const [bookmarkedBandPage, setBookmarkedBandPage] = useState(1);
  const [bookmarkedArtistPage, setBookmarkedArtistPage] = useState(1);
  const match = useRouteMatch<{ id: string }>();
  const id = Number(match.params.id);
  const { onError } = useQuerySnackbar();
  const { isLoading, data } = useQuery<IUserType>(
    [
      queryKey.USER,
      id,
      {
        musicPage,
        bookmarkedMusicPage,
        bookmarkedBandPage,
        bookmarkedArtistPage,
      },
    ],
    () =>
      graphQLClient.request(userQuery, {
        id,
        musicPage,
        bookmarkedMusicPage,
        bookmarkedBandPage,
        bookmarkedArtistPage,
      }),
    { onError }
  );
  const handleMusicPage = (event: React.ChangeEvent<unknown>, value: number) =>
    setMusicPage(value);
  const handleBookmarkedMusicPage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => setBookmarkedMusicPage(value);
  const handleBookmarkedBandPage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => setBookmarkedBandPage(value);
  const handleBookmarkedArtistPage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => setBookmarkedArtistPage(value);
  return (
    <DefaultLayout>
      <Typography variant="h6">{data?.user.nickname}</Typography>
      <MusicTable
        data={data?.user.musics?.data}
        loading={isLoading}
        page={musicPage}
        pageCount={data?.user.musics?.pagination.totalPages}
        onPage={handleMusicPage}
      />
      <Typography variant="h5">Bookmark</Typography>
      <MusicTable
        data={data?.user.bookmarkedMusics?.data}
        loading={isLoading}
        page={bookmarkedMusicPage}
        pageCount={data?.user.bookmarkedMusics?.pagination.totalPages}
        onPage={handleBookmarkedMusicPage}
      />
      <BandTable
        data={data?.user.bookmarkedBands?.data}
        loading={isLoading}
        page={bookmarkedBandPage}
        pageCount={data?.user.bookmarkedBands?.pagination.totalPages}
        onPage={handleBookmarkedBandPage}
      />
      <ArtistTable
        data={data?.user.bookmarkedArtists?.data}
        loading={isLoading}
        page={bookmarkedArtistPage}
        pageCount={data?.user.bookmarkedArtists?.pagination.totalPages}
        onPage={handleBookmarkedArtistPage}
      />
    </DefaultLayout>
  );
};
export default Show;
