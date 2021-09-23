import { useQuery, UseQueryResult } from "react-query";
import {
  lookupItunesAlbum,
  lookupItunesArtist,
  lookupItunesMusic,
  LookupQueryFnArgs,
} from "../axios/itunes";
import useQuerySnackbar from "../hooks/useQuerySnackbar";
import {
  IItunesAlbum,
  IItunesArtist,
  IItunesMusic,
  IItunesResponse,
} from "../interfaces";

function useLookup<T extends IItunesMusic | IItunesAlbum | IItunesArtist>(
  query: {
    key: string;
    fn: (fnId: LookupQueryFnArgs<T>) => Promise<IItunesResponse<T>>;
  },
  args: LookupQueryFnArgs<T>
) {
  const { id, options } = args;
  const { key, fn } = query;
  const { onError } = useQuerySnackbar();
  return useQuery(
    ["itunes", key, id],
    () => fn({ id }).then((res) => res.results),
    {
      ...options,
      enabled: !!id,
      onError,
    }
  );
}
export const useLookupItunesMusic = ({
  id,
  options,
}: LookupQueryFnArgs<IItunesMusic>): UseQueryResult<IItunesMusic[]> =>
  useLookup({ key: "music", fn: lookupItunesMusic }, { id, options });

export const useLookupItunesAlbum = ({
  id,
  options,
}: LookupQueryFnArgs<IItunesAlbum>): UseQueryResult<IItunesAlbum[]> =>
  useLookup({ key: "album", fn: lookupItunesAlbum }, { id, options });

export const useLookupItunesArtist = ({
  id,
  options,
}: LookupQueryFnArgs<IItunesArtist>): UseQueryResult<IItunesArtist[]> =>
  useLookup({ key: "artist", fn: lookupItunesArtist }, { id, options });
