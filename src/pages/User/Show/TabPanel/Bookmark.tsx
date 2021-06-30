import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import MusicTable from "../../../../components/Table/Music";
import BandTable from "../../../../components/Table/Band";
import ArtistTable from "../../../../components/Table/Artist";
import { IUserType } from "../../../../interfaces";
import userBookmarkMusicsQuery from "../../../../gql/query/user/bookmarkMusics";
import queryKey from "../../../../constants/queryKey.json";
import graphQLCilent from "../../../../gql/client";
import userBookmarkArtistsQuery from "../../../../gql/query/user/bookmarkArtists";
import userBookmarkBandsQuery from "../../../../gql/query/user/bookmarkBands";
import usePagenate from "../../../../hooks/usePaginate";

const Bookmark: React.FC = () => {
  const [bookmarkedMusicPage, handleBookmarkedMusicPage] = usePagenate();
  const [bookmarkedArtistPage, handleBookmarkedArtistPage] = usePagenate();
  const [bookmarkedBandPage, handleBookmarkedBandPage] = usePagenate();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const bookmarkedMusics = useQuery(
    [
      queryKey.USER,
      id,
      queryKey.BOOKMARKS,
      queryKey.MUSICS,
      bookmarkedMusicPage,
    ],
    () =>
      graphQLCilent
        .request<IUserType>(userBookmarkMusicsQuery, {
          id,
          bookmarkedMusicPage,
        })
        .then((res) => res.user.bookmarkedMusics)
  );
  const bookmarkedBands = useQuery(
    [queryKey.USER, id, queryKey.BOOKMARKS, queryKey.BANDS, bookmarkedBandPage],
    () =>
      graphQLCilent
        .request<IUserType>(userBookmarkBandsQuery, {
          id,
          bookmarkedBandPage,
        })
        .then((res) => res.user.bookmarkedBands)
  );
  const bookmarkedArtists = useQuery(
    [
      queryKey.USER,
      id,
      queryKey.BOOKMARKS,
      queryKey.ARTISTS,
      bookmarkedArtistPage,
    ],
    () =>
      graphQLCilent
        .request<IUserType>(userBookmarkArtistsQuery, {
          id,
          bookmarkedArtistPage,
        })
        .then((res) => res.user.bookmarkedArtists)
  );

  return (
    <>
      <MusicTable
        musics={bookmarkedMusics.data?.data}
        pageCount={bookmarkedMusics.data?.pagination.totalPages}
        loading={bookmarkedMusics.isLoading}
        page={bookmarkedMusicPage}
        onPage={handleBookmarkedMusicPage}
      />
      <BandTable
        bands={bookmarkedBands.data?.data}
        pageCount={bookmarkedBands.data?.pagination.totalPages}
        loading={bookmarkedBands.isLoading}
        page={bookmarkedBandPage}
        onPage={handleBookmarkedBandPage}
      />
      <ArtistTable
        artists={bookmarkedArtists.data?.data}
        pageCount={bookmarkedArtists.data?.pagination.totalPages}
        loading={bookmarkedArtists.isLoading}
        page={bookmarkedArtistPage}
        onPage={handleBookmarkedArtistPage}
      />
    </>
  );
};
export default Bookmark;
