import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
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

const Bookmark: React.FC = () => {
  const [bookmarkedMusicPage, handleBookmarkedMusicPage] = usePaginate();
  const [bookmarkedArtistPage, handleBookmarkedArtistPage] = usePaginate();
  const [bookmarkedBandPage, handleBookmarkedBandPage] = usePaginate();
  const [bookmarkedAlbumPage, handleBookmarkedAlbumPage] = usePaginate();
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
    getUserBookmarkedMusics(id, bookmarkedMusicPage)
  );
  const bookmarkedBands = useQuery(
    [queryKey.USER, id, queryKey.BOOKMARKS, queryKey.BANDS, bookmarkedBandPage],
    getUserBookmarkedBands(id, bookmarkedBandPage)
  );
  const bookmarkedArtists = useQuery(
    [
      queryKey.USER,
      id,
      queryKey.BOOKMARKS,
      queryKey.ARTISTS,
      bookmarkedArtistPage,
    ],
    getUserBookmarkedArtists(id, bookmarkedArtistPage)
  );
  const bookmarkedAlbums = useQuery(
    [
      queryKey.USER,
      id,
      queryKey.BOOKMARKS,
      queryKey.ALBUMS,
      bookmarkedAlbumPage,
    ],
    getUserBookmarkedAlbums(id, bookmarkedAlbumPage)
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
