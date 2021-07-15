import axios from "axios";
import {
  ISpotifySearchResponse,
  ISpotifySearchTypes,
  ISpotifyTrack,
  ISpotifyTypes,
} from "../interfaces";

const { REACT_APP_SPOTIFY_KEY, REACT_APP_SPOTIFY_SECRET_KEY } = process.env;
const authorization: string = btoa(
  `${REACT_APP_SPOTIFY_KEY || ""}:${REACT_APP_SPOTIFY_SECRET_KEY || ""}`
);

export const spotify = axios.create({
  baseURL: "https://api.spotify.com/v1/",
});
export const spotifyAccount = axios.create({
  baseURL: "https://accounts.spotify.com/api",
  headers: {
    Authorization: `Basic ${authorization}`,
    "Content-Type": "application/x-www-form-urlencoded",
  },
});
export function searchSpotify<T extends ISpotifyTypes>(
  type: ISpotifySearchTypes,
  q: string,
  offset: number,
  accessToken: string | undefined
): Promise<ISpotifySearchResponse<T>> {
  return spotify
    .get<ISpotifySearchResponse<T>>("/search", {
      params: { q, type, offset: offset - 1 },
      headers: {
        ...{ Authorization: `Bearer ${accessToken || ""}` },
      },
    })
    .then((res) => res.data);
}

export const getSpotifyTrack = (
  id: string | null | undefined,
  accessToken: string | undefined
): Promise<ISpotifyTrack> =>
  spotify
    .get<ISpotifyTrack>(`/tracks/${id || ""}`, {
      headers: {
        ...{ Authorization: `Bearer ${accessToken || ""}` },
      },
    })
    .then((res) => res.data);
