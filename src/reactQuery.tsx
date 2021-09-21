import { useQuery, UseQueryResult } from "react-query";
import { getAlbums, getArtists, getBands, getMusics } from "./gql";
import useQuerySnackbar from "./hooks/useQuerySnackbar";
import { IAlbum, IArtist, IBand, IIndexType, IMusic } from "./interfaces";
import { ILocale } from "./slices/language";

type GetIndexFnArgs = [
  page: number,
  locale: ILocale,
  q?: { s?: string; [key: string]: string | undefined }
];
function useIndexQuery<T>(
  key: string,
  fn: (
    page: number,
    locale: ILocale,
    q?: { s?: string; [key: string]: string | undefined }
  ) => () => Promise<IIndexType<T>>,
  ...args: GetIndexFnArgs
): UseQueryResult<IIndexType<T>> {
  const { onError } = useQuerySnackbar();
  return useQuery(
    [key, args[0], args[1], args[2]],
    fn(args[0], args[1], args[2]),
    {
      onError,
    }
  );
}
export const useMusicsQuery = (
  ...args: GetIndexFnArgs
): UseQueryResult<IIndexType<IMusic>> =>
  useIndexQuery("musics", getMusics, ...args);

export const useDescBookmarkMusicsQuery = (
  ...args: GetIndexFnArgs
): UseQueryResult<IIndexType<IMusic>> =>
  useIndexQuery("descBookmarkMusics", getMusics, ...args);

export const useAlbumsQuery = (
  ...args: GetIndexFnArgs
): UseQueryResult<IIndexType<IAlbum>> =>
  useIndexQuery("albums", getAlbums, ...args);

export const useArtistsQuery = (
  ...args: GetIndexFnArgs
): UseQueryResult<IIndexType<IArtist>> =>
  useIndexQuery("artists", getArtists, ...args);

export const useBandsQuery = (
  ...args: GetIndexFnArgs
): UseQueryResult<IIndexType<IBand>> =>
  useIndexQuery("bands", getBands, ...args);
