import axios from "axios-jsonp-pro";
import {
  IItunesAlbum,
  IItunesArtist,
  IItunesMusic,
  IItunesResponse,
} from "../interfaces";

export const limit = 400;
const itunes = axios.create({
  baseURL: "https://itunes.apple.com",
});
type IdType = number | string;
type TermType = string | undefined;

export const lookupItunesArtist = <T extends IdType>(
  id: T | null | undefined
): Promise<IItunesResponse<IItunesArtist>> =>
  itunes.jsonp<null, IItunesResponse<IItunesArtist>>("/lookup", {
    params: {
      id,
      entity: "musicArtist",
    },
  });
export const lookupItunesAlbum = <T extends IdType>(
  id: T | null | undefined
): Promise<IItunesResponse<IItunesAlbum>> =>
  itunes.jsonp<null, IItunesResponse<IItunesAlbum>>("/lookup", {
    params: { id, entity: "album" },
  });
export const lookupItunesMusic = <T extends IdType>(
  id: T | null | undefined
): Promise<IItunesResponse<IItunesMusic>> =>
  itunes.jsonp<null, IItunesResponse<IItunesMusic>>("/lookup", {
    params: { id, entity: "song" },
  });

export const searchItunesMusics = (
  term: TermType,
  offset: number
): Promise<IItunesResponse<IItunesMusic>> =>
  itunes.jsonp<null, IItunesResponse<IItunesMusic>>("/search", {
    params: {
      entity: "song",
      term,
      limit,
      offset,
    },
  });
export const searchItunesArtists = (
  term: TermType,
  offset: number
): Promise<IItunesResponse<IItunesArtist>> =>
  itunes.jsonp<null, IItunesResponse<IItunesArtist>>("/search", {
    params: {
      entity: "musicArtist",
      term,
      limit,
      offset,
    },
  });
export const searchItunesAlbums = (
  term: TermType,
  offset: number
): Promise<IItunesResponse<IItunesAlbum>> =>
  itunes.jsonp<null, IItunesResponse<IItunesAlbum>>("/search", {
    params: {
      entity: "album",
      term,
      limit,
      offset,
    },
  });
