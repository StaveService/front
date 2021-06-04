import axios, { AxiosResponse } from "axios";
import {
  IAlbum,
  IAlbumLink,
  IArtist,
  IArtistLink,
  IBand,
  IBandBookmark,
  IBandLink,
  IHeaders,
  IMusic,
  IMusicBookmark,
  IMusicLink,
  ISignInFormValues,
  ISignSuccessResponse,
} from "../interfaces";
import routes from "../constants/routes.json";

export const wiki = axios.create({
  baseURL: "http://ja.wikipedia.org/w/api.php?",
  params: {
    format: "json",
  },
});
switch (process.env.NODE_ENV) {
  case "development":
    axios.defaults.baseURL = "http://localhost:3000";
    break;
  case "production":
    axios.defaults.baseURL = "";
    break;
  default:
    axios.defaults.baseURL = "http://localhost:3000";
}

export const signIn = (
  data: ISignInFormValues
): Promise<AxiosResponse<ISignSuccessResponse>> =>
  axios.post<ISignSuccessResponse>("/auth/sign_in", data);

export const postMusic = (
  userId: number | undefined,
  newMusic: Omit<IMusic, "id">,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IMusic>> =>
  axios.post<IMusic>(
    `${routes.USERS}/${userId || "undefined"}${routes.MUSICS}`,
    newMusic,
    headers
  );
export const deleteMusic = (
  userId: number,
  musicId: number,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IMusic>> =>
  axios.delete(`${routes.USERS}/${userId}${routes.MUSICS}/${musicId}`, headers);

export const postAlbum = (
  newAlbum: Omit<IAlbum, "id">,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IAlbum>> =>
  axios.post<IAlbum>(routes.ALBUMS, newAlbum, headers);
export const deleteAlbum = (
  albumId: number,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IAlbum>> =>
  axios.delete(`${routes.ALBUMS}/${albumId}`, headers);

export const postBand = (
  newBand: Omit<IBand, "id">,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IBand>> =>
  axios.post<IBand>(routes.BANDS, newBand, headers);
export const deleteBand = (
  bandId: number,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IBand>> =>
  axios.delete(`${routes.BANDS}/${bandId}`, headers);

export const postArtist = (
  newArtist: Omit<IArtist, "id">,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IArtist>> =>
  axios.post<IBand>(routes.ARTISTS, newArtist, headers);
export const deleteArtist = (
  artistId: number,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IArtist>> =>
  axios.delete(`${routes.ARTISTS}/${artistId}`, headers);

export const postMusicBookmark = (
  userId: number,
  musicId: number,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IMusicBookmark>> =>
  axios.post<IBandBookmark>(
    `${routes.USERS}/${userId}${routes.MUSICS}/${musicId}${routes.BOOKMARKS}`,
    undefined,
    headers
  );
export const deleteMusicBookmark = (
  userId: number,
  musicId: number,
  musicBookmarkId: number | undefined,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IMusicBookmark>> =>
  axios.delete(
    `${routes.USERS}/${userId}${routes.MUSICS}/${musicId}${routes.BOOKMARKS}/${
      musicBookmarkId || "undefined"
    }`,
    headers
  );
export const postBandBookmark = (
  bandId: number,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IBandBookmark>> =>
  axios.post<IBandBookmark>(
    `${routes.BANDS}/${bandId}${routes.BOOKMARKS}`,
    undefined,
    headers
  );
export const deleteBandBookmark = (
  bandId: number,
  musicBookmarkId: number | undefined,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IBandBookmark>> =>
  axios.delete(
    `${routes.BANDS}/${bandId}${routes.BOOKMARKS}/${
      musicBookmarkId || "undefined"
    }`,
    headers
  );

export const patchMusicLink = (
  userId: number,
  musicId: number,
  linkId: number | undefined,
  itunesId: number,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IMusicLink>> =>
  axios.patch(
    `${routes.USERS}/${userId}/${routes.MUSICS}/${musicId}/${routes.LINKS}/${
      linkId || "undefined"
    }`,
    { itunes: itunesId },
    headers
  );
export const patchBandLink = (
  bandId: number,
  linkId: number | undefined,
  itunesId: number,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IBandLink>> =>
  axios.patch(
    `${routes.BANDS}/${bandId}${routes.LINKS}/${linkId || "undefined"}`,
    { itunes: itunesId },
    headers
  );
export const patchArtistLink = (
  artistId: number,
  linkId: number | undefined,
  itunesId: number,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IArtistLink>> =>
  axios.patch(
    `${routes.ARTISTS}/${artistId}${routes.LINKS}/${linkId || "undefined"}`,
    { itunes: itunesId },
    headers
  );
export const patchAlbumLink = (
  albumId: number,
  linkId: number | undefined,
  itunesId: number,
  headers: IHeaders | undefined
): Promise<AxiosResponse<IAlbumLink>> =>
  axios.patch(
    `${routes.ALBUMS}/${albumId}${routes.LINKS}/${linkId || "undefined"}`,
    { itunes: itunesId },
    headers
  );
