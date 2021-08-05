import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import MusicTable from "../../../../components/Table/Music";
import BandTable from "../../../../components/Table/Band";
import ArtistTable from "../../../../components/Table/Artist";
import AlbumTable from "../../../../components/Table/Album";
import queryKey from "../../../../constants/queryKey.json";
import usePaginate from "../../../../hooks/usePaginate";
import {
  getUserBookmarkedAlbums,
  getUserBookmarkedArtists,
  getUserBookmarkedBands,
  getUserBookmarkedMusics,
} from "../../../../gql";
import { selectLocale } from "../../../../slices/language";

const Bookmark: React.FC = () => {
  const [bookmarkedMusicPage, handleBookmarkedMusicPage] = usePaginate();
  const [bookmarkedArtistPage, handleBookmarkedArtistPage] = usePaginate();
  const [bookmarkedBandPage, handleBookmarkedBandPage] = usePaginate();
  const [bookmarkedAlbumPage, handleBookmarkedAlbumPage] = usePaginate();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const locale = useSelector(selectLocale);
  const bookmarkedMusics = useQuery(
    [
      queryKey.USER,
      id,
      queryKey.BOOKMARKS,
      queryKey.MUSICS,
      bookmarkedMusicPage,
      locale,
    ],
    getUserBookmarkedMusics(id, bookmarkedMusicPage, locale)
  );
  const bookmarkedBands = useQuery(
    [
      queryKey.USER,
      id,
      queryKey.BOOKMARKS,
      queryKey.BANDS,
      bookmarkedBandPage,
      locale,
    ],
    getUserBookmarkedBands(id, bookmarkedBandPage, locale)
  );
  const bookmarkedArtists = useQuery(
    [
      queryKey.USER,
      id,
      queryKey.BOOKMARKS,
      queryKey.ARTISTS,
      bookmarkedArtistPage,
      locale,
    ],
    getUserBookmarkedArtists(id, bookmarkedArtistPage, locale)
  );
  const bookmarkedAlbums = useQuery(
    [
      queryKey.USER,
      id,
      queryKey.BOOKMARKS,
      queryKey.ALBUMS,
      bookmarkedAlbumPage,
      locale,
    ],
    getUserBookmarkedAlbums(id, bookmarkedAlbumPage, locale)
  );

  return (
    <>
      <MusicTable
        musics={bookmarkedMusics.data?.data || []}
        pageCount={bookmarkedMusics.data?.pagination.totalPages}
        loading={bookmarkedMusics.isLoading}
        page={bookmarkedMusicPage}
        onPage={handleBookmarkedMusicPage}
      />
      <BandTable
        bands={bookmarkedBands.data?.data || []}
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
      <AlbumTable
        albums={bookmarkedAlbums.data?.data || []}
        pageCount={bookmarkedAlbums.data?.pagination.totalPages}
        loading={bookmarkedAlbums.isLoading}
        page={bookmarkedAlbumPage}
        onPage={handleBookmarkedAlbumPage}
      />
    </>
  );
};
export default Bookmark;
