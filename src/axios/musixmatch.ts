import axios from "axios-jsonp-pro";
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
  musixmatch.jsonp<null, IMusixmatchResponse<ISearchTrack>>("track.search", {
    params: { q_track: query },
  });
export const getTrackLyric = (
  trackId: number | null | undefined
): Promise<IMusixmatchResponse<IGetTrackLyric>> =>
  musixmatch.jsonp<null, IMusixmatchResponse<IGetTrackLyric>>(
    "track.lyrics.get",
    {
      params: {
        track_id: trackId,
      },
    }
  );
