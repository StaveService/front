import axios from "axios-jsonp-pro";
import { UseQueryOptions } from "react-query";
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
type TermType = string | undefined;
export interface LookupQueryFnArgs<T> {
  id: number | string | null | undefined;
  options?: UseQueryOptions<T[]>;
}

export const lookupItunesArtist = ({
  id,
}: LookupQueryFnArgs<IItunesArtist>): Promise<IItunesResponse<IItunesArtist>> =>
  itunes.jsonp<null, IItunesResponse<IItunesArtist>>("/lookup", {
    params: {
      id,
      entity: "musicArtist",
    },
  });
export const lookupItunesAlbum = ({
  id,
}: LookupQueryFnArgs<IItunesAlbum>): Promise<IItunesResponse<IItunesAlbum>> =>
  itunes.jsonp<null, IItunesResponse<IItunesAlbum>>("/lookup", {
    params: { id, entity: "album" },
  });
export const lookupItunesMusic = ({
  id,
}: LookupQueryFnArgs<IItunesMusic>): Promise<IItunesResponse<IItunesMusic>> =>
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
