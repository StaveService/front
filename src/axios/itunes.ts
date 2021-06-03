import { AxiosResponse } from "axios";
import {
  IItunesAlbum,
  IItunesArtist,
  IItunesMusic,
  IItunesResponse,
} from "../interfaces";
import { itunes } from "./axios";

type IdType = number | string | undefined;
type TermType = string | undefined;

export const lookupItunesArtist = (
  id: IdType
): Promise<IItunesResponse<IItunesArtist>> =>
  itunes
    .get<IItunesResponse<IItunesArtist>>("/lookup", {
      params: {
        id,
        entity: "musicArtist",
      },
    })
    .then((res) => res.data);
export const lookupItunesAlbum = (
  id: IdType
): Promise<IItunesResponse<IItunesAlbum>> =>
  itunes
    .get<IItunesResponse<IItunesAlbum>>("/lookup", {
      params: { id, entity: "album" },
    })
    .then((res) => res.data);
export const lookupItunesMusic = (
  id: IdType
): Promise<IItunesResponse<IItunesMusic>> =>
  itunes
    .get<IItunesResponse<IItunesMusic>>("/lookup", {
      params: { id, entity: "song" },
    })
    .then((res) => res.data);

export const searchItunesMusics = (
  term: TermType
): Promise<AxiosResponse<IItunesResponse<IItunesMusic>>> =>
  itunes.get<IItunesResponse<IItunesMusic>>("/search", {
    params: {
      entity: "song",
      term,
    },
  });
export const searchItunesArtists = (
  term: TermType
): Promise<AxiosResponse<IItunesResponse<IItunesArtist>>> =>
  itunes.get<IItunesResponse<IItunesArtist>>("/search", {
    params: {
      entity: "musicArtist",
      term,
    },
  });
export const searchItunesAlbums = (
  term: TermType
): Promise<AxiosResponse<IItunesResponse<IItunesAlbum>>> =>
  itunes.get<IItunesResponse<IItunesAlbum>>("/search", {
    params: {
      entity: "album",
      term,
    },
  });
