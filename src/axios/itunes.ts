import { AxiosResponse } from "axios";
import {
  IItunesAlbum,
  IItunesArtist,
  IItunesMusic,
  IItunesResponse,
} from "../interfaces";
import { itunes } from "./axios";

type IdType = number | undefined;

export const getItunesArtist = (id: IdType): Promise<IItunesArtist> =>
  itunes
    .get<IItunesResponse<IItunesArtist>>("/lookup", {
      params: {
        id,
        entity: "musicArtist",
      },
    })
    .then((res) => res.data.results[0]);
export const getItunesAlbum = (id: IdType): Promise<IItunesAlbum> =>
  itunes
    .get<IItunesResponse<IItunesAlbum>>("/lookup", {
      params: { id, entity: "album" },
    })
    .then((res) => res.data.results[0]);
export const getItunesMusic = (id: IdType): Promise<IItunesMusic> =>
  itunes
    .get<IItunesResponse<IItunesMusic>>("/lookup", {
      params: { id, entity: "song" },
    })
    .then((res) => res.data.results[0]);
interface SearchArgs {
  term?: string | undefined;
  ids?: string | undefined;
}
export const searchItunesMusics = ({
  term,
  ids,
}: SearchArgs): Promise<AxiosResponse<IItunesResponse<IItunesMusic>>> =>
  itunes.get<IItunesResponse<IItunesMusic>>("/search", {
    params: {
      entity: "song",
      term,
      id: ids,
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
export const searchItunesAlbums = ({
  term,
  ids,
}: SearchArgs): Promise<AxiosResponse<IItunesResponse<IItunesAlbum>>> =>
  itunes.get<IItunesResponse<IItunesAlbum>>("/search", {
    params: {
      entity: "album",
      term,
      id: ids,
    },
  });
