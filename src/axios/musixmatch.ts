import axios from "axios";
import {
  IGetTrackLyric,
  IMusixmatchResponse,
  ISearchTrack,
} from "../interfaces";

export const musixmatch = axios.create({
  baseURL: "https://api.musixmatch.com/ws/1.1",
  params: {
    apikey: process.env.REACT_APP_MUSIXMATCH_KEY,
  },
});
export const searchTracks = (
  query: string
): Promise<IMusixmatchResponse<ISearchTrack>> =>
  musixmatch
    .get<IMusixmatchResponse<ISearchTrack>>("track.search", {
      params: { q_track: query },
    })
    .then((res) => res.data);
export const getTrackLyric = (
  trackId: number | undefined
): Promise<IMusixmatchResponse<IGetTrackLyric>> =>
  musixmatch
    .get<IMusixmatchResponse<IGetTrackLyric>>("track.lyrics.get", {
      params: {
        track_id: trackId,
      },
    })
    .then((res) => res.data);
export default undefined;
