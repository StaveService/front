import axios from "axios";
import { ISpotifySearchResponse, ISpotifyTrack } from "../interfaces";

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

export const searchSpotifyTrack = (
  q: string,
  accessToken: string | undefined
): Promise<ISpotifySearchResponse<ISpotifyTrack>> =>
  spotify
    .get<ISpotifySearchResponse<ISpotifyTrack>>("/search", {
      params: { q, type: "track" },
      headers: {
        ...{ Authorization: `Bearer ${accessToken || ""}` },
      },
    })
    .then((res) => res.data);

export const getSpotifyTrack = (
  id: string | undefined,
  accessToken: string | undefined
): Promise<ISpotifyTrack> =>
  spotify
    .get<ISpotifyTrack>(`/tracks/${id || ""}`, {
      headers: {
        ...{ Authorization: `Bearer ${accessToken || ""}` },
      },
    })
    .then((res) => res.data);
