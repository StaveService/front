import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { getSpotifyTrack } from "../axios/spotify";
import { ISpotifyTrack } from "../interfaces";

export const useSpotifyTrackQuery = (
  query: {
    options: UseQueryOptions<ISpotifyTrack>;
  },
  id: string | null | undefined,
  token: string | undefined
): UseQueryResult<ISpotifyTrack> => {
  const { options } = query;
  return useQuery(["spotify", "music", id], () => getSpotifyTrack(id, token), {
    ...options,
    enabled: !!id && !!token,
  });
};

export default null;
