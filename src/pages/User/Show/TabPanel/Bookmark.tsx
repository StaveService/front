import React from "react";
import MusicTable from "../../../../components/Table/Music";
import BandTable from "../../../../components/Table/Band";
import ArtistTable from "../../../../components/Table/Artist";
import { IArtist, IBand, IIndexType, IMusic } from "../../../../interfaces";

interface BookmarkProps {
  musics: IIndexType<IMusic> | undefined;
  bands: IIndexType<IBand> | undefined;
  artists: IIndexType<IArtist> | undefined;
  musicPage: number;
  onMusicPage: (event: React.ChangeEvent<unknown>, value: number) => void;
  bandPage: number;
  onBandPage: (event: React.ChangeEvent<unknown>, value: number) => void;
  artistPage: number;
  onArtistPage: (event: React.ChangeEvent<unknown>, value: number) => void;
  loading: boolean;
}
const Bookmark: React.FC<BookmarkProps> = ({
  musics,
  bands,
  artists,
  loading,
  musicPage,
  onMusicPage,
  bandPage,
  onBandPage,
  artistPage,
  onArtistPage,
}: BookmarkProps) => {
  return (
    <>
      <MusicTable
        musics={musics?.data}
        pageCount={musics?.pagination.totalPages}
        loading={loading}
        page={musicPage}
        onPage={onMusicPage}
      />
      <BandTable
        bands={bands?.data}
        pageCount={bands?.pagination.totalPages}
        loading={loading}
        page={bandPage}
        onPage={onBandPage}
      />
      <ArtistTable
        artists={artists?.data}
        pageCount={artists?.pagination.totalPages}
        loading={loading}
        page={artistPage}
        onPage={onArtistPage}
      />
    </>
  );
};
export default Bookmark;
