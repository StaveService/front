import axios from "axios-jsonp-pro";
import {
  IItunesAlbum,
  IItunesArtist,
  IItunesMusic,
  IItunesResponse,
} from "../interfaces";

const limit = 100;
const itunes = axios.create({
  baseURL: "https://itunes.apple.com",
});
type IdType = number | string | undefined;
type TermType = string | undefined;

export const lookupItunesArtist = (
  id: IdType
): Promise<IItunesResponse<IItunesArtist>> =>
  itunes.jsonp<null, IItunesResponse<IItunesArtist>>("/lookup", {
    params: {
      id,
      entity: "musicArtist",
    },
  });
export const lookupItunesAlbum = (
  id: IdType
): Promise<IItunesResponse<IItunesAlbum>> =>
  itunes.jsonp<null, IItunesResponse<IItunesAlbum>>("/lookup", {
    params: { id, entity: "album" },
  });
export const lookupItunesMusic = (
  id: IdType
): Promise<IItunesResponse<IItunesMusic>> =>
  itunes.jsonp<null, IItunesResponse<IItunesMusic>>("/lookup", {
    params: { id, entity: "song" },
  });

export const searchItunesMusics = (
  term: TermType
): Promise<IItunesResponse<IItunesMusic>> =>
  itunes.jsonp<null, IItunesResponse<IItunesMusic>>("/search", {
    params: {
      entity: "song",
      term,
      limit,
      offset: 2,
    },
  });
export const searchItunesArtists = (
  term: TermType
): Promise<IItunesResponse<IItunesArtist>> =>
  itunes.jsonp<null, IItunesResponse<IItunesArtist>>("/search", {
    params: {
      entity: "musicArtist",
      term,
      limit,
    },
  });
export const searchItunesAlbums = (
  term: TermType
): Promise<IItunesResponse<IItunesAlbum>> =>
  itunes.jsonp<null, IItunesResponse<IItunesAlbum>>("/search", {
    params: {
      entity: "album",
      term,
      limit,
    },
  });
