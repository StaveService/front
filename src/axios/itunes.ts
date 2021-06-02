import { AxiosResponse } from "axios";
import {
  IItunesAlbum,
  IItunesArtist,
  IItunesMusic,
  IItunesResponse,
} from "../interfaces";
import { itunes } from "./axios";

export const getItunesArtist = (
  id: number | undefined
): Promise<IItunesArtist> =>
  itunes
    .get<IItunesResponse<IItunesArtist>>("/lookup", {
      params: {
        id,
        entity: "musicArtist",
      },
    })
    .then((res) => res.data.results[0]);
export const searchItunesMusics = (
  term: string | undefined
): Promise<AxiosResponse<IItunesResponse<IItunesMusic>>> =>
  itunes.get<IItunesResponse<IItunesMusic>>("/search", {
    params: {
      entity: "song",
      term,
    },
  });
export const searchItunesArtists = (
  term: string | undefined
): Promise<AxiosResponse<IItunesResponse<IItunesArtist>>> =>
  itunes.get<IItunesResponse<IItunesArtist>>("/search", {
    params: {
      entity: "musicArtist",
      term,
    },
  });
export const searchItunesAlbums = (
  term: string | undefined
): Promise<AxiosResponse<IItunesResponse<IItunesAlbum>>> =>
  itunes.get<IItunesResponse<IItunesAlbum>>("/search", {
    params: {
      entity: "album",
      term,
    },
  });
